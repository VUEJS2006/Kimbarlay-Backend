import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";




export const interBookingCreate = asyncHandel(async (req, res) => {
    try {
        const {
            inter_package_id,
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

        if (!inter_package_id || !full_name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const [packages] = await db.query(
            "SELECT id FROM international_packages WHERE id = ?",
            [inter_package_id]
        );

        if (packages.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Package not found!"
            });
        }


        const [data] = await db.query(
            `
            INSERT INTO inter_bookings
            (
                user_id,
                inter_package_id,
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
            message: "inter Booking created successfully.",
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


export const interBookingList = asyncHandel(async (req, res) => {
    try {
        if (req.user.role !== "admin") {
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
                b.inter_package_id,
                b.full_name,
                b.email,
                b.phone,
                b.address,
                b.status,

                p.title,
                p.image,
                p.price,
                p.description,
                p.badge,
                p.international_id,

                s.username,
                s.id AS customer_id,

                DATE_FORMAT(b.created_at, '%d-%m-%Y') AS created_at

            FROM inter_bookings b

            INNER JOIN international_packages p
                ON b.inter_package_id = p.id

            INNER JOIN users s
                ON b.user_id = s.id

            ORDER BY b.id DESC
            `
        );

        return res.status(200).json({
            success: true,
            message: "International Booking List Success",
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

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied!"
            });
        }

        const [booking] = await db.query(
            "SELECT id FROM inter_bookings WHERE id = ?",
            [id]
        );

        if (booking.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking ID not found!"
            });
        }

        const [data] = await db.query(
            "UPDATE inter_bookings SET status = 'approved' WHERE id = ?",
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "International Booking Approved Successfully",
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

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied!"
            });
        }

        const [booking] = await db.query(
            "SELECT id FROM inter_bookings WHERE id = ?",
            [id]
        );

        if (booking.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking ID not found!"
            });
        }

        const [data] = await db.query(
            "UPDATE inter_bookings SET status = 'cancelled' WHERE id = ?",
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "International Booking Cancelled Successfully",
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
                b.inter_package_id,
                b.full_name,
                b.email,
                b.phone,
                b.address,
                b.status,

                p.title,
                p.image,
                p.price,
                p.description,
                p.badge,
                p.international_id,

                DATE_FORMAT(b.created_at, '%d-%m-%Y') AS created_at

            FROM inter_bookings b

            INNER JOIN international_packages p
                ON b.inter_package_id = p.id

            WHERE b.user_id = ?

            ORDER BY b.id DESC
            `,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            message: "International Booking List Success",
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