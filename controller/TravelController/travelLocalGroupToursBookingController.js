import db from "../../config/db.js";


export const getAllTravelLocalGroupToursBookings = async (req , res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM travel_local_group_tours_bookings ORDER BY id ASC");

        res.status(200).json({
            status : true,
            message : "All items are here",
            data : rows
        })

    } catch(err) {
        console.error(err);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}

export const getUserTravelLocalGroupToursBookings = async (req , res) => {
    try {
        const userId = req.user.id;
        const [rows] = await db.execute("SELECT * FROM travel_local_group_tours_bookings WHERE user_id = ? ORDER BY id ASC " , [ userId ]);

        res.status(200).json({
            status : true,
            message : "User-related bookings are here",
            data : rows
        })

    } catch(err) {
        console.error(err);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}

export const createTravelLocalGroupToursBooking = async (req , res) => {
    try {
        const { localGroupTourId , fullName , emailAddress , phoneNumber , address } = req.body;
        const userId = req.user.id;
    
        const isValid = localGroupTourId && fullName && emailAddress && phoneNumber && address;

        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "localGroupTourId, fullName, emailAddress, phoneNumber and address are required"
            })
        }

        if(!userId) {
            return res.status(400).json({
                status : false,
                message : "Only authenticated user can do booking!"
            })
        }

        const [ exitLocalGroupTours ] = await db.query(`SELECT * FROM travel_local_group_tours WHERE id = ?` , [ localGroupTourId ]);

        if(!exitLocalGroupTours || !exitLocalGroupTours.length) {
            return res.status(400).json({
                status : false,
                message : "Local Group Tour does not exit in database!"
            })
        }

        const [ exitUsers ] = await db.query(`SELECT * FROM users WHERE id = ?` , [ userId ]);

        if(!exitUsers || !exitUsers.length) {
            return res.status(400).json({
                status : false,
                message : "User does not exit in database!"
            })
        }

        const [ result ] = await db.query(`INSERT INTO travel_local_group_tours_bookings ( local_group_tour_id , user_id , full_name , email_address , phone_number , address ) VALUES ( ? , ? , ? , ? , ? , ? )` , [ localGroupTourId , userId , fullName , emailAddress , phoneNumber , address ])
        const [ rows ] = await db.query(`SELECT * FROM travel_local_group_tours_bookings WHERE id = ?` , [result.insertId]);

        return res.status(201).json({
            status : true,
            message : "Successfully created",
            data : rows[0]
        })

    } catch(err) {
        console.error(err);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}

const allowedBookingStatus = ['Pending', 'Confirmed', 'Cancelled']

export const bookingComfirmOrCancelForLocalGroupTour = async (req , res) => {
    try {
        const { id, bookingStatus } = req.body;

        const isValid = id && bookingStatus;

        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Id and bookingStatus are required"
            })
        }

        if(!allowedBookingStatus.includes(bookingStatus)) {
            return res.status(400).json({
                status : false,
                message : "BookingStatus must exactly be one of " + allowedBookingStatus.join(" , ")
            })
        }

        const [ result ] = await db.query(`UPDATE travel_local_group_tours_bookings SET booking_status = ? WHERE id = ?` , [ bookingStatus , id])
        
        if(result.affectedRows === 0) {
            return res.status(400).json({
                status : false,
                message : "Wrong  or invalid Id!"
            })
        }

        return res.status(200).json({
            status : true,
            message : "Successfully " + bookingStatus,
        })

    } catch(err) {
        console.error(err);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}

export const deleteTravelLocalGroupToursBooking = async (req , res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({
                status : false,
                message : "Id is required"
            })
        }

        const [ result ] = await db.query(`DELETE FROM travel_local_group_tours_bookings WHERE id = ?` , [ id ]);

        if(result.affectedRows === 0) {
            return res.status(400).json({
                status : false,
                message : "Wrong or invalid id!"
            })
        }

        res.status(200).json({
            status : true,
            message : "Successfully deleted."
        })

    } catch(err) {
        console.error(err);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}