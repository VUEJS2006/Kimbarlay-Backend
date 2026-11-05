import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";

const destinationTable = "studydestination";
const uploadFolder = path.join(process.cwd(), "images", "studyDestination");

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

    return `images/studyDestination/${fileName}`;
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
            price,
            description,
            image,
            DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
        FROM ${destinationTable}
        ORDER BY id DESC
        `
    );

    return data;
};

export const studydestinationCreate = asyncHandel(async (req, res) => {
    try {
        const { name, description, price } = req.body;

        if (!name || !price) {
            return res.status(400).json({
                success: false,
                message: "Name and price are required!"
            });
        }

        const imagePath = req.file ? await saveDestinationImage(req.file) : null;
        const [data] = await db.query(
            `
            INSERT INTO ${destinationTable} (name, price, description, image)
            VALUES (?, ?, ?, ?)
            `,
            [name, price, description || null, imagePath]
        );

        return res.status(201).json({
            message: "Study Destination Create Success",
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

export const studydestinationList = asyncHandel(async (req, res) => {
    try {
        const data = await getDestinations();

        return res.status(200).json({
            message: "Study Destination List Success",
            success: true,
            count: data.length,
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

export const studydestinationUpdate = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const [destinations] = await db.query(
            `SELECT * FROM ${destinationTable} WHERE id = ?`,
            [id]
        );

        if (destinations.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Study Destination not found!"
            });
        }

        const currentDestination = destinations[0];
        const name = req.body.name ?? currentDestination.name;
        const price = req.body.price ?? currentDestination.price;
        const description = req.body.description ?? currentDestination.description;
        const image = req.file
            ? await saveDestinationImage(req.file)
            : currentDestination.image;

        const [data] = await db.query(
            `
            UPDATE ${destinationTable}
            SET name = ?, price = ?, description = ?, image = ?
            WHERE id = ?
            `,
            [name, price, description, image, id]
        );

        if (req.file) {
            deleteDestinationImage(currentDestination.image);
        }

        return res.status(200).json({
            success: true,
            message: "Study Destination Update Successfully",
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

export const studydestinationDelete = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const [destinations] = await db.query(
            `SELECT * FROM ${destinationTable} WHERE id = ?`,
            [id]
        );

        if (destinations.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Study Destination not found!"
            });
        }

        await db.query(
            `DELETE FROM ${destinationTable} WHERE id = ?`,
            [id]
        );
        deleteDestinationImage(destinations[0].image);

        return res.status(200).json({
            success: true,
            message: "Study Destination Delete Successfully"
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const studydestinationMobileList = asyncHandel(async (req, res) => {
    try {
        const data = await getDestinations();

        return res.status(200).json({
            message: "Study Destination Mobile List Success",
            success: true,
            count: data.length,
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
