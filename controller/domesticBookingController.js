import db from "../config/db.js"
import { asyncHandel } from "../middleware/asyncMiddleware.js"


export const domesticBookingCreate = asyncHandel(async (req, res) => {
    try {

        let {
            domestic_id,
            check_in,
            check_out,
            guests,
            rooms,
            full_name,
            email,
            phone,
            special_request,
        } = req.body;

        if (req.user.role !== "user") {
            return res.status(403).json({
                success: false,
                message: "Access denied!"
            });
        }

        if (!domestic_id || !check_in || !check_out || !guests || !rooms || !full_name || !phone || !email) {
            return res.status(400).json({
                message: "All fields are required!",
                success: false
            });
        }

        const [domestic] = await db.query(
            `
            SELECT * FROM domestic_hotels WHERE id = ?

            `,
            [
                domestic_id
            ]
        );
        if (domestic.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found!"
            });
        }
        const item = domestic[0]

        const [data] = await db.query(
            `
             
            INSERT INTO domestic_bookings 
            (
            user_id,
            domestic_id,
            check_in,
            check_out,
            guests,
            rooms,
            full_name,
            email,
            phone,
            special_request
            )
            VALUES (?,?,?,?,?,?,?,?,?,?)

            `,
            [
                req.user.id,
                item.id,
                check_in,
                check_out,
                guests,
                rooms,
                full_name,
                email,
                phone,
                special_request
            ]
        )

        return res.status(201).json({
            success: true,
            message: "Hotel Booking created successfully.",
            hotel_id: data.insertId,
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export const domesticBookingList = asyncHandel(async (req, res) => {
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
                b.domestic_id,
                b.user_id,

                DATE_FORMAT(b.check_in, '%d-%m-%Y %H:%i:%s') AS check_in,
                DATE_FORMAT(b.check_out, '%d-%m-%Y %H:%i:%s') AS check_out,
                b.guests,
                b.rooms,
                b.full_name,
                b.email,
                b.phone,
                b.status,
                b.special_request,

                h.id AS domestic_hotel_id,
                h.title,
                h.price,
                h.rating,
                h.color,
                h.tags,
                h.description,

                s.username,
                s.id AS customer_id,
                DATE_FORMAT(b.created_at, '%d-%m-%Y %H:%i:%s') AS created_at

            
            FROM domestic_bookings b
            JOIN domestic_hotels h
            ON b.domestic_id = h.id
            JOIN users s
            ON b.user_id = s.id
            ORDER BY b.id DESC
            `
        );
        return res.status(200).json({
            success: true,
            message: "Booking List Success",
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
})

export const domesticBookingApproved = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied!"
            });
        }
        const [booking] = await db.query("SELECT * FROM domestic_bookings WHERE id = ?", [id]);
        if (booking.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking ID not found!"
            });
        }

        const [data] = await db.query("UPDATE domestic_bookings SET status = 'approved' WHERE id = ?", [id])
        return res.status(200).json({
            success: true,
            message: "Hotel Booking Approved Successfully",
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

export const domesticBookingCancelled = asyncHandel(async (req, res) => {
    try {

        const { id } = req.params;
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied!"
            });
        }
        const [booking] = await db.query("SELECT * FROM domestic_bookings WHERE id = ?", [id]);
        if (booking.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Booking ID not found!"
            });
        }

        const [data] = await db.query("UPDATE domestic_bookings SET status = 'cancelled' WHERE id = ?", [id])
        return res.status(200).json({
            success: true,
            message: "Hotel Booking Cancelled Successfully",
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


export const domesticBookingMobileList = asyncHandel(async (req, res) => {
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
                b.domestic_id,
                b.user_id,

                DATE_FORMAT(b.check_in, '%d-%m-%Y %H:%i:%s') AS check_in,
                DATE_FORMAT(b.check_out, '%d-%m-%Y %H:%i:%s') AS check_out,
                b.guests,
                b.rooms,
                b.full_name,
                b.email,
                b.phone,
                b.status,
                b.special_request,

                h.id AS domestic_hotel_id,
                h.title,
                h.price,
                h.rating,
                h.color,
                h.tags,
                h.description,

                s.username,
                s.id AS customer_id,
                DATE_FORMAT(b.created_at, '%d-%m-%Y %H:%i:%s') AS created_at


            FROM domestic_bookings b
            JOIN domestic_hotels h
            ON b.domestic_id = h.id
            JOIN users s

            WHERE b.user_id = ?

            ORDER BY b.id DESC
            `,
            [req.user.id]
        );

        return res.status(200).json({
            success: true,
            message: "Booking List Success",
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
