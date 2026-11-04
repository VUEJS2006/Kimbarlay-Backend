import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";

const bookingTable = "daytip_bookings";

export const dayBookingCreate = asyncHandel(async (req, res) => {
    try {
        const {
            day_package_id,
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

        if (!day_package_id || !full_name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const [packages] = await db.query(
            "SELECT id FROM daytrip_packages WHERE id = ?",
            [day_package_id]
        );

        if (packages.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Package not found!"
            });
        }

        const [data] = await db.query(
            `
            INSERT INTO ${bookingTable}
                (user_id, day_package_id, full_name, email, phone, address)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                req.user.id,
                packages[0].id,
                full_name,
                email,
                phone,
                address || null
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Day Trip Booking created successfully.",
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

export const dayBookingList = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(
            `
            SELECT
                b.id AS booking_id,
                b.user_id,
                b.day_package_id,
                b.full_name,
                b.email,
                b.phone,
                b.address,
                b.status,
                p.title,
                p.description,
                p.price,
                p.badge,
                p.image,
                u.username,
                u.id AS customer_id,
                DATE_FORMAT(b.created_at, '%d-%m-%Y') AS created_at
            FROM ${bookingTable} b
            INNER JOIN daytrip_packages p
                ON b.day_package_id = p.id
            INNER JOIN users u
                ON b.user_id = u.id
            ORDER BY b.id DESC
            `
        );

        return res.status(200).json({
            success: true,
            message: "Day Trip Booking List Success",
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

export const dayBookingApproved = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const [booking] = await db.query(
            `SELECT id FROM ${bookingTable} WHERE id = ?`,
            [id]
        );

        if (booking.length === 0) {
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
            message: "Day Trip Booking Approved Successfully",
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

export const dayBookingCancelled = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const [booking] = await db.query(
            `SELECT id FROM ${bookingTable} WHERE id = ?`,
            [id]
        );

        if (booking.length === 0) {
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
            message: "Day Trip Booking Cancelled Successfully",
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

export const dayBookingMobileList = asyncHandel(async (req, res) => {
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
                b.day_package_id,
                b.full_name,
                b.email,
                b.phone,
                b.address,
                b.status,
                p.title,
                p.description,
                p.price,
                p.badge,
                p.image,
                DATE_FORMAT(b.created_at, '%d-%m-%Y') AS created_at
            FROM ${bookingTable} b
            INNER JOIN daytrip_packages p
                ON b.day_package_id = p.id
            WHERE b.user_id = ?
            ORDER BY b.id DESC
            `,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            message: "Day Trip Booking List Success",
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
