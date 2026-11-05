import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";

const bookingTable = "theme_bookings";
const themeTable = "studythemes";

export const studyThemeBookingCreate = asyncHandel(async (req, res) => {
    try {
        const {
            theme_id,
            full_name,
            email,
            phone,
            address
        } = req.body;

        if (req.user.role !== "user") {
            return res.status(403).json({
                success: false,
                message: "Access denied!"
            });
        }

        if (!theme_id || !full_name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const [themes] = await db.query(
            `SELECT id FROM ${themeTable} WHERE id = ?`,
            [theme_id]
        );

        if (themes.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Study Theme not found!"
            });
        }

        const [data] = await db.query(
            `
            INSERT INTO ${bookingTable}
                (user_id, theme_id, full_name, email, phone, address)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                req.user.id,
                themes[0].id,
                full_name,
                email,
                phone,
                address || null
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Study Theme Booking created successfully.",
            booking_id: data.insertId
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const studyThemeBookingList = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(
            `
            SELECT
                b.id AS booking_id,
                b.user_id,
                b.theme_id,
                b.full_name,
                b.email,
                b.phone,
                b.address,
                b.status,
                t.name,
                t.icon,
                t.image,
                t.description,
                u.username,
                u.id AS customer_id,
                DATE_FORMAT(b.created_at, '%d-%m-%Y') AS created_at
            FROM ${bookingTable} b
            INNER JOIN ${themeTable} t
                ON b.theme_id = t.id
            INNER JOIN users u
                ON b.user_id = u.id
            ORDER BY b.id DESC
            `
        );

        return res.status(200).json({
            success: true,
            message: "Study Theme Booking List Success",
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

export const studyThemeBookingApproved = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const [bookings] = await db.query(
            `SELECT id FROM ${bookingTable} WHERE id = ?`,
            [id]
        );

        if (bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking ID not found!"
            });
        }

        const [data] = await db.query(
            `UPDATE ${bookingTable} SET status = 'approved' WHERE id = ?`,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Study Theme Booking Approved Successfully",
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

export const studyThemeBookingCancelled = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const [bookings] = await db.query(
            `SELECT id FROM ${bookingTable} WHERE id = ?`,
            [id]
        );

        if (bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking ID not found!"
            });
        }

        const [data] = await db.query(
            `UPDATE ${bookingTable} SET status = 'cancelled' WHERE id = ?`,
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Study Theme Booking Cancelled Successfully",
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

export const studyThemeBookingMobileList = asyncHandel(async (req, res) => {
    try {
        if (req.user.role !== "user") {
            return res.status(403).json({
                success: false,
                message: "Access denied!"
            });
        }

        const [data] = await db.query(
            `
            SELECT
                b.id AS booking_id,
                b.user_id,
                b.theme_id,
                b.full_name,
                b.email,
                b.phone,
                b.address,
                b.status,
                t.name,
                t.icon,
                t.image,
                t.description,
                DATE_FORMAT(b.created_at, '%d-%m-%Y') AS created_at
            FROM ${bookingTable} b
            INNER JOIN ${themeTable} t
                ON b.theme_id = t.id
            WHERE b.user_id = ?
            ORDER BY b.id DESC
            `,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            message: "Study Theme Booking List Success",
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
