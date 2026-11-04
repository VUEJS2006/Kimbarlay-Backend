
import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";




export const packageCreate = asyncHandel(async (req, res) => {
    try {

        const { title, duration, original_price, price, discount, available_depart, destination_id } = req.body;

        if (!title || !duration || !available_depart || !original_price || !destination_id) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const [destinations] = await db.query(
            "SELECT id FROM tourdestinations WHERE id = ?",
            [destination_id]
        );

        if (destinations.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Tour Destination not found!"
            });
        }

        const [data] = await db.query(
            `
            INSERT INTO tourpackages (title,duration,original_price,price,discount,available_depart,destination_id) VALUES (?,?,?,?,?,?,?)
            `,
            [
                title, duration, original_price, price, discount, available_depart, destination_id
            ]
        )
        return res.status(201).json({
            message: "Tour Package Create Success",
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

export const packageList = asyncHandel(async (req, res) => {
    try {

        const [data] = await db.query(
            `
            SELECT 
            tourpackages.id,
            tourpackages.title,
            tourpackages.duration,
            tourpackages.original_price,
            tourpackages.price,
            tourpackages.discount,
            tourpackages.available_depart,
            tourpackages.destination_id,
            tourdestinations.name AS name,
            tourdestinations.image AS image,
            DATE_FORMAT(
            tourpackages.created_at,
            '%d-%m-%Y'
            ) AS created_at

            FROM 
            tourpackages
            LEFT JOIN tourdestinations ON tourpackages.destination_id = tourdestinations.id
            ORDER BY tourpackages.id DESC
            `
        )
        return res.status(200).json({
            message: "Tour Package List Success",
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

export const packageUpdate = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;
        const { title, duration, original_price, price, discount, available_depart, destination_id } = req.body;

        const [packages] = await db.query("SELECT * FROM tourpackages WHERE id = ?", [id]);

        if (packages.length === 0) {
            return res.status(404).json({
                message: "Tour Package not found!",
                success: false
            });
        }

        const updatedDestinationId = destination_id ?? packages[0].destination_id;
        if (destination_id != null) {
            const [destinations] = await db.query(
                "SELECT id FROM tourdestinations WHERE id = ?",
                [destination_id]
            );

            if (destinations.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Tour Destination not found!"
                });
            }
        }

        const [data] = await db.query(
            `
            UPDATE tourpackages SET 
            title = ?,
            duration = ?,
            original_price = ?,
            price = ?,
            discount = ?,
            available_depart = ?,
            destination_id = ?

            WHERE id = ?
            `,
            [
                title,
                duration,
                original_price,
                price,
                discount,
                available_depart,
                updatedDestinationId,
                id
            ]
        );
        return res.status(200).json({
            success: true,
            message: "Touer Package  Update Successfully",
            data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const packageDelete = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;
        const [packages] = await db.query(
            `
            SELECT *
            FROM tourpackages
            WHERE id = ?
            `,
            [id]
        );

        if (packages.length === 0) {
            return res.status(404).json({
                message: "Tour Package not found!",
                success: false
            });
        }

        await db.query(
            `
            DELETE FROM tourpackages
            WHERE id = ?
            `,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Tour Package Delete"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})

export const packageMobileList = asyncHandel(async (req, res) => {
    try {

        const [data] = await db.query(
            `
            SELECT 
            tourpackages.id,
            tourpackages.title,
            tourpackages.duration,
            tourpackages.original_price,
            tourpackages.price,
            tourpackages.discount,
            tourpackages.available_depart,
            tourpackages.destination_id,
            tourdestinations.name AS name,
            tourdestinations.image AS image,

            DATE_FORMAT(
            tourpackages.created_at,
            '%d-%m-%Y'
            ) AS created_at

            FROM 
            tourpackages
            LEFT JOIN tourdestinations ON tourpackages.destination_id = tourdestinations.id
            ORDER BY tourpackages.id DESC
            `
        )
        return res.status(200).json({
            message: "Tour Package List Success",
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