import db from "../config/db.js"
import { asyncHandel } from "../middleware/asyncMiddleware.js"
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid"

const parseTags = (tags) => {
    if (!tags) {
        return [];
    }

    if (typeof tags === "string") {
        try {
            return JSON.parse(tags);
        } catch (error) {
            return tags
                .split(",")
                .map(item => item.trim())
                .filter(Boolean);
        }
    }

    return tags;
};

const saveImage = async (file) => {
    if (!file) {
        return null;
    }

    const uploadFolder = path.join(
        process.cwd(),
        "images",
        "oversea"
    );

    if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, {
            recursive: true
        });
    }

    const fileName = `${uuid()}.webp`;
    const savePath = path.join(uploadFolder, fileName);

    await sharp(file.buffer)
        .resize({
            width: 1920,
            withoutEnlargement: true
        })
        .webp({
            quality: 95
        })
        .toFile(savePath);

    return `images/oversea/${fileName}`;
};

const deleteImage = (imagePath) => {
    if (!imagePath) {
        return;
    }

    const fullPath = path.join(process.cwd(), imagePath);

    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
    }
};

export const overseaHotelCreate = asyncHandel(async (req, res) => {
    try {
        let {
            country_id,
            title,
            price,
            rating,
            color,
            tags,
            description
        } = req.body;

        if (!country_id || !title || !price) {
            return res.status(400).json({
                message: "Country, title and price are required!",
                success: false
            });
        }

        tags = parseTags(tags);
        const imagePath = await saveImage(req.file);

        const [data] = await db.query(
            `
            INSERT INTO oversea_hotels
            (
                country_id,
                title,
                price,
                rating,
                color,
                tags,
                description,
                image
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                country_id,
                title,
                price,
                rating,
                color,
                JSON.stringify(tags),
                description,
                imagePath
            ]
        );

        return res.status(201).json({
            message: "Oversea Hotel Create Success",
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

export const overseaHotelList = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(
            `
            SELECT
                h.id,
                h.country_id,
                c.name AS country_name,
                h.title,
                h.price,
                h.rating,
                h.color,
                h.tags,
                h.description,
                h.image,
                DATE_FORMAT(h.created_at, '%d-%m-%Y') AS created_at
            FROM oversea_hotels h
            LEFT JOIN countrys c
                ON h.country_id = c.id
            ORDER BY h.id DESC
            `
        );

        const result = data.map(item => ({
            ...item,
            tags: typeof item.tags === "string"
                ? JSON.parse(item.tags)
                : item.tags
        }));

        return res.status(200).json({
            message: "Oversea Hotel List Success",
            success: true,
            count: result.length,
            data: result
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const overseaHotelUpdate = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        let {
            country_id,
            title,
            price,
            rating,
            color,
            tags,
            description
        } = req.body;

        const [hotel] = await db.query(
            "SELECT * FROM oversea_hotels WHERE id = ?",
            [id]
        );

        if (hotel.length === 0) {
            return res.status(404).json({
                message: "Oversea hotel not found!",
                success: false
            });
        }

        if (!country_id || !title || !price) {
            return res.status(400).json({
                message: "Country, title and price are required!",
                success: false
            });
        }

        tags = parseTags(tags);
        let updateImage = hotel[0].image;

        if (req.file) {
            deleteImage(hotel[0].image);
            updateImage = await saveImage(req.file);
        }

        await db.query(
            `
            UPDATE oversea_hotels
            SET
                country_id = ?,
                title = ?,
                price = ?,
                rating = ?,
                color = ?,
                tags = ?,
                description = ?,
                image = ?
            WHERE id = ?
            `,
            [
                country_id,
                title,
                price,
                rating,
                color,
                JSON.stringify(tags),
                description,
                updateImage,
                id
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Oversea Hotel Update Successfully",
            hotel_id: id
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const overseaHotelDelete = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const [hotel] = await db.query(
            "SELECT * FROM oversea_hotels WHERE id = ?",
            [id]
        );

        if (hotel.length === 0) {
            return res.status(404).json({
                message: "Oversea hotel not found!",
                success: false
            });
        }

        deleteImage(hotel[0].image);

        await db.query(
            "DELETE FROM oversea_hotels WHERE id = ?",
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Oversea Hotel Delete Success"
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
