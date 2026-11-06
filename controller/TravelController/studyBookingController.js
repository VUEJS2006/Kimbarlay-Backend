import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";

const bookingTable = "study_bookings";
const destinationTable = "studydestination";

export const interBookingCreate = asyncHandel(async (req, res) => {
    try {
        const {
            study_destination_id,
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

        if (!study_destination_id || !full_name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const [packages] = await db.query(
            "SELECT id FROM studydestination WHERE id = ?",
            [study_destination_id]
        );

        if (packages.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Study destination not found!"
            });
        }


        const [data] = await db.query(
            `
            INSERT INTO study_bookings
            (
                user_id,
                study_destination_id,
                full_name,
                email,
                phone,
                address
            )
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
            message: "Study Booking created successfully.",
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

export { interBookingCreate as studyBookingCreate };

export const interBookingList = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query(
            `
            SELECT
                b.id AS booking_id,
                b.user_id,
                b.study_destination_id,
                b.full_name,
                b.email,
                b.phone,
                b.address,
                b.status,
                d.name,
                d.price,
                d.image,
                d.description,
                u.username,
                u.id AS customer_id,
                DATE_FORMAT(b.created_at, '%d-%m-%Y') AS created_at
            FROM ${bookingTable} b
            INNER JOIN ${destinationTable} d
                ON b.study_destination_id = d.id
            INNER JOIN users u
                ON b.user_id = u.id
            ORDER BY b.id DESC
            `
        );

        return res.status(200).json({
            success: true,
            message: "Study Booking List Success",
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

export const interBookingApproved = asyncHandel(async (req, res) => {
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
            message: "Study Booking Approved Successfully",
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

export const interBookingCancelled = asyncHandel(async (req, res) => {
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
            message: "Study Booking Cancelled Successfully",
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

export const interBookingMobileList = asyncHandel(async (req, res) => {
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
                b.study_destination_id,
                b.full_name,
                b.email,
                b.phone,
                b.address,
                b.status,
                d.name,
                d.price,
                d.image,
                d.description,
                DATE_FORMAT(b.created_at, '%d-%m-%Y') AS created_at
            FROM ${bookingTable} b
            INNER JOIN ${destinationTable} d
                ON b.study_destination_id = d.id
            WHERE b.user_id = ?
            ORDER BY b.id DESC
            `,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            message: "Study Booking List Success",
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

export {
    interBookingList as studyBookingList,
    interBookingApproved as studyBookingApproved,
    interBookingCancelled as studyBookingCancelled,
    interBookingMobileList as studyBookingMobileList
};