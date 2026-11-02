
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid"
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";


export const tourDomesticCreate = asyncHandel(async (req, res) => {
    try {

        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const uploadFolder = path.join(process.cwd(), "images", "tourDomestic")
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


            imagePath = `images/tourDomestic/${fileName}`;
        }

        const [data] = await db.query(
            `
            INSERT INTO tourdomestics (name,image) VALUES (?,?)
            `,
            [
                name, imagePath
            ]
        )
        return res.status(201).json({
            message: "Tour Domestic Create Success",
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

export const tourDomesticList = asyncHandel(async (req, res) => {
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
            tourdomestics
            ORDER BY id DESC 
            `
        )
        return res.status(200).json({
            message: "Tour Domestic List Success",
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


export const tourDomesticUpdate = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        console.log("ID:", id);
        console.log("BODY:", req.body);

      

        const [Domestics] = await db.query(
            "SELECT * FROM tourdomestics WHERE id = ?",
            [id]
        );

        if (Domestics.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tour Domestic not found!"
            });
        }

       
        let updateImage = Domestics[0].image;

        if (req.file) {
            const uploadFolder = path.join(
                process.cwd(),
                "images",
                "tourDomestic"
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

            updateImage = `images/tourDomestic/${fileName}`;

          
            if (Domestics[0].image) {
                const oldPath = path.join(
                    process.cwd(),
                    Domestics[0].image
                );

                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
        }

        const [data] = await db.query(
            `
            UPDATE tourdomestics
            SET name = ?, image = ?
            WHERE id = ?
            `,
            [name, updateImage, id]
        );

        return res.status(200).json({
            success: true,
            message: "Tour Domestic Update Successfully",
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


export const tourDomesticDelete = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;
        const [Domestics] = await db.query(
            `
            SELECT *
            FROM tourdomestics
            WHERE id = ?
            `,
            [id]
        );

        if (Domestics.length === 0) {
            return res.status(404).json({
                message: "Tour Domestic not found!",
                success: false
            });
        }
        if (Domestics[0].image) {

            const oldPath = path.join(
                process.cwd(),
                Domestics[0].image
            );

            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        await db.query(
            `
            DELETE FROM tourdomestics
            WHERE id = ?
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Tour Domestic Delete"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const tourDomesticMobileList = asyncHandel(async (req, res) => {
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
            tourdomestics
            ORDER BY id DESC 
            `
        )
        return res.status(200).json({
            message: "Tour Domestics List Success",
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