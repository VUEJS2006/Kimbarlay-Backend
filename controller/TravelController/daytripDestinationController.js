import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";

const destinationTable = "daytripdestinations";
const uploadFolder = path.join(process.cwd(), "images", "dayDestination");

const saveDestinationImage = async (file) => {
    if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
    }

    const fileName = `${uuid()}.webp`;
    const savePath = path.join(uploadFolder, fileName);

    await sharp(file.buffer)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 95 })
        .toFile(savePath);

    return `images/dayDestination/${fileName}`;
};

const deleteDestinationImage = (imagePath) => {
    if (!imagePath) {
        return;
    }

    const resolvedFolder = path.resolve(uploadFolder);
    const resolvedImage = path.resolve(process.cwd(), imagePath);

    if (
        resolvedImage.startsWith(`${resolvedFolder}${path.sep}`) &&
        fs.existsSync(resolvedImage)
    ) {
        fs.unlinkSync(resolvedImage);
    }
};

const getDestinations = async () => {
    const [data] = await db.query(
        `
        SELECT
            id,
            name,
            image,
            DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
        FROM ${destinationTable}
        ORDER BY id DESC
        `
    );

    return data;
};

export const daydestinationCreate = asyncHandel(async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Name is required!"
            });
        }

        const imagePath = req.file ? await saveDestinationImage(req.file) : null;
        const [data] = await db.query(
            `INSERT INTO ${destinationTable} (name, image) VALUES (?, ?)`,
            [name, imagePath]
        );

        return res.status(201).json({
            message: "Day Destination Create Success",
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

export const daydestinationList = asyncHandel(async (req, res) => {
    try {
        const data = await getDestinations();

        return res.status(200).json({
            message: "Day Destination List Success",
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
            `SELECT * FROM ${destinationTable} WHERE id = ?`,
            [id]
        );

        if (destinations.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Day Destination not found!"
            });
        }

        const currentDestination = destinations[0];
        const name = req.body.name ?? currentDestination.name;
        const image = req.file
            ? await saveDestinationImage(req.file)
            : currentDestination.image;

        const [data] = await db.query(
            `
            UPDATE ${destinationTable}
            SET name = ?, image = ?
            WHERE id = ?
            `,
            [name, image, id]
        );

        if (req.file) {
            deleteDestinationImage(currentDestination.image);
        }

        return res.status(200).json({
            success: true,
            message: "Day Destination Update Successfully",
            data
        });
    } catch (error) {
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
            `SELECT * FROM ${destinationTable} WHERE id = ?`,
            [id]
        );

        if (destinations.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Day Destination not found!"
            });
        }

        await db.query(
            `DELETE FROM ${destinationTable} WHERE id = ?`,
            [id]
        );
        deleteDestinationImage(destinations[0].image);

        return res.status(200).json({
            success: true,
            message: "Day Destination Delete Successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const daydestinationMobileList = asyncHandel(async (req, res) => {
    try {
        const data = await getDestinations();

        return res.status(200).json({
            message: "Day Destination Mobile List Success",
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
