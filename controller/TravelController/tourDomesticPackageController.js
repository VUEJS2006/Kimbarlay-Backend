
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";




export const DomesticpackageCreate = asyncHandel(async (req, res) => {
    try {

        const { title, duration, original_price, price, discount, available_depart, domestic_id } = req.body;

        if (!title || !duration || !available_depart || !original_price || !domestic_id) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const [domestics] = await db.query(
            "SELECT id FROM tourdomestics WHERE id = ?",
            [domestic_id]
        );

        if (domestics.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tour Domestic not found!"
            });
        }

        const [data] = await db.query(
            `
            INSERT INTO domestic_packages (title,duration,original_price,price,discount,available_depart,domestic_id) VALUES (?,?,?,?,?,?,?)
            `,
            [
                title, duration, original_price, price, discount, available_depart, domestic_id
            ]
        )
        return res.status(201).json({
            message: "Domestic Package Create Success",
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

export const DomesticpackageList = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(
            `
            SELECT 
                dp.id,
                dp.title,
                dp.duration,
                CAST(dp.original_price AS UNSIGNED) AS original_price,
                CAST(dp.price AS UNSIGNED) AS price,
                CAST(dp.discount AS UNSIGNED) AS discount,
                dp.available_depart,
                dp.domestic_id,
                td.name AS name,
                td.image AS image,
                DATE_FORMAT(dp.created_at, '%d-%m-%Y') AS created_at
            FROM domestic_packages AS dp
            LEFT JOIN tourdomestics AS td ON dp.domestic_id = td.id
            ORDER BY dp.id DESC
            `
        );

        return res.status(200).json({
            message: "Domestic Package List Success",
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
export const DomesticpackageUpdate = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;
        const { title, duration, original_price, price, discount, available_depart, domestic_id } = req.body;

        const [packages] = await db.query("SELECT * FROM domestic_packages WHERE id = ?", [id]);

        if (packages.length === 0) {
            return res.status(404).json({
                message: "Domestic Package not found!",
                success: false
            });
        }

        const updatedDomesticId = domestic_id ?? packages[0].domestic_id;
        if (domestic_id != null) {
            const [domestics] = await db.query(
                "SELECT id FROM tourdomestics WHERE id = ?",
                [domestic_id]
            );

            if (domestics.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Tour Domestic not found!"
                });
            }
        }

        const [data] = await db.query(
            `
            UPDATE domestic_packages SET 
            title = ?,
            duration = ?,
            original_price = ?,
            price = ?,
            discount = ?,
            available_depart = ?,
            domestic_id = ?

            WHERE id = ?
            `,
            [
                title,
                duration,
                original_price,
                price,
                discount,
                available_depart,
                updatedDomesticId,
                id
            ]
        );
        return res.status(200).json({
            success: true,
            message: "Domestic Package  Update Successfully",
            data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const DomesticpackageDelete = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;
        const [packages] = await db.query(
            `
            SELECT *
            FROM domestic_packages
            WHERE id = ?
            `,
            [id]
        );

        if (packages.length === 0) {
            return res.status(404).json({
                message: "Domestic Package not found!",
                success: false
            });
        }

        await db.query(
            `
            DELETE FROM domestic_packages
            WHERE id = ?
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Domestic Package Delete"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const DomesticpackageMobileList = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(
            `
            SELECT 
                dp.id,
                dp.title,
                dp.duration,
                CAST(dp.original_price AS UNSIGNED) AS original_price,
                CAST(dp.price AS UNSIGNED) AS price,
                CAST(dp.discount AS UNSIGNED) AS discount,
                dp.available_depart,
                dp.domestic_id,
                td.name AS name,
                td.image AS image,
                DATE_FORMAT(dp.created_at, '%d-%m-%Y') AS created_at
            FROM domestic_packages AS dp
            LEFT JOIN tourdomestics AS td ON dp.domestic_id = td.id
            ORDER BY dp.id DESC
            `
        );

        return res.status(200).json({
            message: "Domestic Package List Success",
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