import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";

const bannerTable = "daytripbanners";
const uploadFolder = path.join(process.cwd(), "images", "daytripBanner");

const saveBannerImage = async (file) => {
    if (!fs.existsSync(uploadFolder)) {
        fs.mkdirSync(uploadFolder, { recursive: true });
    }

    const fileName = `${uuid()}.webp`;
    const savePath = path.join(uploadFolder, fileName);

    await sharp(file.buffer)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 95 })
        .toFile(savePath);

    return `images/daytripBanner/${fileName}`;
};

const deleteBannerImage = (imagePath) => {
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

const getBanners = async () => {
    const [data] = await db.query(
        `
        SELECT
            id,
            title,
            description,
            image,
            DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
        FROM ${bannerTable}
        ORDER BY id DESC
        `
    );

    return data;
};

export const dayBannerCreate = asyncHandel(async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const imagePath = req.file ? await saveBannerImage(req.file) : null;
        const [data] = await db.query(
            `
            INSERT INTO ${bannerTable} (title, description, image)
            VALUES (?, ?, ?)
            `,
            [title, description, imagePath]
        );

        return res.status(201).json({
            message: "Day Trip Banner Create Success",
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

export const dayBannerList = asyncHandel(async (req, res) => {
    try {
        const data = await getBanners();

        return res.status(200).json({
            message: "Day Trip Banner List Success",
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

export const dayBannerUpdate = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const [banners] = await db.query(
            `SELECT * FROM ${bannerTable} WHERE id = ?`,
            [id]
        );

        if (banners.length === 0) {
            return res.status(404).json({
                message: "Day Trip Banner not found!",
                success: false
            });
        }

        const currentBanner = banners[0];
        const title = req.body.title ?? currentBanner.title;
        const description = req.body.description ?? currentBanner.description;
        const image = req.file
            ? await saveBannerImage(req.file)
            : currentBanner.image;

        const [data] = await db.query(
            `
            UPDATE ${bannerTable}
            SET title = ?, description = ?, image = ?
            WHERE id = ?
            `,
            [title, description, image, id]
        );

        if (req.file) {
            deleteBannerImage(currentBanner.image);
        }

        return res.status(200).json({
            success: true,
            message: "Day Trip Banner Update Successfully",
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

export const dayBannerDelete = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const [banners] = await db.query(
            `SELECT * FROM ${bannerTable} WHERE id = ?`,
            [id]
        );

        if (banners.length === 0) {
            return res.status(404).json({
                message: "Day Trip Banner not found!",
                success: false
            });
        }

        await db.query(
            `DELETE FROM ${bannerTable} WHERE id = ?`,
            [id]
        );
        deleteBannerImage(banners[0].image);

        return res.status(200).json({
            success: true,
            message: "Day Trip Banner Delete Successfully"
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const dayBannerMobileList = asyncHandel(async (req, res) => {
    try {
        const data = await getBanners();

        return res.status(200).json({
            message: "Day Trip Banner Mobile List Success",
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
