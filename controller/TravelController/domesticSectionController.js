import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";



export const domesticSectionList = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT
                id,
                title,
                subtitle,
                icon,
                color,
                DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
            FROM domestic_sections
            ORDER BY id DESC
        `);

        return res.status(200).json({
            message: "Domestic Section List Success",
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

export const domesticSectionUpdate = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const [sections] = await db.query(
            "SELECT * FROM domestic_sections WHERE id = ?",
            [id]
        );

        if (sections.length === 0) {
            return res.status(404).json({
                message: "Domestic Section not found!",
                success: false
            });
        }

        const title = req.body.title ?? sections[0].title;
        const subtitle = req.body.subtitle ?? sections[0].subtitle;
        const icon = req.body.icon ?? sections[0].icon;
        const color = req.body.color ?? sections[0].color;

        const [data] = await db.query(
            `UPDATE domestic_sections
            SET title = ?, subtitle = ?, icon = ?, color = ?
            WHERE id = ?`,
            [title, subtitle, icon, color, id]
        );

        return res.status(200).json({
            success: true,
            message: "Domestic Section Update Successfully",
            data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const domesticSectionDelete = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const [sections] = await db.query(
            "SELECT id FROM domestic_sections WHERE id = ?",
            [id]
        );

        if (sections.length === 0) {
            return res.status(404).json({
                message: "Domestic Section not found!",
                success: false
            });
        }

        await db.query("DELETE FROM domestic_sections WHERE id = ?", [id]);

        return res.status(200).json({
            success: true,
            message: "Domestic Section Delete"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const domesticSectionMobileList = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(`
            SELECT
                id,
                title,
                subtitle,
                icon,
                color,
                DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
            FROM domestic_sections
            ORDER BY id DESC
        `);

        return res.status(200).json({
            message: "Domestic Section List Success",
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
