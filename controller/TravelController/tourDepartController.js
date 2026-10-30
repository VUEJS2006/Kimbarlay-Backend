
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid"
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";


export const departCreate = asyncHandel(async (req, res) => {
    try {

        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }


        const [data] = await db.query(
            `
            INSERT INTO departs (name) VALUES (?)
            `,
            [
                name
            ]
        )
        return res.status(201).json({
            message: "Depart Create Success",
            success: true,
            data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const departList = asyncHandel(async (req, res) => {
    try {

        const [data] = await db.query(
            `
            SELECT 
            id,
            name,
            DATE_FORMAT(
            created_at,
            '%d-%m-%Y'
            ) AS created_at

            FROM 
            departs
            ORDER BY id DESC 
            `
        )
        return res.status(200).json({
            message: "Depart List Success",
            success: true,
            count: data.length,
            data: data
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const departUpdate = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;
        const { name } = req.body;

        if (!id || !name) {
            return res.status(400).json({
                success: false,
                message: "ID and name are required!"
            });
        }

        const [departs] = await db.query(
            "SELECT * FROM departs WHERE id = ?",
            [id]
        );

        if (departs.length === 0) {
            return res.status(404).json({
                message: "Depart not found!",
                success: false
            });
        }

        const [data] = await db.query(
            `
            UPDATE departs
            SET name = ?
            WHERE id = ?
            `,
            [name, id]
        );

        return res.status(200).json({
            success: true,
            message: "Depart Update Successfully",
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

export const departDelete = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;
        const [departs] = await db.query(
            `
            SELECT *
            FROM departs
            WHERE id = ?
            `,
            [id]
        );

        if (departs.length === 0) {
            return res.status(404).json({
                message: "Depart not found!",
                success: false
            });
        }

        await db.query(
            `
            DELETE FROM departs
            WHERE id = ?
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Depart Delete"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const departMobileList = asyncHandel(async (req, res) => {
    try {

        const [data] = await db.query(
            `
            SELECT 
            id,
            name,
            DATE_FORMAT(
            created_at,
            '%d-%m-%Y'
            ) AS created_at

            FROM 
            departs
            ORDER BY id DESC 
            `
        )
        return res.status(200).json({
            message: "Departs List Success",
            success: true,
            count: data.length,
            data: data
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})