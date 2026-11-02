import db from "../../config/db.js";
import { asyncHandel } from "../../middleware/asyncMiddleware.js";




export const tourDomesticBookingCreate = asyncHandel(async (req, res) => {
    try {
        const {
            domestic_package_id,
            depart_id,
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

        if (!domestic_package_id || !depart_id || !full_name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const [packages] = await db.query(
            "SELECT id FROM domestic_packages WHERE id = ?",
            [domestic_package_id]
        );

        if (packages.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Domestic Package not found!"
            });
        }

        const [depart] = await db.query(
            "SELECT id FROM departs WHERE id = ?",
            [depart_id]
        );

        if (depart.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Depart location not found!"
            });
        }

        const [data] = await db.query(
            `
            INSERT INTO tour_domestic_bookings
            (
                user_id,
                domestic_package_id,
                depart_id,
                full_name,
                email,
                phone,
                address
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            `,
            [
                req.user.id,
                packages[0].id,
                depart[0].id,
                full_name,
                email,
                phone,
                address || null
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Domestic Booking created successfully.",
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


export const tourDomesticBookingList = asyncHandel(async (req, res) => {
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
                b.domestic_package_id,
                b.user_id,
                b.depart_id,
                b.full_name,
                b.email,
                b.phone,
                b.status,
                b.address,

                p.title,
                p.duration,
                p.original_price,
                p.discount,
                p.price,
                p.available_depart,

                d.name AS depart_name,

                s.username,
                s.id AS customer_id,

                DATE_FORMAT(b.created_at, '%d-%m-%Y') AS created_at

            FROM tour_domestic_bookings b

            INNER JOIN domestic_packages p
                ON b.domestic_package_id = p.id

            INNER JOIN departs d
                ON b.depart_id = d.id

            INNER JOIN users s
                ON b.user_id = s.id

            ORDER BY b.id DESC
            `
        );

        return res.status(200).json({
            success: true,
            message: "Domestic Booking List Success",
            data,
            count: data.length
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const tourDomesticBookingApproved = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied!"
            });
        }

        const [booking] = await db.query(
            "SELECT * FROM tour_domestic_bookings WHERE id = ?",
            [id]
        );

        if (booking.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Domestic Booking ID not found!"
            });
        }

        const [data] = await db.query(
            "UPDATE tour_domestic_bookings SET status = 'approved' WHERE id = ?",
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Domestic Booking Approved Successfully",
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

export const tourDomesticBookingCancelled = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied!"
            });
        }

        const [booking] = await db.query(
            "SELECT * FROM tour_domestic_bookings WHERE id = ?",
            [id]
        );

        if (booking.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Domestic Booking ID not found!"
            });
        }

        const [data] = await db.query(
            "UPDATE tour_domestic_bookings SET status = 'cancelled' WHERE id = ?",
            [id]
        );

        return res.status(200).json({
            success: true,
            message: "Domestic Booking Cancelled Successfully",
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

export const tourDomesticBookingMobileList = asyncHandel(async (req, res) => {
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
                b.domestic_package_id,
                b.user_id,
                b.depart_id,
                b.full_name,
                b.email,
                b.phone,
                b.status,
                b.address,

                p.title,
                p.duration,
                p.original_price,
                p.discount,
                p.price,
                p.available_depart,

                d.name AS depart_name,

                DATE_FORMAT(b.created_at, '%d-%m-%Y') AS created_at

            FROM tour_domestic_bookings b

            INNER JOIN domestic_packages p
                ON b.domestic_package_id = p.id

            INNER JOIN departs d
                ON b.depart_id = d.id

            WHERE b.user_id = ?

            ORDER BY b.id DESC
            `,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            message: "Domestic Booking List Success",
            data,
            count: data.length
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
