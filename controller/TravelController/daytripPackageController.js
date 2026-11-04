import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";

const packageTable = "daytrip_packages";
const uploadFolder = path.join(process.cwd(), "images", "dayPackage");

const savePackageImage = async (file) => {
    if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
    }

    const fileName = `${uuid()}.webp`;
    const savePath = path.join(uploadFolder, fileName);

    await sharp(file.buffer)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 95 })
        .toFile(savePath);

    return `images/dayPackage/${fileName}`;
};

const deletePackageImage = (imagePath) => {
    if (!imagePath) {
        return;
    }

    const imageFolder = path.resolve(uploadFolder);
    const resolvedPath = path.resolve(process.cwd(), imagePath);

    if (
        resolvedPath.startsWith(`${imageFolder}${path.sep}`) &&
        fs.existsSync(resolvedPath)
    ) {
        fs.unlinkSync(resolvedPath);
    }
};

const getPackages = async () => {
    const [data] = await db.query(
        `
        SELECT
            packages.id,
            packages.title,
            packages.image,
            packages.price,
            packages.description,
            packages.daydestination_id,
            packages.badge,
            destinations.name AS destination_name,
            destinations.image AS destination_image,
            DATE_FORMAT(packages.created_at, '%d-%m-%Y') AS created_at
        FROM ${packageTable} AS packages
        LEFT JOIN daytripdestinations AS destinations
            ON packages.daydestination_id = destinations.id
        ORDER BY packages.id DESC
        `
    );

    return data;
};

export const dayPackageCreate = asyncHandel(async (req, res) => {
    try {
        const { title, description, price, badge, daydestination_id } = req.body;

        if (
            !title ||
            price === undefined ||
            price === null ||
            price === "" ||
            badge === undefined ||
            badge === null ||
            badge === "" ||
            daydestination_id === undefined ||
            daydestination_id === null ||
            daydestination_id === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const [destinations] = await db.query(
            "SELECT id FROM daytripdestinations WHERE id = ?",
            [daydestination_id]
        );

        if (destinations.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Day Destination not found!"
            });
        }

        const imagePath = req.file ? await savePackageImage(req.file) : null;
        const [data] = await db.query(
            `
            INSERT INTO ${packageTable}
                (title, image, price, description, daydestination_id, badge)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [title, imagePath, price, description, daydestination_id, badge]
        );

        return res.status(201).json({
            message: "Day Package Create Success",
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

export const dayPackageList = asyncHandel(async (req, res) => {
    try {
        const data = await getPackages();

        return res.status(200).json({
            message: "Day Package List Success",
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

export const dayPackageUpdate = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, badge, daydestination_id } = req.body;

        const [packages] = await db.query(
            `SELECT * FROM ${packageTable} WHERE id = ?`,
            [id]
        );

        if (packages.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Day Package not found!"
            });
        }

        const currentPackage = packages[0];
        const updatedTitle = title ?? currentPackage.title;
        const updatedDescription = description ?? currentPackage.description;
        const updatedPrice = price ?? currentPackage.price;
        const updatedBadge = badge ?? currentPackage.badge;
        const updatedDestinationId = daydestination_id ?? currentPackage.daydestination_id;

        if (
            !updatedTitle ||
            updatedPrice === "" ||
            updatedBadge === "" ||
            updatedDestinationId === undefined ||
            updatedDestinationId === null ||
            updatedDestinationId === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        if (daydestination_id !== undefined && daydestination_id !== null) {
            const [destinations] = await db.query(
                "SELECT id FROM daytripdestinations WHERE id = ?",
                [updatedDestinationId]
            );

            if (destinations.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Day Destination not found!"
                });
            }
        }

        const updatedImage = req.file
            ? await savePackageImage(req.file)
            : currentPackage.image;

        const [data] = await db.query(
            `
            UPDATE ${packageTable}
            SET title = ?, image = ?, price = ?, description = ?,
                daydestination_id = ?, badge = ?
            WHERE id = ?
            `,
            [
                updatedTitle,
                updatedImage,
                updatedPrice,
                updatedDescription,
                updatedDestinationId,
                updatedBadge,
                id
            ]
        );

        if (req.file) {
            deletePackageImage(currentPackage.image);
        }

        return res.status(200).json({
            success: true,
            message: "Day Package Update Successfully",
            data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const dayPackageDelete = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const [packages] = await db.query(
            `SELECT * FROM ${packageTable} WHERE id = ?`,
            [id]
        );

        if (packages.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Day Package not found!"
            });
        }

        await db.query(`DELETE FROM ${packageTable} WHERE id = ?`, [id]);
        deletePackageImage(packages[0].image);

        return res.status(200).json({
            success: true,
            message: "Day Package Delete Successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const dayPackageMobileList = asyncHandel(async (req, res) => {
    try {
        const data = await getPackages();

        return res.status(200).json({
            message: "Day Packages List Success",
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
