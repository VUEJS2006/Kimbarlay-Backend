import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";



const eventCTA = "event_ctas";

export const createEventCTA = asyncHandel(async (req, res) => {
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
            INSERT INTO ${eventCTA}
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

export const listEventCTA = asyncHandel(async (req, res) => {
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
            FROM ${eventCTA}
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

export const updateEventCTA = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const eventId = Number(id);

        if (!Number.isSafeInteger(eventId) || eventId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Event CTA ID!"
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
            `SELECT id FROM ${eventCTA} WHERE id = ?`,
            [eventId]
        );

        if (events.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Event CTA not found!"
            });
        }

        await db.query(
            `
            UPDATE ${eventCTA}
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

export const deleteEventCTA = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const eventId = Number(id);

        if (!Number.isSafeInteger(eventId) || eventId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid Event CTA ID!"
            });
        }

        const [events] = await db.query(
            `SELECT id FROM ${eventCTA} WHERE id = ?`,
            [eventId]
        );

        if (events.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Event CTA not found!"
            });
        }

        await db.query(
            `DELETE FROM ${eventCTA} WHERE id = ?`,
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

export const mobileEventCTA = asyncHandel(async (req, res) => {
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
            FROM ${eventCTA}
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