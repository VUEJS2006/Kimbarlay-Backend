import db from "../config/db.js"
import { asyncHandel } from "../middleware/asyncMiddleware.js"
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid"

export const allReviewCreate = asyncHandel(async (req, res) => {
    try {

        let {
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
            "all_review"
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

            imagePath = `images/all_review/${fileName}`;
        }

        const [data] = await db.query(
            `
            INSERT INTO all_reviews
            (
                user_id,
                review_title,
                description,
                star_rating,
                image
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                userID,
                review_title,
                description,
                rating,
                imagePath
            ]
        );


        return res.status(201).json({
            success: true,
            message: "All Review Write Success",
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

export const allReviewList = asyncHandel(async (req, res) => {
    try {

        const [data] = await db.query(`
            SELECT
                r.id,
                r.user_id,
                u.username AS user_name,

                r.review_title,
                r.description,
                r.star_rating,
                r.image,

                DATE_FORMAT(
                    r.created_at,
                    '%d-%m-%Y'
                ) AS created_at

            FROM all_reviews r

            INNER JOIN users u
                ON r.user_id = u.id

            ORDER BY r.id DESC
        `);

        return res.status(200).json({
            success: true,
            count: data.length,
            message: "All Review List Success",
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

b