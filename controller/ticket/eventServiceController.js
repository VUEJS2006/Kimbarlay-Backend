import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";


const eventService = "event_services";

export const createEventService = asyncHandel(async (req, res) => {
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
            INSERT INTO ${eventService}
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

export const listEventService = asyncHandel(async (req, res) => {
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
            FROM ${eventService}
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

export const updateEventService = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const eventId = Number(id);

        if (!Number.isSafeInteger(eventId) || eventId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Event Service ID!"
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
            `SELECT id FROM ${eventService} WHERE id = ?`,
            [eventId]
        );

        if (events.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Event Service not found!"
            });
        }

        await db.query(
            `
            UPDATE ${eventService}
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

export const deleteEventService = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const eventId = Number(id);

        if (!Number.isSafeInteger(eventId) || eventId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Event Service ID!"
            });
        }

        const [events] = await db.query(
            `SELECT id FROM ${eventService} WHERE id = ?`,
            [eventId]
        );

        if (events.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Event Service not found!"
            });
        }

        await db.query(
            `DELETE FROM ${eventService} WHERE id = ?`,
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

export const mobileEventService = asyncHandel(async (req, res) => {
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
            FROM ${eventService}
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