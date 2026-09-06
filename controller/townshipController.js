import db from "../config/db.js"
import { asyncHandel } from "../middleware/asyncMiddleware.js"


export const townshipCreate = asyncHandel(async (req, res) => {
    try {

        const { name, latitude, longitude } = req.body;
        if (!name || latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                message: "All filed are required!",
                success: false
            })
        }

        const [data] = await db.query(
            `
            INSERT INTO townships (name,latitude,longitude)
            VALUES (?,?,?)
            `,
            [name, latitude, longitude]
        );
        return res.status(201).json({
            success: true,
            message: "Township Create Success",
            data
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const townshipList = asyncHandel(async (req, res) => {
    try {

        const [data] = await db.query("SELECT id,name,latitude,longitude, DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at FROM townships ORDER BY id DESC");
        return res.status(200).json({
            success: true,
            message: "Township List Success",
            data
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const townshipUpdate = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const { name, latitude, longitude } = req.body;

        const [township] = await db.query("SELECT * FROM townships WHERE id = ?", [id]);
        if (township.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Township Not Found!"
            });
        }
        const [data] = await db.query(`
            UPDATE townships SET 
            name = ?,latitude = ?,longitude = ?
            WHERE id = ?
            `,
            [name, latitude, longitude, id]
        )
        return res.status(200).json({
            success: true,
            message: "Township Update Success",
            data
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const townshipDelete = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const [township] = await db.query("SELECT * FROM townships WHERE id = ?", [id]);
        if (township.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Township Not Found!"
            });
        }
        const [data] = await db.query(`DELETE FROM townships WHERE id = ?`, [id])
        return res.status(201).json({
            success: true,
            message: "Township Delete Success"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})