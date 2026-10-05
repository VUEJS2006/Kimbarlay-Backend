import db from "../config/db.js"
import { asyncHandel } from "../middleware/asyncMiddleware.js"
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid"

export const reviewCreate = asyncHandel(async (req, res) => {
    try {

        let {
            guide_id,
            review_title,
            description,
            star_rating
        } = req.body;

        if (req.user.role !== "user") {
            return res.status(403).json({
                success: false,
                message: "Only user can write review!"
            });
        }

        if (
            !guide_id ||
            !review_title ||
            !description ||
            !star_rating
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const [user] = await db.query(
            `
            SELECT id
            FROM users
            WHERE id = ?
            `,
            [req.user.id]
        );

        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        const userID = user[0].id;

        const [guide] = await db.query(
            `
            SELECT id
            FROM guides
            WHERE id = ?
            `,
            [guide_id]
        );

        if (guide.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Guide not found!"
            });
        }

        const rating = Number(star_rating);

        if (
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5
        ) {
            return res.status(400).json({
                success: false,
                message: "Star rating must be between 1 and 5!"
            });
        }


        const uploadFolder = path.join(
            process.cwd(),
            "images",
            "review"
        );

        if (!fs.existsSync(uploadFolder)) {
            fs.mkdirSync(uploadFolder, {
                recursive: true
            });
        }

        let imagePath = null;

        if (req.file) {

            const fileName = `${uuid()}.webp`;

            const savePath = path.join(
                uploadFolder,
                fileName
            );

            await sharp(req.file.buffer)
                .resize({
                    width: 1920,
                    withoutEnlargement: true
                })
                .webp({
                    quality: 95
                })
                .toFile(savePath);

            imagePath = `images/review/${fileName}`;
        }

        const [data] = await db.query(
            `
            INSERT INTO review
            (
                user_id,
                guide_id,
                review_title,
                description,
                star_rating,
                image
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                userID,
                guide_id,
                review_title,
                description,
                rating,
                imagePath
            ]
        );


        return res.status(201).json({
            success: true,
            message: "Review Write Success",
            data
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const reviewList = asyncHandel(async (req, res) => {
    try {

        const [data] = await db.query(`
            SELECT
                r.id,
                r.user_id,
                r.guide_id,

                g.title AS guide_title,

                u.name AS user_name,
                u.image AS user_image,

                r.review_title,
                r.description,
                r.star_rating,
                r.image,

                DATE_FORMAT(
                    r.created_at,
                    '%d-%m-%Y'
                ) AS created_at

            FROM review r

            INNER JOIN users u
                ON r.user_id = u.id

            INNER JOIN guides g
                ON r.guide_id = g.id

            ORDER BY r.id DESC
        `);

        return res.status(200).json({
            success: true,
            count: data.length,
            message: "Review List Success",
            data
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const reviewDelete = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;
        const [review] = await db.query(
            `
            SELECT
                id,
                user_id,
                image
            FROM review
            WHERE id = ?
            `,
            [id]
        );

        if (review.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Review not found!"
            });
        }

        if (review[0].image) {

            const imagePath = path.join(
                process.cwd(),
                review[0].image
            );

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        await db.query(
            `
            DELETE FROM review
            WHERE id = ?
            `,
            [id]
        );


        return res.status(200).json({
            success: true,
            message: "Review deleted successfully."
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});