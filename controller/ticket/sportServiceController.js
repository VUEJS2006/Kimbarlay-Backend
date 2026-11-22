import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";


const sportService = "sport_services";

export const createSportService = asyncHandel(async (req, res) => {
    try {
        const { icon, color, myanmar, english, chinese } = req.body;

        if (!icon || !color) {
            return res.status(400).json({
                success: false,
                message: "Icon and color are required!"
            });
        }

        const [data] = await db.query(
            `
            INSERT INTO ${sportService}
            (icon, color, myanmar, english, chinese)
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                icon,
                color,
                myanmar || null,
                english || null,
                chinese || null
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

export const listSportService = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(
            `
            SELECT
                id,
                icon,
                color,
                myanmar,
                english,
                chinese,
                DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
            FROM ${sportService}
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

export const updateSportService = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const eventId = Number(id);

        if (!Number.isSafeInteger(eventId) || eventId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Sport Service ID!"
            });
        }

        const { icon, color, myanmar, english, chinese } = req.body;

        if (!icon || !color) {
            return res.status(400).json({
                success: false,
                message: "Icon and color are required!"
            });
        }

        const [events] = await db.query(
            `SELECT id FROM ${sportService} WHERE id = ?`,
            [eventId]
        );

        if (events.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Sport Service not found!"
            });
        }

        await db.query(
            `
            UPDATE ${sportService}
            SET
                icon = ?,
                color = ?,
                myanmar = ?,
                english = ?,
                chinese = ?
            WHERE id = ?
            `,
            [
                icon,
                color,
                myanmar || null,
                english || null,
                chinese || null,
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

export const deleteSportService = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const eventId = Number(id);

        if (!Number.isSafeInteger(eventId) || eventId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Sport Service ID!"
            });
        }

        const [events] = await db.query(
            `SELECT id FROM ${sportService} WHERE id = ?`,
            [eventId]
        );

        if (events.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Sport Service not found!"
            });
        }

        await db.query(
            `DELETE FROM ${sportService} WHERE id = ?`,
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

export const mobileSportService = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(
            `
            SELECT
                id,
                icon,
                color,
                myanmar,
                english,
                chinese,
                DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
            FROM ${sportService}
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