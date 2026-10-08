import db from "../config/db.js"
import { asyncHandel } from "../middleware/asyncMiddleware.js"
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid"

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

        if (req.files && req.files.length > 6) {
            return res.status(400).json({
                success: false,
                message: "Maximum 6 images are allowed!"
            });
        }

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

        if (req.files && req.files.length > 0) {

            let position = 1;


            for (const file of req.files) {

                const fileName = `${uuid()}.webp`;

                const savePath = path.join(
                    uploadFolder,
                    fileName
                );


                await sharp(file.buffer)
                    .resize({
                        width: 1920,
                        withoutEnlargement: true
                    })
                    .webp({
                        quality: 90
                    })
                    .toFile(savePath);


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
                        `images/guide/${fileName}`
                    ]
                );


                position++;
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
                        CASE
                            WHEN gi.id IS NOT NULL
                            THEN gi.image
                        END
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


        if (req.files?.image1) {

            await updateGuideImage(
                id,
                1,
                req.files.image1[0],
                uploadFolder
            );
        }


        if (req.files?.image2) {

            await updateGuideImage(
                id,
                2,
                req.files.image2[0],
                uploadFolder
            );
        }

        if (req.files?.image3) {

            await updateGuideImage(
                id,
                3,
                req.files.image3[0],
                uploadFolder
            );
        }

        if (req.files?.image4) {

            await updateGuideImage(
                id,
                4,
                req.files.image4[0],
                uploadFolder
            );
        }

        if (req.files?.image5) {

            await updateGuideImage(
                id,
                5,
                req.files.image5[0],
                uploadFolder
            );
        }


        if (req.files?.image6) {

            await updateGuideImage(
                id,
                6,
                req.files.image6[0],
                uploadFolder
            );
        }


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
