import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";



const eventBadge = "event_badges";

export const createEventBadge = asyncHandel(async (req, res) => {
    try {
        const { icon, title } = req.body;

        if (!icon || !title) {
            return res.status(400).json({
                success: false,
                message: "Icon and title are required!"
            });
        }

        const [data] = await db.query(
            `
            INSERT INTO ${eventBadge}
            (icon, title)
            VALUES (?, ?)
            `,
            [icon, title]
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

export const listEventBadge = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(
            `
            SELECT
                id,
                icon,
                title,
                DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
            FROM ${eventBadge}
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

export const updateEventBadge = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const eventId = Number(id);
        const { icon, title } = req.body;

        if (!Number.isSafeInteger(eventId) || eventId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Event Badge ID!"
            });
        }

        if (!icon || !title) {
            return res.status(400).json({
                success: false,
                message: "Icon and title are required!"
            });
        }

        const [events] = await db.query(
            `SELECT id FROM ${eventBadge} WHERE id = ?`,
            [eventId]
        );

        if (events.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Event Badge not found!"
            });
        }

        await db.query(
            `
            UPDATE ${eventBadge}
            SET icon = ?, title = ?
            WHERE id = ?
            `,
            [icon, title, eventId]
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

export const deleteEventBadge = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const eventId = Number(id);

        if (!Number.isSafeInteger(eventId) || eventId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Event Badge ID!"
            });
        }

        const [events] = await db.query(
            `SELECT id FROM ${eventBadge} WHERE id = ?`,
            [eventId]
        );

        if (events.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Event Badge not found!"
            });
        }

        await db.query(
            `DELETE FROM ${eventBadge} WHERE id = ?`,
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

export const mobileEventBadge = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(
            `
            SELECT
                id,
                icon,
                title,
                DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
            FROM ${eventBadge}
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