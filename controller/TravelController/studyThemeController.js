import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";

const themeTable = "studythemes";
const uploadFolder = path.join(process.cwd(), "images", "studyTheme");

const saveThemeImage = async (file) => {
    if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
    }

    const fileName = `${uuid()}.webp`;
    const savePath = path.join(uploadFolder, fileName);

    await sharp(file.buffer)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 95 })
        .toFile(savePath);

    return `images/studyTheme/${fileName}`;
};

const deleteThemeImage = (imagePath) => {
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

const getThemes = async () => {
    const [data] = await db.query(
        `
        SELECT
            id,
            name,
            description,
            icon,
            image,
            DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
        FROM ${themeTable}
        ORDER BY id DESC
        `
    );

    return data;
};

export const themeCreate = asyncHandel(async (req, res) => {
    try {
        const { name, description, icon } = req.body;

        if (!name || !icon) {
            return res.status(400).json({
                success: false,
                message: "Name and icon are required!"
            });
        }

        const imagePath = req.file ? await saveThemeImage(req.file) : null;
        const [data] = await db.query(
            `
            INSERT INTO ${themeTable} (name, description, icon, image)
            VALUES (?, ?, ?, ?)
            `,
            [name, description || null, icon, imagePath]
        );

        return res.status(201).json({
            message: "Study Theme Create Success",
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

export const themeList = asyncHandel(async (req, res) => {
    try {
        const data = await getThemes();

        return res.status(200).json({
            message: "Study Theme List Success",
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

export const themeUpdate = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const [themes] = await db.query(
            `SELECT * FROM ${themeTable} WHERE id = ?`,
            [id]
        );

        if (themes.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Study Theme not found!"
            });
        }

        const currentTheme = themes[0];
        const name = req.body.name ?? currentTheme.name;
        const description = req.body.description ?? currentTheme.description;
        const icon = req.body.icon ?? currentTheme.icon;
        const image = req.file
            ? await saveThemeImage(req.file)
            : currentTheme.image;

        const [data] = await db.query(
            `
            UPDATE ${themeTable}
            SET name = ?, description = ?, icon = ?, image = ?
            WHERE id = ?
            `,
            [name, description, icon, image, id]
        );

        if (req.file) {
            deleteThemeImage(currentTheme.image);
        }

        return res.status(200).json({
            success: true,
            message: "Study Theme Update Successfully",
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

export const themeDelete = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const [themes] = await db.query(
            `SELECT * FROM ${themeTable} WHERE id = ?`,
            [id]
        );

        if (themes.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Study Theme not found!"
            });
        }

        await db.query(
            `DELETE FROM ${themeTable} WHERE id = ?`,
            [id]
        );
        deleteThemeImage(themes[0].image);

        return res.status(200).json({
            success: true,
            message: "Study Theme Delete Successfully"
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const themeMobileList = asyncHandel(async (req, res) => {
    try {
        const data = await getThemes();

        return res.status(200).json({
            message: "Study Theme Mobile List Success",
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

