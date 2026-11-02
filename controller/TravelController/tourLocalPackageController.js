
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";




export const LocalpackageCreate = asyncHandel(async (req, res) => {
    try {

        const { title, duration, original_price, price, discount, available_depart } = req.body;

        if (!title || !duration || !available_depart || !original_price) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }


        const [data] = await db.query(
            `
            INSERT INTO local_packages (title,duration,original_price,price,discount,available_depart) VALUES (?,?,?,?,?,?)
            `,
            [
                title, duration, original_price, price, discount, available_depart
            ]
        )
        return res.status(201).json({
            message: "Local Package Create Success",
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

export const LocalpackageList = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(
            `
            SELECT 
                id,
                title,
                duration,
                CAST(original_price AS UNSIGNED) AS original_price,
                CAST(price AS UNSIGNED) AS price,
                CAST(discount AS UNSIGNED) AS discount,
                available_depart,
                DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
            FROM local_packages
            ORDER BY id DESC
            `
        );

        return res.status(200).json({
            message: "Local Package List Success",
            success: true,
            count: data.length,
            data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});


export const LocalpackageUpdate = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;
        const { title, duration, original_price, price, discount, available_depart } = req.body;

        const [packages] = await db.query("SELECT * FROM local_packages WHERE id = ?", [id]);

        if (packages.length === 0) {
            return res.status(404).json({
                message: "Local Package not found!",
                success: false
            });
        }

        const [data] = await db.query(
            `
            UPDATE local_packages SET 
            title = ?,
            duration = ?,
            original_price = ?,
            price = ?,
            discount = ?,
            available_depart = ?

            WHERE id = ?
            `,
            [
                title,
                duration,
                original_price,
                price,
                discount,
                available_depart,
                id
            ]
        );
        return res.status(200).json({
            success: true,
            message: "Local Package  Update Successfully",
            data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const LocalpackageDelete = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;
        const [packages] = await db.query(
            `
            SELECT *
            FROM local_packages
            WHERE id = ?
            `,
            [id]
        );

        if (packages.length === 0) {
            return res.status(404).json({
                message: "Local Package not found!",
                success: false
            });
        }

        await db.query(
            `
            DELETE FROM local_packages
            WHERE id = ?
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Local Package Delete"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const LocalpackageMobileList = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(
            `
            SELECT 
                id,
                title,
                duration,
                CAST(original_price AS UNSIGNED) AS original_price,
                CAST(price AS UNSIGNED) AS price,
                CAST(discount AS UNSIGNED) AS discount,
                available_depart,
                DATE_FORMAT(created_at, '%d-%m-%Y') AS created_at
            FROM local_packages
            ORDER BY id DESC
            `
        );

        return res.status(200).json({
            message: "Local Package List Success",
            success: true,
            count: data.length,
            data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});