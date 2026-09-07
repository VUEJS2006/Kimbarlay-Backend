import db from "../config/db.js"
import { asyncHandel } from "../middleware/asyncMiddleware.js"


export const countryCreate = asyncHandel(async (req, res) => {
    try {

        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                message: "All filed are required!",
                success: false
            })
        }

        const [data] = await db.query(
            `
            INSERT INTO countrys (name)
            VALUES (?)
            `,
            [name]
        );
        return res.status(201).json({
            success: true,
            message: "Country Create Success",
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

export const countryList = asyncHandel(async (req, res) => {
    try {

        const [data] = await db.query("SELECT id,name,DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at FROM countrys ORDER BY id DESC");
        return res.status(200).json({
            success: true,
            message: "Country List Success",
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

export const countryUpdate = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const [country] = await db.query("SELECT * FROM countrys WHERE id = ?", [id]);
        if (country.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Country Not Found!"
            });
        }
        const [data] = await db.query(`
            UPDATE countrys SET 
            name = ?
            WHERE id = ?
            `,
            [name, id]
        )
        return res.status(200).json({
            success: true,
            message: "Country Update Success",
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

export const countryDelete = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const [country] = await db.query("SELECT * FROM countrys WHERE id = ?", [id]);
        if (country.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Country Not Found!"
            });
        }
        const [data] = await db.query(`DELETE FROM countrys WHERE id = ?`, [id])
        return res.status(201).json({
            success: true,
            message: "Country Delete Success"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})