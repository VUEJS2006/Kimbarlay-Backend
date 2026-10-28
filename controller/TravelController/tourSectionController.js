
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid"
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";




export const sectionCreate = asyncHandel(async (req, res) => {
    try {

        const { title, icon, subtitle, color } = req.body;

        if (!title || !icon || !subtitle) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }


        const [data] = await db.query(
            `
            INSERT INTO toursections (title,icon,subtitle,color) VALUES (?,?,?,?)
            `,
            [
                title, icon, subtitle, color
            ]
        )
        return res.status(201).json({
            message: "Tour Section Create Success",
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

export const sectionList = asyncHandel(async (req, res) => {
    try {

        const [data] = await db.query(
            `
            SELECT 
            id,
            title,
            subtitle,
            icon,
            color,
            DATE_FORMAT(
            created_at,
            '%d-%m-%Y'
            ) AS created_at

            FROM 
            toursections
            ORDER BY id DESC 
            `
        )
        return res.status(200).json({
            message: "Tour Section List Success",
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

export const sectionUpdate = asyncHandel(async (req, res) => {
    try {

        const { id } = req.body;
        const { title, subtitle, icon, color } = req.body;

        const [sections] = await db.query("SELECT * FROM toursections WHERE id = ?", [id]);

        if (sections.length === 0) {
            return res.status(404).json({
                message: "Tour Section not found!",
                success: false
            });
        }


        const [data] = await db.query(
            `
            UPDATE toursections SET 
            title = ?,
            subtitle = ?,
            icon = ?,
            color = ?

            WHERE id = ?
            `,
            [
                title,
                subtitle,
                icon,
                color,
                id
            ]
        );
        return res.status(200).json({
            success: true,
            message: "Touer Section  Update Successfully",
            data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const sectionDelete = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;
        const [sections] = await db.query(
            `
            SELECT *
            FROM toursections
            WHERE id = ?
            `,
            [id]
        );

        if (sections.length === 0) {
            return res.status(404).json({
                message: "Tour Section not found!",
                success: false
            });
        }

        await db.query(
            `
            DELETE FROM toursections
            WHERE id = ?
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Tour Section Delete"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const sectionMobileList = asyncHandel(async (req, res) => {
    try {

        const [data] = await db.query(
            `
            SELECT 
            id,
            title,
            subtitle,
            icon,
            color,
            DATE_FORMAT(
            created_at,
            '%d-%m-%Y'
            ) AS created_at

            FROM 
            toursections
            ORDER BY id DESC 
            `
        )
        return res.status(200).json({
            message: "Tour Section List Success",
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