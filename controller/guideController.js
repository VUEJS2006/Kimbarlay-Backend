import db from "../config/db.js"
import { asyncHandel } from "../middleware/asyncMiddleware.js"
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid"

import { deleteManyStoredImages, storeImageToDynamicFolder } from "../utils/image.js";

const getGuideImageEntries = (files) => {
    const imageEntries = new Map();

    if (Array.isArray(files)) {
        files.forEach((file, index) => imageEntries.set(index + 1, file));
    } else if (files) {
        (files.images || []).forEach((file, index) => {
            imageEntries.set(index + 1, file);
        });

        for (let position = 1; position <= 6; position++) {
            const file = files[`image${position}`]?.[0];
            if (file) {
                imageEntries.set(position, file);
            }
        }
    }

    return [...imageEntries.entries()].sort(([first], [second]) => first - second);
};

const getGuideImageCount = (files) => {
    if (Array.isArray(files)) {
        return files.length;
    }

    return Object.values(files || {}).reduce(
        (count, fieldFiles) => count + fieldFiles.length,
        0
    );
};

const saveGuideImage = async (file, uploadFolder) => {
    const fileName = `${uuid()}.webp`;

    await sharp(file.buffer)
        .resize({
            width: 1920,
            withoutEnlargement: true
        })
        .webp({
            quality: 90
        })
        .toFile(path.join(uploadFolder, fileName));

    return `images/guide/${fileName}`;
};

const updateGuideImage = async (guideId, position, file, uploadFolder) => {
    const imagePath = await saveGuideImage(file, uploadFolder);
    let existingImages;

    try {
        [existingImages] = await db.query(
            `
            SELECT image
            FROM guide_images
            WHERE guide_id = ? AND position = ?
            `,
            [guideId, position]
        );

        if (existingImages.length > 0) {
            await db.query(
                `
                UPDATE guide_images
                SET image = ?
                WHERE guide_id = ? AND position = ?
                `,
                [imagePath, guideId, position]
            );
        } else {
            await db.query(
                `
                INSERT INTO guide_images (guide_id, position, image)
                VALUES (?, ?, ?)
                `,
                [guideId, position, imagePath]
            );
        }
    } catch (error) {
        const newImagePath = path.join(process.cwd(), imagePath);
        if (fs.existsSync(newImagePath)) {
            await fs.promises.unlink(newImagePath);
        }
        throw error;
    }

    const oldImage = existingImages[0]?.image;
    if (oldImage) {
        const oldImagePath = path.join(process.cwd(), oldImage);
        if (fs.existsSync(oldImagePath)) {
            await fs.promises.unlink(oldImagePath);
        }
    }
};

const removeOmittedGuideImages = async (guideId, imageEntries) => {
    const retainedPositions = imageEntries.map(([position]) => position);
    const [existingImages] = await db.query(
        `
        SELECT position, image
        FROM guide_images
        WHERE guide_id = ?
        `,
        [guideId]
    );
    const omittedImages = existingImages.filter(
        ({ position }) => !retainedPositions.includes(Number(position))
    );

    if (omittedImages.length === 0) {
        return;
    }

    if (retainedPositions.length === 0) {
        await db.query(
            `DELETE FROM guide_images WHERE guide_id = ?`,
            [guideId]
        );
    } else {
        const placeholders = retainedPositions.map(() => "?").join(", ");
        await db.query(
            `
            DELETE FROM guide_images
            WHERE guide_id = ? AND position NOT IN (${placeholders})
            `,
            [guideId, ...retainedPositions]
        );
    }

    for (const { image } of omittedImages) {
        const imagePath = path.join(process.cwd(), image);
        if (fs.existsSync(imagePath)) {
            await fs.promises.unlink(imagePath);
        }
    }
};

export const guideCreate = asyncHandel(async (req, res) => {
    try {

        let {
            title,
            author,
            badge,
            excerpt,
            tag,
            location,
            rating,
            best_time,
            entry,
            sightseeing,
            summary
        } = req.body;


        // =========================
        // VALIDATION
        // =========================

        if (
            !title ||
            !author ||
            !badge ||
            !rating ||
            !location
        ) {
            return res.status(400).json({
                message: "All fields are required!",
                success: false
            });
        }


        // =========================
        // IMAGE MAX 6
        // =========================

        const imageEntries = getGuideImageEntries(req.files);
        if (getGuideImageCount(req.files) > 6) {
            return res.status(400).json({
                success: false,
                message: "Maximum 6 images are allowed!"
            });
        }


        // =========================
        // UPLOAD FOLDER
        // =========================

        const uploadFolder = path.join(
            process.cwd(),
            "images",
            "guide"
        );


        if (!fs.existsSync(uploadFolder)) {
            fs.mkdirSync(uploadFolder, {
                recursive: true
            });
        }


        // =========================
        // CREATE GUIDE
        // =========================

        const [result] = await db.query(
            `
            INSERT INTO guides
            (
                title,
                author,
                badge,
                excerpt,
                tag,
                location,
                rating,
                best_time,
                entry,
                sightseeing,
                summary
            )
            VALUES (?,?,?,?,?,?,?,?,?,?,?)
            `,
            [
                title,
                author,
                badge,
                excerpt,
                tag,
                location,
                rating,
                best_time,
                entry,
                sightseeing,
                summary
            ]
        );


        const guideID = result.insertId;


        // =========================
        // CREATE IMAGES
        // position = 1,2,3,4,5,6
        // =========================

        if (imageEntries.length > 0) {
            for (const [position, file] of imageEntries) {
                const imagePath = await saveGuideImage(file, uploadFolder);
                await db.query(
                    `
                    INSERT INTO guide_images
                    (
                        guide_id,
                        position,
                        image
                    )
                    VALUES (?, ?, ?)
                    `,
                    [
                        guideID,
                        position,
                        imagePath
                    ]
                );
            }
        }


        return res.status(201).json({
            success: true,
            message: "Guide created successfully.",
            data: {
                guideID
            }
        });


    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const guideList = asyncHandel(async (req, res) => {
    try {

        const [data] = await db.query(`
            SELECT
                g.id,
                g.title,
                g.author,
                g.badge,
                g.excerpt,
                g.tag,
                g.location,
                g.rating,
                g.best_time,
                g.entry,
                g.sightseeing,
                g.summary,

                DATE_FORMAT(
                    g.created_at,
                    '%d-%m-%Y'
                ) AS created_at,

                COALESCE(
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', gi.id,
                            'image', gi.image
                        )
                        ORDER BY gi.position ASC
                    ),
                    JSON_ARRAY()
                ) AS images

            FROM guides g

            LEFT JOIN guide_images gi
                ON gi.guide_id = g.id

            GROUP BY
                g.id,
                g.title,
                g.author,
                g.badge,
                g.excerpt,
                g.tag,
                g.location,
                g.rating,
                g.best_time,
                g.entry,
                g.sightseeing,
                g.summary,
                g.created_at

            ORDER BY g.id DESC
        `);

        return res.status(200).json({
            success: true,
            count: data.length,
            message: "Guide Success",
            data
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
});

// export const guideUpdate = asyncHandel(async (req, res) => {
//     try {

//         const { id } = req.params;

//         const [guide] = await db.query(
//             `
//             SELECT *
//             FROM guides
//             WHERE id = ?
//             `,
//             [id]
//         );


//         if (guide.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Guide not found"
//             });
//         }

//         const files = req.files || [];

//         if (files.length > 6) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Maximum 6 images are allowed!"
//             });
//         }

//         const ids = files.map(file => Number(file.fieldname));

//         // Check IDs
//          const hasInvalidId = ids.some(
//             imageId =>
//                 !Number.isInteger(imageId) ||
//                 imageId <= 0
//         );


//         if (hasInvalidId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid image ID. Image ID must be a positive number."
//             });
//         }


//         // Check duplicate IDs
//         const uniqueIds = new Set(ids);

//         if (uniqueIds.size !== ids.length) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Duplicate image IDs are not allowed."
//             });
//         }



//         // Get old images
//         let oldImages = [];

//         if (ids.length > 0) {

//             const [rows] = await db.query(
//                 `
//                 SELECT id, image
//                 FROM guide_images
//                 WHERE guide_id = ?
//                 AND id IN (?)
//                 `,
//                 [id, ids]
//             );

//             oldImages = rows;

//             if (oldImages.length !== ids.length) {
//                 return res.status(404).json({
//                     success: false,
//                     message: "One or more image IDs were not found for this guide."
//                 });
//             }
//         }



//         // Store new images and update DB
//         const oldImagePaths = [];

//         for (const file of files) {

//             const imageId = Number(file.fieldname);

//             const oldImage = oldImages.find(
//                 item => item.id === imageId
//             );


//             if (!oldImage) {
//                 return res.status(404).json({
//                     success: false,
//                     message: `Image ID ${imageId} not found.`
//                 });
//             }

//             const newImage = await storeImageToDynamicFolder(
//                 file,
//                 "guide"
//             );


//             if (!newImage) {
//                 return res.status(400).json({
//                     success: false,
//                     message: `Failed to store image for ID ${imageId}.`
//                 });
//             }

//             await db.query(
//                 `
//                 UPDATE guide_images
//                 SET image = ?
//                 WHERE id = ?
//                 AND guide_id = ?
//                 `,
//                 [
//                     newImage,
//                     imageId,
//                     id
//                 ]
//             );

//             oldImagePaths.push(oldImage.image);
//         }

//         // delete old images from store
//         if (oldImagePaths.length > 0) {
//             await deleteManyStoredImages(
//                 oldImagePaths
//             );
//         }


//         // =========================
//         // GET BODY
//         // =========================

//         let {
//             title,
//             author,
//             badge,
//             excerpt,
//             tag,
//             location,
//             rating,
//             best_time,
//             entry,
//             sightseeing,
//             summary
//         } = req.body;


//         // =========================
//         // KEEP OLD DATA
//         // =========================

//         title = title !== undefined
//             ? title
//             : guide[0].title;

//         author = author !== undefined
//             ? author
//             : guide[0].author;

//         badge = badge !== undefined
//             ? badge
//             : guide[0].badge;

//         excerpt = excerpt !== undefined
//             ? excerpt
//             : guide[0].excerpt;

//         tag = tag !== undefined
//             ? tag
//             : guide[0].tag;

//         location = location !== undefined
//             ? location
//             : guide[0].location;

//         rating = rating !== undefined
//             ? rating
//             : guide[0].rating;

//         best_time = best_time !== undefined
//             ? best_time
//             : guide[0].best_time;

//         entry = entry !== undefined
//             ? entry
//             : guide[0].entry;

//         sightseeing = sightseeing !== undefined
//             ? sightseeing
//             : guide[0].sightseeing;

//         summary = summary !== undefined
//             ? summary
//             : guide[0].summary;


//         // =========================
//         // UPDATE GUIDE
//         // =========================

//         await db.query(
//             `
//             UPDATE guides
//             SET
//                 title = ?,
//                 author = ?,
//                 badge = ?,
//                 excerpt = ?,
//                 tag = ?,
//                 location = ?,
//                 rating = ?,
//                 best_time = ?,
//                 entry = ?,
//                 sightseeing = ?,
//                 summary = ?
//             WHERE id = ?
//             `,
//             [
//                 title,
//                 author,
//                 badge,
//                 excerpt,
//                 tag,
//                 location,
//                 rating,
//                 best_time,
//                 entry,
//                 sightseeing,
//                 summary,
//                 id
//             ]
//         );




//         return res.status(200).json({
//             success: true,
//             message: "Guide updated successfully."
//         });


//     } catch (error) {

//         console.log(error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// });


export const guideUpdate = asyncHandel(async (req, res) => {
    let connection;
    let newImagePaths = [];
    let oldImagePaths = [];
    let transactionStarted = false;
    let committed = false;

    try {
        // 1. Validate guide ID
        const guideId = Number(req.params.id);

        if (!Number.isSafeInteger(guideId) || guideId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid guide ID."
            });
        }

        // 2. Find existing guide
        const [guideRows] = await db.query(
            "SELECT * FROM guides WHERE id = ?",
            [guideId]
        );

        if (guideRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Guide not found."
            });
        }

        const guide = guideRows[0];
        const files = req.files || [];

        // 3. Parse keepImageIds
        // Omitted: do not change existing images.
        // []: explicitly remove all existing images.
        let keepImageIds = null;

        if (req.body.keepImageIds !== undefined) {
            try {
                keepImageIds = Array.isArray(req.body.keepImageIds)
                    ? req.body.keepImageIds
                    : JSON.parse(req.body.keepImageIds);

                if (
                    !Array.isArray(keepImageIds) ||
                    keepImageIds.some((id) => {
                        const validType =
                            typeof id === "number" ||
                            (
                                typeof id === "string" &&
                                /^\d+$/.test(id)
                            );

                        return (
                            !validType ||
                            !Number.isSafeInteger(Number(id)) ||
                            Number(id) <= 0
                        );
                    })
                ) {
                    throw new Error("Invalid image IDs.");
                }

                keepImageIds = keepImageIds.map(Number);

                if (
                    new Set(keepImageIds).size !== keepImageIds.length
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Duplicate IDs in keepImageIds."
                    });
                }
            } catch {
                return res.status(400).json({
                    success: false,
                    message:
                        "keepImageIds must be a valid JSON array of positive image IDs."
                });
            }
        }

        // 4. Validate uploaded file keys.
        // Existing image ID = replace.
        // 0 = add new image.
        const fileIds = files.map((file) => {
            if (!/^(0|[1-9]\d*)$/.test(file.fieldname)) {
                return NaN;
            }

            return Number(file.fieldname);
        });

        if (
            fileIds.some(
                (id) => !Number.isSafeInteger(id) || id < 0
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Image file keys must be 0 or a positive image ID."
            });
        }

        // Multiple files with key 0 are allowed.
        // Existing image IDs must be unique.
        const existingFileIds = fileIds.filter((id) => id !== 0);

        if (
            new Set(existingFileIds).size !== existingFileIds.length
        ) {
            return res.status(400).json({
                success: false,
                message: "Duplicate image IDs are not allowed."
            });
        }

        // If files are uploaded, keepImageIds must be provided.
        if (files.length > 0 && keepImageIds === null) {
            return res.status(400).json({
                success: false,
                message:
                    "Send keepImageIds when adding or replacing images."
            });
        }

        // Omitted keepImageIds + no files = no image changes.
        // An explicitly supplied [] means delete all existing images.
        const isManagingImages = keepImageIds !== null;

        // 5. Get existing images for this guide.
        const [currentImages] = await db.query(
            `
            SELECT id, image
            FROM guide_images
            WHERE guide_id = ?
            `,
            [guideId]
        );

        const currentImageMap = new Map(
            currentImages.map((image) => [
                Number(image.id),
                image
            ])
        );

        // All IDs in keepImageIds must belong to this guide.
        if (
            isManagingImages &&
            keepImageIds.some((id) => !currentImageMap.has(id))
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "One or more keepImageIds do not belong to this guide."
            });
        }

        // 6. Validate replacement image IDs.
        for (const imageId of existingFileIds) {
            if (!currentImageMap.has(imageId)) {
                return res.status(404).json({
                    success: false,
                    message:
                        `Image ID ${imageId} was not found for this guide.`
                });
            }

            if (!keepImageIds.includes(imageId)) {
                return res.status(400).json({
                    success: false,
                    message:
                        `Image ID ${imageId} must be included in keepImageIds.`
                });
            }
        }

        // 7. Enforce maximum 6 total images.
        // Replaced images are already counted in keepImageIds.
        if (isManagingImages) {
            const newImageCount = fileIds.filter(
                (id) => id === 0
            ).length;

            const totalImages =
                keepImageIds.length + newImageCount;

            if (totalImages > 6) {
                return res.status(400).json({
                    success: false,
                    message:
                        "A guide can have a maximum of 6 images.",
                    totalImages,
                    maxImages: 6
                });
            }
        }

        // 8. Save uploaded images before changing DB rows.
        const uploadedFiles = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const imageId = fileIds[i];

            const newPath = await storeImageToDynamicFolder(
                file,
                "guide"
            );

            if (!newPath) {
                throw new Error(
                    `Failed to store image for ID ${imageId}.`
                );
            }

            newImagePaths.push(newPath);

            uploadedFiles.push({
                imageId,
                newPath
            });
        }

        // 9. Prepare old file paths for cleanup after commit.
        if (isManagingImages) {
            const keepSet = new Set(keepImageIds);

            // Images not included in keepImageIds are removed.
            oldImagePaths = currentImages
                .filter(
                    (image) => !keepSet.has(Number(image.id))
                )
                .map((image) => image.image);
        }

        // Replaced images keep their DB IDs, but old files are removed.
        for (const uploaded of uploadedFiles) {
            if (uploaded.imageId !== 0) {
                oldImagePaths.push(
                    currentImageMap.get(uploaded.imageId).image
                );
            }
        }

        // 10. Start DB transaction.
        connection = await db.getConnection();

        await connection.beginTransaction();
        transactionStarted = true;

        // Replace existing images or insert new images.
        for (const uploaded of uploadedFiles) {
            if (uploaded.imageId === 0) {
                await connection.query(
                    `
                    INSERT INTO guide_images (guide_id, image)
                    VALUES (?, ?)
                    `,
                    [guideId, uploaded.newPath]
                );
            } else {
                await connection.query(
                    `
                    UPDATE guide_images
                    SET image = ?
                    WHERE id = ?
                    AND guide_id = ?
                    `,
                    [
                        uploaded.newPath,
                        uploaded.imageId,
                        guideId
                    ]
                );
            }
        }

        // Delete image rows omitted from keepImageIds.
        if (isManagingImages) {
            const idsToDelete = currentImages
                .filter(
                    (image) =>
                        !keepImageIds.includes(Number(image.id))
                )
                .map((image) => Number(image.id));

            if (idsToDelete.length > 0) {
                await connection.query(
                    `
                    DELETE FROM guide_images
                    WHERE guide_id = ?
                    AND id IN (?)
                    `,
                    [guideId, idsToDelete]
                );
            }
        }

        // 11. Update guide fields.
        // Fields not supplied keep their existing values.
        const {
            title,
            author,
            badge,
            excerpt,
            tag,
            location,
            rating,
            best_time,
            entry,
            sightseeing,
            summary
        } = req.body;

        await connection.query(
            `
            UPDATE guides
            SET
                title = ?,
                author = ?,
                badge = ?,
                excerpt = ?,
                tag = ?,
                location = ?,
                rating = ?,
                best_time = ?,
                entry = ?,
                sightseeing = ?,
                summary = ?
            WHERE id = ?
            `,
            [
                title ?? guide.title,
                author ?? guide.author,
                badge ?? guide.badge,
                excerpt ?? guide.excerpt,
                tag ?? guide.tag,
                location ?? guide.location,
                rating ?? guide.rating,
                best_time ?? guide.best_time,
                entry ?? guide.entry,
                sightseeing ?? guide.sightseeing,
                summary ?? guide.summary,
                guideId
            ]
        );

        // Commit all database changes.
        await connection.commit();
        committed = true;

        // 12. Delete old files only after a successful commit.
        let cleanupWarning = false;

        if (oldImagePaths.length > 0) {
            try {
                await deleteManyStoredImages(
                    [...new Set(oldImagePaths)]
                );
            } catch (cleanupError) {
                cleanupWarning = true;

                console.error(
                    "Old image cleanup failed:",
                    cleanupError
                );
            }
        }

        return res.status(200).json({
            success: true,
            message: cleanupWarning
                ? "Guide updated, but some old image files could not be deleted."
                : "Guide updated successfully.",
            ...(cleanupWarning && {
                warning:
                    "Some old image files may remain on the server."
            })
        });

    } catch (error) {
        console.error(error);

        if (connection && transactionStarted && !committed) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error(
                    "Rollback failed:",
                    rollbackError
                );
            }
        }

        // If DB operations failed, remove newly saved image files.
        if (!committed && newImagePaths.length > 0) {
            try {
                await deleteManyStoredImages(
                    [...new Set(newImagePaths)]
                );
            } catch (cleanupError) {
                console.error(
                    "New image cleanup failed:",
                    cleanupError
                );
            }
        }

        return res.status(500).json({
            success: false,
            message:
                error.message || "Failed to update guide."
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }
});

export const guideDelete = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;
        const [guide] = await db.query(
            `
            SELECT *
            FROM guides
            WHERE id = ?
            `,
            [id]
        );

        if (guide.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Guide not found"
            });
        }

        const [images] = await db.query(
            `
            SELECT image
            FROM guide_images
            WHERE guide_id = ?
            `,
            [id]
        );

        for (const img of images) {

            const imagePath = path.join(
                process.cwd(),
                img.image
            );

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        await db.query(
            `
            DELETE FROM guides
            WHERE id = ?
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Guide deleted successfully."
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


export const guideDetails = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Guide id is required"
            });
        }

        const [data] = await db.query(
            `
            SELECT
                g.id,
                g.title,
                g.author,
                g.badge,
                g.excerpt,
                g.tag,
                g.location,
                g.rating,
                g.best_time,
                g.entry,
                g.sightseeing,
                g.summary,

                DATE_FORMAT(
                    g.created_at,
                    '%d-%m-%Y'
                ) AS created_at,

                COALESCE(
                    (
                        SELECT JSON_ARRAYAGG(
                            gi.image
                        )
                        FROM guide_images gi
                        WHERE gi.guide_id = g.id
                    ),
                    JSON_ARRAY()
                ) AS images,

                (
                    SELECT COUNT(*)
                    FROM review r
                    WHERE r.guide_id = g.id
                ) AS review_count,

                COALESCE(
                    (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', r.id,
                                'user_id', r.user_id,
                                'user_name', u.username,
                                'review_title', r.review_title,
                                'description', r.description,
                                'star_rating', r.star_rating,
                                'image', r.image,
                                'created_at',
                                    DATE_FORMAT(
                                        r.created_at,
                                        '%d-%m-%Y'
                                    )
                            )
                        )
                        FROM review r
                        INNER JOIN users u
                            ON r.user_id = u.id
                        WHERE r.guide_id = g.id
                    ),
                    JSON_ARRAY()
                ) AS reviews

            FROM guides g

            WHERE g.id = ?
            `,
            [id]
        );

        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Guide not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: data[0]
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});



export const guideMobileList = asyncHandel(async (req, res) => {
    try {

        const [data] = await db.query(`
            SELECT
                g.id,
                g.title,
                g.author,
                g.badge,
                g.excerpt,
                g.tag,
                g.location,
                g.rating,
                g.best_time,
                g.entry,
                g.sightseeing,
                g.summary,

                DATE_FORMAT(
                    g.created_at,
                    '%d-%m-%Y'
                ) AS created_at,

                COALESCE(
                    (
                        SELECT JSON_ARRAYAGG(
                            gi.image
                        )
                        FROM guide_images gi
                        WHERE gi.guide_id = g.id
                    ),
                    JSON_ARRAY()
                ) AS images,

                COALESCE(
                    (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', r.id,
                                'user_id', r.user_id,
                                'user_name', u.username,
                                'review_title', r.review_title,
                                'description', r.description,
                                'star_rating', r.star_rating,
                                'image', r.image,
                                'created_at',
                                    DATE_FORMAT(
                                        r.created_at,
                                        '%d-%m-%Y'
                                    )
                            )
                        )
                        FROM review r

                        INNER JOIN users u
                            ON r.user_id = u.id

                        WHERE r.guide_id = g.id
                    ),
                    JSON_ARRAY()
                ) AS reviews

            FROM guides g

            ORDER BY g.id DESC
        `);

        return res.status(200).json({
            success: true,
            count: data.length,
            message: "Guide Success",
            data
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
});

