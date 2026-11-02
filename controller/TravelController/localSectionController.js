import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";

export const localSectionCreate = asyncHandel(async (req, res) => {
    try {
        const { title, icon, subtitle, color = null } = req.body;

        if (!title || !icon || !subtitle) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const [data] = await db.query(
            "INSERT INTO local_sections (title, icon, subtitle, color) VALUES (?, ?, ?, ?)",
            [title, icon, subtitle, color]
        );

        return res.status(201).json({
            message: "Local Section Create Success",
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

export const localSectionList = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT
                id,
                title,
                subtitle,
                icon,
                color,
                DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
            FROM local_sections
            ORDER BY id DESC
        `);

        return res.status(200).json({
            message: "Local Section List Success",
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

export const localSectionUpdate = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const [sections] = await db.query(
            "SELECT * FROM local_sections WHERE id = ?",
            [id]
        );

        if (sections.length === 0) {
            return res.status(404).json({
                message: "Local Section not found!",
                success: false
            });
        }

        const title = req.body.title ?? sections[0].title;
        const subtitle = req.body.subtitle ?? sections[0].subtitle;
        const icon = req.body.icon ?? sections[0].icon;
        const color = req.body.color ?? sections[0].color;

        const [data] = await db.query(
            `UPDATE local_sections
            SET title = ?, subtitle = ?, icon = ?, color = ?
            WHERE id = ?`,
            [title, subtitle, icon, color, id]
        );

        return res.status(200).json({
            success: true,
            message: "Local Section Update Successfully",
            data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const localSectionDelete = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const [sections] = await db.query(
            "SELECT id FROM local_sections WHERE id = ?",
            [id]
        );

        if (sections.length === 0) {
            return res.status(404).json({
                message: "Local Section not found!",
                success: false
            });
        }

        await db.query("DELETE FROM local_sections WHERE id = ?", [id]);

        return res.status(200).json({
            success: true,
            message: "Local Section Delete"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const localSectionMobileList = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT
                id,
                title,
                subtitle,
                icon,
                color,
                DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
            FROM local_sections
            ORDER BY id DESC
        `);

        return res.status(200).json({
            message: "Local Section List Success",
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
