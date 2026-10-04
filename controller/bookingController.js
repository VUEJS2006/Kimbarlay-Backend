import db from "../config/db.js";

export const getBookings = async ( req , res ) => {
    try {
        const [rows] = await db.execute('SELECT * FROM bookings ORDER BY id DESC')

        res.status(200).json({
            status : true,
            message: 'Bookings are here.',
            body : rows
        });

    } catch(err) {
        return res.status(500).json({
            status : false,
            message: err.message
        });
    }
}

export const createBooking = async (req , res) => {
    try {
        const { pnr_code, user_id, flight_id, departure_date, cabin_class, adult_count, child_count, infant_count, contact_full_name, contact_email, contact_phone, special_requests, total_amount } = req.body;
        
        const isValid = pnr_code && user_id && flight_id && departure_date && cabin_class && contact_full_name && contact_email && contact_phone && contact_phone && total_amount;
        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "pnr_code, user_id, flight_id, departure_date, cabin_class, contact_full_name, contact_email, contact_phone, contact_phone and total_amount are required"
            })
        }

        const [users] = await db.query("SELECT * FROM users WHERE id = ?", [user_id]);

        if(!users || !users[0]) {
            return res.status(400).json({
                status : false,
                message : `Invalid user_id [${user_id}] : user does not exit in database.`
            })
        }

        const [flights] = await db.execute('SELECT * FROM flights WHERE id = ?', [flight_id]);

        if(!flights || !flights[0]) {
            return res.status(400).json({
                status : false,
                message : `Invalid flight_id [${flight_id}] : flight does not exit in database.`
            })
        }

        const query = `
            INSERT INTO bookings (
                pnr_code, user_id, flight_id, departure_date, cabin_class,
                adult_count, child_count, infant_count,
                contact_full_name, contact_email, contact_phone, special_requests,
                total_amount
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(query, [
            pnr_code, user_id, flight_id, departure_date, cabin_class || 'ECONOMY',
            adult_count || 1, child_count || 0, infant_count || 0,
            contact_full_name, contact_email, contact_phone, special_requests || null,
            total_amount
        ]);

        const [rows] = await db.execute('SELECT * FROM bookings WHERE id = ?', [result.insertId]);

        res.status(201).json({
            status : true,
            message: 'Booking created successfully',
            body : rows[0]
        });
    } catch(err) {
        console.error(err);
        return res.status(500).json({
            status : false,
            message: err.message
        });
    }
}


export const updateBooking = async (req , res) => {
    try {
        const { id , departure_date, cabin_class, adult_count, child_count, infant_count, contact_full_name, contact_email, contact_phone, special_requests, total_amount } = req.body;
        
        const isValid = id && departure_date && cabin_class && contact_full_name && contact_email && contact_phone && contact_phone && total_amount;
        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "departure_date, cabin_class, contact_full_name, contact_email, contact_phone, contact_phone and total_amount are required"
            })
        }

        const query = `
            UPDATE bookings SET 
                departure_date = ?, 
                cabin_class = ?, 
                adult_count = ?, 
                child_count = ?, 
                infant_count = ?, 
                contact_full_name = ?, 
                contact_email = ?, 
                contact_phone = ?, 
                special_requests = ?, 
                total_amount = ?
            WHERE id = ?
        `;

        const [result] = await db.execute(query, [
            departure_date, cabin_class, adult_count, child_count, infant_count,
            contact_full_name, contact_email, contact_phone, special_requests,
            total_amount, id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status : false,
                message: 'Booking not found'
            });
        }

        const [rows] = await db.execute('SELECT * FROM bookings WHERE id = ?', [id]);

        res.status(200).json({
            status : true,
            message: 'Booking updated successfully',
            body : rows[0]
        });

    } catch(err) {
        console.error(err);
        return res.status(500).json({
            status : false,
            message: err.message
        });
    }
}

export const changeBookingStatus = async (req , res) => {
    try {
        const { id , status } = req.body;

        if(!id) {
            return res.status(400).json({
                status : false,
                message : "id is required"
            });
        }

        const allowedStatuses = ['PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED'];
        if (!status || !allowedStatuses.includes(status.toUpperCase())) {
            return res.status(400).json({
                status : false,
                message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`
            });
        }

        const query = `UPDATE bookings SET status = ? WHERE id = ?`;
        const [result] = await db.execute(query, [status.toUpperCase(), id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status : false,
                message: 'Booking not found'
            });
        }

        return res.status(200).json({
            status: true,
            message: 'Booking status updated successfully',
            id,
            changedStatus : status.toUpperCase(),
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const deleteBooking = async ( req , res ) => {
    try {
        const { id } = req.params;
        const query = `DELETE FROM bookings WHERE id = ?`;
        const [result] = await db.execute(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        return res.status(200).json({ 
            status : true,
            message: 'Booking deleted successfully'
         });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}