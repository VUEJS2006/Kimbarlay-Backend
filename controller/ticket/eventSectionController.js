import { text } from "express";
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";


export const eventSectionCreate = asyncHandel(async (req, res) => {
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
            INSERT INTO event_sections
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

export const eventSectionList = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT
                id,
                title,
                text,
                subtitle,
                DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
            FROM event_sections
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

export const eventSectionUpdate = asyncHandel(async (req, res) => {
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
            "SELECT id FROM event_sections WHERE id = ?",
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
            UPDATE event_sections
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

export const eventSectionDelete = asyncHandel(async (req, res) => {
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
            "SELECT id FROM event_sections WHERE id = ?",
            [sectionId]
        );

        if (sections.length === 0) {
            return res.status(404).json({
                message: "Event Section not found!",
                success: false
            });
        }

        await db.query(
            "DELETE FROM event_sections WHERE id = ?",
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

export const mobileEventSectionList = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT
                id,
                title,
                subtitle,
                text,
                DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
            FROM event_sections
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
