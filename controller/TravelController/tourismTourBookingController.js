import db from "../../config/db.js";


export const getAllTourismTourBookings = async (req , res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM tourism_tour_booking ORDER BY id ASC");

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

export const getUserTourismTourBookings = async (req , res) => {
    try {
        const userId = req.user.id;
        const [rows] = await db.execute("SELECT * FROM tourism_tour_booking WHERE user_id = ? ORDER BY id ASC " , [ userId ]);

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

export const createTourismTourBooking = async (req , res) => {
    try {
        const { packageId , fullName , emailAddress , phoneNumber , address } = req.body;
        const userId = req.user.id;
    
        const isValid = packageId && fullName && emailAddress && phoneNumber && address;

        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "PackageId, fullName, emailAddress, phoneNumber and address are required"
            })
        }

        if(!userId) {
            return res.status(400).json({
                status : false,
                message : "Only authenticated user can do booking!"
            })
        }

        const [ exitPackages ] = await db.query(`SELECT * FROM tourism_tour_package WHERE id = ?` , [ packageId ]);

        if(!exitPackages || !exitPackages.length) {
            return res.status(400).json({
                status : false,
                message : "Package does not exit in database!"
            })
        }

        const [ exitusers ] = await db.query(`SELECT * FROM users WHERE id = ?` , [ userId ]);

        if(!exitusers || !exitusers.length) {
            return res.status(400).json({
                status : false,
                message : "User does not exit in database!"
            })
        }

        const [ result ] = await db.query(`INSERT INTO tourism_tour_booking ( package_id , user_id , full_name , email_address , phone_number , address ) VALUES ( ? , ? , ? , ? , ? , ? )` , [ packageId , userId , fullName , emailAddress , phoneNumber , address ])
        const [ rows ] = await db.query(`SELECT * FROM tourism_tour_booking WHERE id = ?` , [result.insertId]);

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

export const bookingComfirmOrCancel = async (req , res) => {
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

        const [ result ] = await db.query(`UPDATE tourism_tour_booking SET booking_status = ? WHERE id = ?` , [ bookingStatus , id])
        
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

export const deleteTourismTourBooking = async (req , res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({
                status : false,
                message : "Id is required"
            })
        }

        const [ result ] = await db.query(`DELETE FROM tourism_tour_booking WHERE id = ?` , [ id ]);

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