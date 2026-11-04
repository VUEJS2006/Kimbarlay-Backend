
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid"
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";


export const daydestinationCreate = asyncHandel(async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name is required!"
            });
        }

        const uploadFolder = path.join(process.cwd(), "images", "dayTripDestination");

        if (!fs.existsSync(uploadFolder)) {
            fs.mkdirSync(uploadFolder, { recursive: true });
        }

        let imagePath = null;

        if (req.file) {
            const fileName = `${uuid()}.webp`;
            const savePath = path.join(uploadFolder, fileName);

            await sharp(req.file.buffer)
                .resize({
                    width: 1920,
                    withoutEnlargement: true
                })
                .webp({
                    quality: 95
                })
                .toFile(savePath);

            imagePath = `images/dayTripDestination/${fileName}`;
        }

        const [data] = await db.query(
            `
            INSERT INTO daytripdestinations (name, image)
            VALUES (?, ?)
            `,
            [name, imagePath]
        );

        return res.status(201).json({
            message: "Day Trip Destination Create Success",
            success: true,
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


export const daydestinationList = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(
            `
            SELECT
                id,
                name,
                image,
                DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
            FROM daytripdestinations
            ORDER BY id DESC
            `
        );

        return res.status(200).json({
            message: "Day Trip Destination List Success",
            success: true,
            count: data.length,
            data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


export const daydestinationUpdate = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;

        const [destinations] = await db.query(
            "SELECT * FROM daytripdestinations WHERE id = ?",
            [id]
        );

        if (destinations.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Day Trip Destination not found!"
            });
        }

        const name = req.body.name ?? destinations[0].name;

        let updateImage = destinations[0].image;

        if (req.file) {
            const uploadFolder = path.join(
                process.cwd(),
                "images",
                "dayTripDestination"
            );

            if (!fs.existsSync(uploadFolder)) {
                fs.mkdirSync(uploadFolder, { recursive: true });
            }

            const fileName = `${uuid()}.webp`;
            const savePath = path.join(uploadFolder, fileName);

            await sharp(req.file.buffer)
                .resize({
                    width: 1920,
                    withoutEnlargement: true
                })
                .webp({
                    quality: 95
                })
                .toFile(savePath);

            updateImage = `images/dayTripDestination/${fileName}`;
        }

        await db.query(
            `
            UPDATE daytripdestinations
            SET name = ?, image = ?
            WHERE id = ?
            `,
            [name, updateImage, id]
        );

        if (req.file && destinations[0].image) {
            const oldPath = path.join(
                process.cwd(),
                destinations[0].image
            );

            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        return res.status(200).json({
            success: true,
            message: "Day Trip Destination Update Successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


export const daydestinationDelete = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;

        const [destinations] = await db.query(
            `
            SELECT *
            FROM daytripdestinations
            WHERE id = ?
            `,
            [id]
        );

        if (destinations.length === 0) {
            return res.status(404).json({
                message: "Day Trip Destination not found!",
                success: false
            });
        }

        await db.query(
            `
            DELETE FROM daytripdestinations
            WHERE id = ?
            `,
            [id]
        );

        if (destinations[0].image) {
            const oldPath = path.join(
                process.cwd(),
                destinations[0].image
            );

            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        return res.status(200).json({
            success: true,
            message: "Day Trip Destination Delete Successfully"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


export const daydestinationMobileList = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(
            `
            SELECT
                id,
                name,
                image,
                DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
            FROM daytripdestinations
            ORDER BY id DESC
            `
        );

        return res.status(200).json({
            message: "Day Trip Destinations List Success",
            success: true,
            count: data.length,
            data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});