
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid"
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";

export const interbannerCreate = asyncHandel(async (req, res) => {
    try {
        const { title, description, button } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const uploadFolder = path.join(process.cwd(), "images", "interBanner");

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

            imagePath = `images/interBanner/${fileName}`;
        }

        const [data] = await db.query(
            `
            INSERT INTO interbanners
            (title, description, button, image)
            VALUES (?, ?, ?, ?)
            `,
            [title, description, button || null, imagePath]
        );

        return res.status(201).json({
            message: "Inter Banner Create Success",
            success: true,
            data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


export const interBannerList = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(
            `
            SELECT
                id,
                title,
                description,
                button,
                image,
                DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
            FROM interbanners
            ORDER BY id DESC
            `
        );

        return res.status(200).json({
            message: "Inter Banner List Success",
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


export const interbannerUpdate = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;

        const [banners] = await db.query(
            "SELECT * FROM interbanners WHERE id = ?",
            [id]
        );

        if (banners.length === 0) {
            return res.status(404).json({
                message: "Inter Banner not found!",
                success: false
            });
        }

        const title = req.body.title ?? banners[0].title;
        const description = req.body.description ?? banners[0].description;
        const button = req.body.button ?? banners[0].button;

        let updateImage = banners[0].image;

        if (req.file) {
            const uploadFolder = path.join(process.cwd(), "images", "interBanner");

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

            updateImage = `images/interBanner/${fileName}`;
        }

        const [data] = await db.query(
            `
            UPDATE interbanners SET
                title = ?,
                description = ?,
                button = ?,
                image = ?
            WHERE id = ?
            `,
            [
                title,
                description,
                button,
                updateImage,
                id
            ]
        );

        if (req.file && banners[0].image) {
            const oldPath = path.join(process.cwd(), banners[0].image);

            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        return res.status(200).json({
            success: true,
            message: "Inter Banner Update Successfully",
            data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


export const interbannerDelete = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;

        const [banners] = await db.query(
            `
            SELECT *
            FROM interbanners
            WHERE id = ?
            `,
            [id]
        );

        if (banners.length === 0) {
            return res.status(404).json({
                message: "Inter Banner not found!",
                success: false
            });
        }

        if (banners[0].image) {
            const oldPath = path.join(
                process.cwd(),
                banners[0].image
            );

            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        await db.query(
            `
            DELETE FROM interbanners
            WHERE id = ?
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Inter Banner Delete Successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


export const interbannerMobileList = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(
            `
            SELECT
                id,
                title,
                description,
                button,
                image,
                DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
            FROM interbanners
            ORDER BY id DESC
            `
        );

        return res.status(200).json({
            message: "Inter Banner Mobile List Success",
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