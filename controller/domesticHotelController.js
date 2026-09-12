import db from "../config/db.js"
import { asyncHandel } from "../middleware/asyncMiddleware.js"
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid"

export const domesticHotelCreate = asyncHandel(async (req, res) => {
    try {

        let {
            township_id,
            title,
            price,
            rating,
            color,
            tags,
            description
        } = req.body;

        if (!township_id || !title || !price) {
            return res.status(400).json({
                message: "All fields are required!",
                success: false
            });
        }

        if (!tags) {
            tags = [];
        }

        if (typeof tags === "string") {
            try {
                tags = JSON.parse(tags);
            } catch (error) {
                tags = tags
                    .split(",")
                    .map(item => item.trim())
                    .filter(Boolean);
            }
        }

        const uploadFolder = path.join(
            process.cwd(),
            "images",
            "domestic"
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

            imagePath = `images/domestic/${fileName}`;
        }

        const [data] = await db.query(
            `
            INSERT INTO domestic_hotels
            (
                township_id,
                title,
                price,
                rating,
                color,
                tags,
                description,
                image
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                township_id,
                title,
                price,
                rating,
                color,
                JSON.stringify(tags),
                description,
                imagePath
            ]
        );

        return res.status(201).json({
            message: "Hotel Create Success",
            success: true,
            hotel_id: data.insertId
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


export const domesticHotelList = asyncHandel(async (req, res) => {
    try {

        const [data] = await db.query(
            `
            SELECT
                h.id,
                h.township_id,
                t.name AS township_name,
                h.title,
                h.price,
                h.rating,
                h.color,
                h.tags,
                h.description,
                h.image,
                DATE_FORMAT(
                    h.created_at,
                    '%d-%m-%Y'
                ) AS created_at
            FROM domestic_hotels h
            LEFT JOIN townships t
                ON h.township_id = t.id
            ORDER BY h.id DESC
            `
        );

        return res.status(200).json({
            message: "Hotel List Success",
            success: true,
            data,
            count: data.length
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


export const domesticHotelUpdate = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;

        let {
            township_id,
            title,
            price,
            rating,
            color,
            tags,
            description
        } = req.body;

        const [hotel] = await db.query(
            `
            SELECT *
            FROM domestic_hotels
            WHERE id = ?
            `,
            [id]
        );

        if (hotel.length === 0) {
            return res.status(404).json({
                message: "Hotel not found!",
                success: false
            });
        }

        if (!tags) {
            tags = [];
        }

        if (typeof tags === "string") {
            try {
                tags = JSON.parse(tags);
            } catch (error) {
                tags = tags
                    .split(",")
                    .map(item => item.trim())
                    .filter(Boolean);
            }
        }

        let updateImage = hotel[0].image;

        if (req.file) {

            // Delete old image
            if (hotel[0].image) {

                const oldPath = path.join(
                    process.cwd(),
                    hotel[0].image
                );

                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }

            const uploadFolder = path.join(
                process.cwd(),
                "images",
                "domestic"
            );

            if (!fs.existsSync(uploadFolder)) {
                fs.mkdirSync(uploadFolder, {
                    recursive: true
                });
            }

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

            updateImage = `images/domestic/${fileName}`;
        }

        const [data] = await db.query(
            `
            UPDATE domestic_hotels
            SET
                township_id = ?,
                title = ?,
                price = ?,
                rating = ?,
                color = ?,
                tags = ?,
                description = ?,
                image = ?
            WHERE id = ?
            `,
            [
                township_id,
                title,
                price,
                rating,
                color,
                JSON.stringify(tags),
                description,
                updateImage,
                id
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Hotel Update Successfully",
            hotel_id: id
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


export const domesticHotelDelete = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;

        const [hotel] = await db.query(
            `
            SELECT *
            FROM domestic_hotels
            WHERE id = ?
            `,
            [id]
        );

        if (hotel.length === 0) {
            return res.status(404).json({
                message: "Hotel not found!",
                success: false
            });
        }

        // Delete image
        if (hotel[0].image) {

            const oldPath = path.join(
                process.cwd(),
                hotel[0].image
            );

            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        await db.query(
            `
            DELETE FROM domestic_hotels
            WHERE id = ?
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Hotel Delete Success"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});