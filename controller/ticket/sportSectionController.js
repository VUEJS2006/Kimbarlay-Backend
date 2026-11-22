import { text } from "express";
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";


export const sportSectionCreate = asyncHandel(async (req, res) => {
    try {
        const { title, text, subtitle } = req.body;

        if (!title || !text || !subtitle) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const [data] = await db.query(
            `
            INSERT INTO sport_sections
            (title, text, subtitle)
            VALUES (?, ?, ?)
            `,
            [title, text, subtitle]
        );

        return res.status(201).json({
            message: "Create Success",
            success: true,
            id: data.insertId
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const sportSectionList = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT
                id,
                title,
                text,
                subtitle,
                DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
            FROM sport_sections
            ORDER BY id DESC
        `);

        return res.status(200).json({
            message: "List Success",
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

export const sportSectionUpdate = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const sectionId = Number(id);
        const { title, subtitle, text } = req.body;

        if (!Number.isSafeInteger(sectionId) || sectionId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Event Section ID!"
            });
        }

        if (!title || !subtitle || !text) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const [sections] = await db.query(
            "SELECT id FROM sport_sections WHERE id = ?",
            [sectionId]
        );

        if (sections.length === 0) {
            return res.status(404).json({
                message: "Event Section not found!",
                success: false
            });
        }

        await db.query(
            `
            UPDATE sport_sections
            SET title = ?, subtitle = ?, text = ?
            WHERE id = ?
            `,
            [title, subtitle, text, sectionId]
        );

        return res.status(200).json({
            success: true,
            message: "Update Success",
            id: sectionId
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const sportSectionDelete = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const sectionId = Number(id);

        if (!Number.isSafeInteger(sectionId) || sectionId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Event Section ID!"
            });
        }

        const [sections] = await db.query(
            "SELECT id FROM sport_sections WHERE id = ?",
            [sectionId]
        );

        if (sections.length === 0) {
            return res.status(404).json({
                message: "Event Section not found!",
                success: false
            });
        }

        await db.query(
            "DELETE FROM sport_sections WHERE id = ?",
            [sectionId]
        );

        return res.status(200).json({
            success: true,
            message: "Delete Success"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const mobileSportSectionList = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT
                id,
                title,
                subtitle,
                text,
                DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
            FROM sport_sections
            ORDER BY id DESC
        `);

        return res.status(200).json({
            message: "List Success",
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
