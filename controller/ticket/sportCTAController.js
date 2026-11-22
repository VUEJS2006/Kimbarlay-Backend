import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";



const sportCTA = "sport_ctas";

export const createSportCTA = asyncHandel(async (req, res) => {
    try {
        const { title, subtitle, label1, label2 } = req.body;

        if (!title || !subtitle) {
            return res.status(400).json({
                success: false,
                message: "Title and subtitle are required!"
            });
        }

        const [data] = await db.query(
            `
            INSERT INTO ${sportCTA}
            (title, subtitle, label1, label2)
            VALUES (?, ?, ?, ?)
            `,
            [
                title,
                subtitle,
                label1 || null,
                label2 || null
            ]
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

export const listSportCTA = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(
            `
            SELECT
                id,
                title,
                subtitle,
                label1,
                label2,
                DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
            FROM ${sportCTA}
            ORDER BY id DESC
            `
        );

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

export const updateSportCTA = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const eventId = Number(id);

        if (!Number.isSafeInteger(eventId) || eventId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Sport CTA ID!"
            });
        }

        const { title, subtitle, label1, label2 } = req.body;

        if (!title || !subtitle) {
            return res.status(400).json({
                success: false,
                message: "Title and subtitle are required!"
            });
        }

        const [events] = await db.query(
            `SELECT id FROM ${sportCTA} WHERE id = ?`,
            [eventId]
        );

        if (events.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Sport CTA not found!"
            });
        }

        await db.query(
            `
            UPDATE ${sportCTA}
            SET
                title = ?,
                subtitle = ?,
                label1 = ?,
                label2 = ?
            WHERE id = ?
            `,
            [
                title,
                subtitle,
                label1 || null,
                label2 || null,
                eventId
            ]
        );

        return res.status(200).json({
            message: "Update Success",
            success: true,
            id: eventId
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const deleteSportCTA = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const eventId = Number(id);

        if (!Number.isSafeInteger(eventId) || eventId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Sport CTA ID!"
            });
        }

        const [events] = await db.query(
            `SELECT id FROM ${sportCTA} WHERE id = ?`,
            [eventId]
        );

        if (events.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Sport CTA not found!"
            });
        }

        await db.query(
            `DELETE FROM ${sportCTA} WHERE id = ?`,
            [eventId]
        );

        return res.status(200).json({
            message: "Delete Success",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const mobileSportCTA = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(
            `
            SELECT
                id,
                title,
                subtitle,
                label1,
                label2,
                DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
            FROM ${sportCTA}
            ORDER BY id DESC
            `
        );

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