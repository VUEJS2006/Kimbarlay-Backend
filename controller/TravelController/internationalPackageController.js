import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid"
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";


export const interPackageCreate = asyncHandel(async (req, res) => {
    try {

        const { title, description, price, badge, international_id } = req.body;

        if (!title || price === undefined || price === null || price === "" || badge === undefined || badge === null || badge === "" || !international_id) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const [internationals] = await db.query(
            "SELECT id FROM internationals WHERE id = ?",
            [international_id]
        );

        if (internationals.length === 0) {
            return res.status(404).json({
                success: false,
                message: "International not found!"
            });
        }

        const uploadFolder = path.join(process.cwd(), "images", "internationPackage")
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


            imagePath = `images/internationPackage/${fileName}`;
        }

        const [data] = await db.query(
            `
            INSERT INTO international_packages (title,image,price,description,international_id,badge) VALUES (?,?,?,?,?,?)
            `,
            [
                title, imagePath, price, description, international_id, badge
            ]
        )
        return res.status(201).json({
            message: "Internation Package Create Success",
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

export const interPackageList = asyncHandel(async (req, res) => {
    try {

        const [data] = await db.query(
            `
            SELECT 
            id,
            title,
            image,
            price,
            description,
            international_id,
            badge,
            DATE_FORMAT(
            created_at,
            '%d-%m-%Y'
            ) AS created_at

            FROM 
            international_packages
            ORDER BY id DESC 
            `
        )
        return res.status(200).json({
            message: "International Package List Success",
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


export const interPackageUpdate = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, badge, international_id } = req.body;

        const [packages] = await db.query(
            "SELECT * FROM international_packages WHERE id = ?",
            [id]
        );

        if (packages.length === 0) {
            return res.status(404).json({
                success: false,
                message: "International Package not found!"
            });
        }

        const currentPackage = packages[0];
        const updateTitle = title ?? currentPackage.title;
        const updateDescription = description ?? currentPackage.description;
        const updatePrice = price ?? currentPackage.price;
        const updateBadge = badge ?? currentPackage.badge;
        const updateInternationalId = international_id ?? currentPackage.international_id;

        if (!updateTitle || updatePrice === "" || updateBadge === "" || !updateInternationalId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const [internationals] = await db.query(
            "SELECT id FROM internationals WHERE id = ?",
            [updateInternationalId]
        );

        if (internationals.length === 0) {
            return res.status(404).json({
                success: false,
                message: "International not found!"
            });
        }

        const uploadFolder = path.join(
            process.cwd(),
            "images",
            "internationPackage"
        );

        let updateImage = currentPackage.image;

        if (req.file) {
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
            updateImage = `images/internationPackage/${fileName}`;
        }

        const [data] = await db.query(
            `
            UPDATE international_packages
            SET title = ?, image = ?, price = ?, description = ?, international_id = ?, badge = ?
            WHERE id = ?
            `,
            [
                updateTitle,
                updateImage,
                updatePrice,
                updateDescription,
                updateInternationalId,
                updateBadge,
                id
            ]
        );

        if (req.file && currentPackage.image) {
            const oldPath = path.resolve(process.cwd(), currentPackage.image);
            const imageFolder = path.resolve(uploadFolder);

            if (oldPath.startsWith(`${imageFolder}${path.sep}`) && fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        return res.status(200).json({
            success: true,
            message: "International Package Update Successfully",
            data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


export const interPackageDelete = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;
        const [packages] = await db.query(
            `
            SELECT *
            FROM international_packages
            WHERE id = ?
            `,
            [id]
        );

        if (packages.length === 0) {
            return res.status(404).json({
                message: "International Package not found!",
                success: false
            });
        }

        await db.query(
            `
            DELETE FROM international_packages
            WHERE id = ?
            `,
            [id]
        );

        if (packages[0].image) {
            const imageFolder = path.resolve(process.cwd(), "images", "internationPackage");
            const oldPath = path.resolve(process.cwd(), packages[0].image);

            if (oldPath.startsWith(`${imageFolder}${path.sep}`) && fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        return res.status(200).json({
            success: true,
            message: "International Package Delete"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const interPackageMobileList = asyncHandel(async (req, res) => {
    try {

        const [data] = await db.query(
            `
            SELECT 
            id,
            title,
            image,
            price,
            description,
            international_id,
            badge,
            DATE_FORMAT(
            created_at,
            '%d-%m-%Y'
            ) AS created_at

            FROM 
            international_packages
            ORDER BY id DESC 
            `
        )
        return res.status(200).json({
            message: "International Packages List Success",
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
