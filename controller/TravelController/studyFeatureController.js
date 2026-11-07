import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";

const featureTable = "study_features";

const getFeatures = async () => {
    const [data] = await db.query(
        `
        SELECT
            id,
            title,
            icon,
            description,
            DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
        FROM ${featureTable}
        ORDER BY id DESC
        `
    );

    return data;
};

export const featureCreate = asyncHandel(async (req, res) => {
    try {
        const { title, icon, description } = req.body;

        if (!title || !icon) {
            return res.status(400).json({
                success: false,
                message: "Title and icon are required!"
            });
        }

        const [data] = await db.query(
            `
            INSERT INTO ${featureTable} (title, icon, description)
            VALUES (?, ?, ?)
            `,
            [title, icon, description || null]
        );

        return res.status(201).json({
            message: "Study Feature Create Success",
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

export const featureList = asyncHandel(async (req, res) => {
    try {
        const data = await getFeatures();

        return res.status(200).json({
            message: "Study Feature List Success",
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

export const featureUpdate = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const [features] = await db.query(
            `SELECT * FROM ${featureTable} WHERE id = ?`,
            [id]
        );

        if (features.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Study Feature not found!"
            });
        }

        const currentFeature = features[0];
        const title = req.body.title ?? currentFeature.title;
        const icon = req.body.icon ?? currentFeature.icon;
        const description = req.body.description ?? currentFeature.description;

        const [data] = await db.query(
            `
            UPDATE ${featureTable}
            SET title = ?, icon = ?, description = ?
            WHERE id = ?
            `,
            [title, icon, description, id]
        );

        return res.status(200).json({
            success: true,
            message: "Study Feature Update Successfully",
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

export const featureDelete = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const [features] = await db.query(
            `SELECT id FROM ${featureTable} WHERE id = ?`,
            [id]
        );

        if (features.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Study Feature not found!"
            });
        }

        await db.query(
            `DELETE FROM ${featureTable} WHERE id = ?`,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Study Feature Delete Successfully"
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const featureMobileList = asyncHandel(async (req, res) => {
    try {
        const data = await getFeatures();

        return res.status(200).json({
            message: "Study Feature Mobile List Success",
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

