import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";

const bannerTable = "studybanners";
const uploadFolder = path.join(process.cwd(), "images", "studyBanner");

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

    return `images/studyBanner/${fileName}`;
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
            tag,
            subtitle,
            image,
            DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
        FROM ${bannerTable}
        ORDER BY id DESC
        `
    );

    return data;
};

export const studybannerCreate = asyncHandel(async (req, res) => {
    try {
        const { title, subtitle, tag } = req.body;

        if (!title || !tag || !subtitle) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const imagePath = req.file ? await saveBannerImage(req.file) : null;
        const [data] = await db.query(
            `
            INSERT INTO ${bannerTable} (title, tag, subtitle, image)
            VALUES (?, ?, ?, ?)
            `,
            [title, tag, subtitle, imagePath]
        );

        return res.status(201).json({
            message: "Study banner Create Success",
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

export const studybannerList = asyncHandel(async (req, res) => {
    try {
        const data = await getBanners();

        return res.status(200).json({
            message: "Study Banner List Success",
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

export const studybannerUpdate = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const [banners] = await db.query(
            `SELECT * FROM ${bannerTable} WHERE id = ?`,
            [id]
        );

        if (banners.length === 0) {
            return res.status(404).json({
                message: "Study Banner not found!",
                success: false
            });
        }

        const currentBanner = banners[0];
        const title = req.body.title ?? currentBanner.title;
        const tag = req.body.tag ?? currentBanner.tag;
        const subtitle = req.body.subtitle ?? currentBanner.subtitle;
        const image = req.file
            ? await saveBannerImage(req.file)
            : currentBanner.image;

        const [data] = await db.query(
            `
            UPDATE ${bannerTable}
            SET title = ?, tag = ?, subtitle = ?, image = ?
            WHERE id = ?
            `,
            [title, tag, subtitle, image, id]
        );

        if (req.file) {
            deleteBannerImage(currentBanner.image);
        }

        return res.status(200).json({
            success: true,
            message: "Study Banner Update Successfully",
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

export const studybannerDelete = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const [banners] = await db.query(
            `SELECT * FROM ${bannerTable} WHERE id = ?`,
            [id]
        );

        if (banners.length === 0) {
            return res.status(404).json({
                message: "Study Banner not found!",
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
            message: "Study Banner Delete Successfully"
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const studybannerMobileList = asyncHandel(async (req, res) => {
    try {
        const data = await getBanners();

        return res.status(200).json({
            message: "Study Banner Mobile List Success",
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
