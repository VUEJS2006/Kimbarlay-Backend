
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";


export const interCreate = asyncHandel(async (req, res) => {
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
            INSERT INTO internationals (name) VALUES (?)
            `,
            [
                name
            ]
        )
        return res.status(201).json({
            message: "International  Create Success",
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

export const interList = asyncHandel(async (req, res) => {
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
            internationals
            ORDER BY id DESC 
            `
        )
        return res.status(200).json({
            message: "International List Success",
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

export const interUpdate = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;
        const { name } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID  are required!"
            });
        }

        const [Internationals] = await db.query(
            "SELECT * FROM internationals WHERE id = ?",
            [id]
        );

        if (Internationals.length === 0) {
            return res.status(404).json({
                message: "International not found!",
                success: false
            });
        }

        const [data] = await db.query(
            `
            UPDATE internationals
            SET name = ?
            WHERE id = ?
            `,
            [name, id]
        );

        return res.status(200).json({
            success: true,
            message: "International Update Successfully",
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

export const interDelete = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;
        const [Internationals] = await db.query(
            `
            SELECT *
            FROM internationals
            WHERE id = ?
            `,
            [id]
        );

        if (Internationals.length === 0) {
            return res.status(404).json({
                message: "International not found!",
                success: false
            });
        }

        await db.query(
            `
            DELETE FROM internationals
            WHERE id = ?
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "International Delete"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const interMobileList = asyncHandel(async (req, res) => {
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
            internationals
            ORDER BY id DESC 
            `
        )
        return res.status(200).json({
            message: "Internationals List Success",
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