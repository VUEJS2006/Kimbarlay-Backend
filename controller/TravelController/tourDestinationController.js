
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid"
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";


export const destinationCreate = asyncHandel(async (req, res) => {
    try {

        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const uploadFolder = path.join(process.cwd(), "images", "tourDestination")
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


            imagePath = `images/tourDestination/${fileName}`;
        }

        const [data] = await db.query(
            `
            INSERT INTO tourdestinations (name,image) VALUES (?,?)
            `,
            [
                name, imagePath
            ]
        )
        return res.status(201).json({
            message: "Tour Destination Create Success",
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

export const destinationList = asyncHandel(async (req, res) => {
    try {

        const [data] = await db.query(
            `
            SELECT 
            id,
            name,
            image,
            DATE_FORMAT(
            created_at,
            '%d-%m-%Y'
            ) AS created_at

            FROM 
            tourdestinations
            ORDER BY id DESC 
            `
        )
        return res.status(200).json({
            message: "Tour Destination List Success",
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

export const destinationUpdate = asyncHandel(async (req, res) => {
    try {

        const { id } = req.body;
        const { name } = req.body;

        const [destinations] = await db.query("SELECT * FROM tourdestinations WHERE id = ?", [id]);

        if (destinations.length === 0) {
            return res.status(404).json({
                message: "Tour Destination not found!",
                success: false
            });
        }

        let updateImage = [destinations[0].image];
        if (req.file) {
            if (destinations[0].image) {
                const oldPath = path.join(process.cwd(), destinations[0].image);

                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath)
                }
            }

            const uploadFolder = path.join(process.cwd(), "images", "tourDestination");

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

            updateImage = `images/tourDestination/${fileName}`;
        }

        const [data] = await db.query(
            `
            UPDATE tourdestinations SET 
            name = ?,
            image = ?

            WHERE id = ?
            `,
            [
                name,
                updateImage,
                id
            ]
        );
        return res.status(200).json({
            success: true,
            message: "Touer Destination  Update Successfully",
            data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const destinationDelete = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;
        const [destinations] = await db.query(
            `
            SELECT *
            FROM tourdestinations
            WHERE id = ?
            `,
            [id]
        );

        if (destinations.length === 0) {
            return res.status(404).json({
                message: "Tour Destination not found!",
                success: false
            });
        }
        if (destinations[0].image) {

            const oldPath = path.join(
                process.cwd(),
                destinations[0].image
            );

            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        await db.query(
            `
            DELETE FROM tourdestinations
            WHERE id = ?
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Tour Destination Delete"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const destinationMobileList = asyncHandel(async (req, res) => {
    try {

        const [data] = await db.query(
            `
            SELECT 
            id,
            name,
            image,
            DATE_FORMAT(
            created_at,
            '%d-%m-%Y'
            ) AS created_at

            FROM 
            tourdestinations
            ORDER BY id DESC 
            `
        )
        return res.status(200).json({
            message: "Tour Destinations List Success",
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