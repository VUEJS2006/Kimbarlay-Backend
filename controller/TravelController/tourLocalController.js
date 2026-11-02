
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid"
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";


export const tourLocalCreate = asyncHandel(async (req, res) => {
    try {

        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const uploadFolder = path.join(process.cwd(), "images", "tourLocal")
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


            imagePath = `images/tourLocal/${fileName}`;
        }

        const [data] = await db.query(
            `
            INSERT INTO tourlocals (name,image) VALUES (?,?)
            `,
            [
                name, imagePath
            ]
        )
        return res.status(201).json({
            message: "Tour Local Create Success",
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

export const tourLocalList = asyncHandel(async (req, res) => {
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
            tourlocals
            ORDER BY id DESC 
            `
        )
        return res.status(200).json({
            message: "Tour Local List Success",
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


export const tourLocalUpdate = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        console.log("ID:", id);
        console.log("BODY:", req.body);



        const [Locals] = await db.query(
            "SELECT * FROM tourlocals WHERE id = ?",
            [id]
        );

        if (Locals.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tour Local not found!"
            });
        }


        let updateImage = Locals[0].image;

        if (req.file) {
            const uploadFolder = path.join(
                process.cwd(),
                "images",
                "tourLocal"
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
                .webp({ quality: 95 })
                .toFile(savePath);

            updateImage = `images/tourLocal/${fileName}`;


            if (Locals[0].image) {
                const oldPath = path.join(
                    process.cwd(),
                    Locals[0].image
                );

                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
        }

        const [data] = await db.query(
            `
            UPDATE tourlocals
            SET name = ?, image = ?
            WHERE id = ?
            `,
            [name, updateImage, id]
        );

        return res.status(200).json({
            success: true,
            message: "Tour Local Update Successfully",
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


export const tourLocalDelete = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;
        const [Locals] = await db.query(
            `
            SELECT *
            FROM tourlocals
            WHERE id = ?
            `,
            [id]
        );

        if (Locals.length === 0) {
            return res.status(404).json({
                message: "Tour Local not found!",
                success: false
            });
        }
        if (Locals[0].image) {

            const oldPath = path.join(
                process.cwd(),
                Locals[0].image
            );

            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        await db.query(
            `
            DELETE FROM tourlocals
            WHERE id = ?
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Tour Local Delete"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const tourLocalMobileList = asyncHandel(async (req, res) => {
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
            tourlocals
            ORDER BY id DESC 
            `
        )
        return res.status(200).json({
            message: "Tour Locals List Success",
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