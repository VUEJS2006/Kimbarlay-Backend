
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid"
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";


export const newfeedCreate = asyncHandel(async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const [data] = await db.query(
            `
            INSERT INTO newfeeds (name, description)
            VALUES (?, ?)
            `,
            [name, description]
        );

        return res.status(201).json({
            message: "New Feed Create Success",
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


export const newfeedList = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(
            `
            SELECT *
            FROM newfeeds
            ORDER BY id DESC
            `
        );

        return res.status(200).json({
            message: "New Feed List Success",
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


export const newfeedUpdate = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID is required!"
            });
        }

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "Name and description are required!"
            });
        }

        const [newfeeds] = await db.query(
            `
            SELECT id
            FROM newfeeds
            WHERE id = ?
            `,
            [id]
        );

        if (newfeeds.length === 0) {
            return res.status(404).json({
                message: "New Feed not found!",
                success: false
            });
        }

        const [data] = await db.query(
            `
            UPDATE newfeeds
            SET name = ?,
                description = ?
            WHERE id = ?
            `,
            [name, description, id]
        );

        return res.status(200).json({
            success: true,
            message: "New Feed Update Successfully",
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


export const newfeedDelete = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID is required!"
            });
        }

        const [newfeeds] = await db.query(
            `
            SELECT id
            FROM newfeeds
            WHERE id = ?
            `,
            [id]
        );

        if (newfeeds.length === 0) {
            return res.status(404).json({
                message: "New Feed not found!",
                success: false
            });
        }

        await db.query(
            `
            DELETE FROM newfeeds
            WHERE id = ?
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "New Feed Delete Successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


export const newfeedMobileList = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(
            `
            SELECT *
            FROM newfeeds
            ORDER BY id DESC
            `
        );

        return res.status(200).json({
            message: "New Feed List Success",
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
