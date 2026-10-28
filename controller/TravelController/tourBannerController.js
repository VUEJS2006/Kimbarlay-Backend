
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid"
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";


export const bannerCreate = asyncHandel(async (req, res) => {
    try {

        const { title, hightlight, subtitle } = req.body;

        if (!title || !hightlight || !subtitle) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const uploadFolder = path.join(process.cwd(), "images", "tourBanner")
        if (!fs.existsSync(uploadFolder)) {
            fs.mkdirSync(uploadFolder, { recursive: true })
        }

        let imagePath = null
        if (req.file) {
            const fileName = `${uuid()}.webp`;
            const savePath = path.join(uploadFolder, fileName)

            await sharp(req.file.buffer)
                .resize({
                    width: 1920,
                    withoutEnlargement: true
                })
                .webp({
                    quality: 95
                })
                .toFile(savePath)


            imagePath = `images/tourBanner/${fileName}`;
        }

        const [data] = await db.query(
            `
            INSERT INTO tourbanners (title,hightlight,subtitle,image) VALUES (?,?,?,?)
            `,
            [
                title, hightlight, subtitle, imagePath
            ]
        )
        return res.status(201).json({
            message: "Tour Banner Create Success",
            success: true,
            data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const bannerList = asyncHandel(async (req, res) => {
    try {

        const [data] = await db.query(
            `
            SELECT 
            id,
            title,
            hightlight,
            subtitle,
            image,
            DATE_FORMAT(
            created_at,
            '%d-%m-%Y'
            ) AS created_at

            FROM 
            tourbanners
            ORDER BY id DESC 
            `
        )
        return res.status(200).json({
            message: "Tour Banner List Success",
            success: true,
            count: data.length,
            data: data
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const bannerUpdate = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;

        const [banners] = await db.query("SELECT * FROM tourbanners WHERE id = ?", [id]);

        if (banners.length === 0) {
            return res.status(404).json({
                message: "Tour Banner not found!",
                success: false
            });
        }

        const title = req.body.title ?? banners[0].title;
        const subtitle = req.body.subtitle ?? banners[0].subtitle;
        const hightlight = req.body.hightlight ?? banners[0].hightlight;

        let updateImage = banners[0].image;
        if (req.file) {
            const uploadFolder = path.join(process.cwd(), "images", "tourBanner");

            if (!fs.existsSync(uploadFolder)) {
                fs.mkdirSync(uploadFolder, { recursive: true })
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

            updateImage = `images/tourBanner/${fileName}`;
        }

        const [data] = await db.query(
            `
            UPDATE tourbanners SET 
            title = ?,
            subtitle = ?,
            hightlight = ?,
            image = ?

            WHERE id = ?
            `,
            [
                title,
                subtitle,
                hightlight,
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
            message: "Touer Banner  Update Successfully",
            data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const bannerDelete = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;
        const [banners] = await db.query(
            `
            SELECT *
            FROM tourbanners
            WHERE id = ?
            `,
            [id]
        );

        if (banners.length === 0) {
            return res.status(404).json({
                message: "Tour Banner not found!",
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
            DELETE FROM tourbanners
            WHERE id = ?
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Tour Banner Delete"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const bannerMobileList = asyncHandel(async (req, res) => {
    try {

        const [data] = await db.query(
            `
            SELECT 
            id,
            title,
            hightlight,
            subtitle,
            image,
            DATE_FORMAT(
            created_at,
            '%d-%m-%Y'
            ) AS created_at

            FROM 
            tourbanners
            ORDER BY id DESC 
            `
        )
        return res.status(200).json({
            message: "Tour Banner List Success",
            success: true,
            count: data.length,
            data: data
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})