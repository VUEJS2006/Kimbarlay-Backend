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
                        gi.image
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


//         // =========================
//         // CHECK GUIDE
//         // =========================

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

//         const imageEntries = getGuideImageEntries(req.files);
//         if (getGuideImageCount(req.files) > 6) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Maximum 6 images are allowed!"
//             });
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


//         // =========================
//         // UPLOAD FOLDER
//         // =========================

//         const uploadFolder = path.join(
//             process.cwd(),
//             "images",
//             "guide"
//         );


//         if (!fs.existsSync(uploadFolder)) {
//             fs.mkdirSync(uploadFolder, {
//                 recursive: true
//             });
//         }


//         for (const [position, file] of imageEntries) {
//             await updateGuideImage(
//                 id,
//                 position,
//                 file,
//                 uploadFolder
//             );
//         }

//         await removeOmittedGuideImages(id, imageEntries);


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

        const files = req.files || [];

        if (files.length > 6) {
            return res.status(400).json({
                success: false,
                message: "Maximum 6 images are allowed!"
            });
        }

        const ids = files.map(file => Number(file.fieldname));

        // Check IDs
         const hasInvalidId = ids.some(
            imageId =>
                !Number.isInteger(imageId) ||
                imageId <= 0
        );


        if (hasInvalidId) {
            return res.status(400).json({
                success: false,
                message: "Invalid image ID. Image ID must be a positive number."
            });
        }


        // Check duplicate IDs
        const uniqueIds = new Set(ids);

        if (uniqueIds.size !== ids.length) {
            return res.status(400).json({
                success: false,
                message: "Duplicate image IDs are not allowed."
            });
        }



        // Get old images
        let oldImages = [];

        if (ids.length > 0) {

            const [rows] = await db.query(
                `
                SELECT id, image
                FROM guide_images
                WHERE guide_id = ?
                AND id IN (?)
                `,
                [id, ids]
            );

            oldImages = rows;

            if (oldImages.length !== ids.length) {
                return res.status(404).json({
                    success: false,
                    message: "One or more image IDs were not found for this guide."
                });
            }
        }



        // Store new images and update DB
        const oldImagePaths = [];

        for (const file of files) {

            const imageId = Number(file.fieldname);

            const oldImage = oldImages.find(
                item => item.id === imageId
            );


            if (!oldImage) {
                return res.status(404).json({
                    success: false,
                    message: `Image ID ${imageId} not found.`
                });
            }

            const newImage = await storeImageToDynamicFolder(
                file,
                "guide"
            );


            if (!newImage) {
                return res.status(400).json({
                    success: false,
                    message: `Failed to store image for ID ${imageId}.`
                });
            }

            await db.query(
                `
                UPDATE guide_images
                SET image = ?
                WHERE id = ?
                AND guide_id = ?
                `,
                [
                    newImage,
                    imageId,
                    id
                ]
            );

            oldImagePaths.push(oldImage.image);
        }

        // delete old images from store
        if (oldImagePaths.length > 0) {
            await deleteManyStoredImages(
                oldImagePaths
            );
        }


        // =========================
        // GET BODY
        // =========================

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
        // KEEP OLD DATA
        // =========================

        title = title !== undefined
            ? title
            : guide[0].title;

        author = author !== undefined
            ? author
            : guide[0].author;

        badge = badge !== undefined
            ? badge
            : guide[0].badge;

        excerpt = excerpt !== undefined
            ? excerpt
            : guide[0].excerpt;

        tag = tag !== undefined
            ? tag
            : guide[0].tag;

        location = location !== undefined
            ? location
            : guide[0].location;

        rating = rating !== undefined
            ? rating
            : guide[0].rating;

        best_time = best_time !== undefined
            ? best_time
            : guide[0].best_time;

        entry = entry !== undefined
            ? entry
            : guide[0].entry;

        sightseeing = sightseeing !== undefined
            ? sightseeing
            : guide[0].sightseeing;

        summary = summary !== undefined
            ? summary
            : guide[0].summary;


        // =========================
        // UPDATE GUIDE
        // =========================

        await db.query(
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
                summary,
                id
            ]
        );




        return res.status(200).json({
            success: true,
            message: "Guide updated successfully."
        });


    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
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
                        FROM (
                            SELECT
                                image
                            FROM guide_images
                            WHERE guide_id = g.id
                            ORDER BY position ASC
                        ) gi
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
                        FROM (
                            SELECT
                                image
                            FROM guide_images
                            WHERE guide_id = g.id
                            ORDER BY position ASC
                        ) gi
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