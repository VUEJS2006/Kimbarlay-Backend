import db from "../config/db.js";


export const getRescheduleRequests = async( req , res ) => {
    try {
        const { user_id } = req.query;
        let query = 'SELECT * FROM reschedule_requests';
        let params = [];

        if (user_id) {
            query += ' WHERE user_id = ?';
            params.push(user_id);
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await db.execute(query, params);
        
        res.status(200).json({
            status : true,
            message: 'Reschedule Requests are here',
            data: rows
        });

    } catch (error) {
        res.status(500).json({
            status : false,
            message : err.message
        })
    }
}

export const createRescheduleRequest = async( req , res ) => {
    try {
        const { booking_id, user_id, new_travel_date, preferred_time } = req.body;

        const isValid =  booking_id && user_id && new_travel_date && preferred_time;
        if (!isValid) {
            return res.status(400).json({
                status : false,
                message : "booking_id, user_id, new_travel_date and preferred_time must exit"
            });
        }

        const [ users ] =  await db.execute('SELECT * FROM users WHERE id = ?', [user_id])

        if(!users || !users.length) {
            return res.status(400).json({
                status : false,
                message : "User not found in database"
            });
        }

        const [ bookings ] =  await db.execute(`SELECT * FROM bookings WHERE id = ? AND user_id = ? AND status IN ('PENDING', 'CONFIRMED','CANCELLED')`, [booking_id])

        if(!bookings || !bookings.length) {
            return res.status(400).json({
                status : false,
                message : "Pending or confirmed or canceled booking of your booking_id does not exit in database"
            });
        }

        const query = `
            INSERT INTO reschedule_requests (booking_id, user_id, new_travel_date, preferred_time, status)
            VALUES (?, ?, ?, ?, 'PENDING')
        `;

        const [result] = await db.execute(query, [booking_id, user_id, new_travel_date, preferred_time]);

        const [ rows ] =  await db.execute('SELECT * FROM reschedule_requests WHERE id = ?', [result.insertId])

        res.status(201).json({
            status : true,
            message: 'Reschedule request submitted successfully',
            data: rows[0]
        });

    } catch(err) {
        res.status(500).json({
            status : false,
            message : err.message
        })
    }
}


export const updateRescheduleRequest = async( req , res ) => {
    try {
        const id = req.params.id;
        const { new_travel_date, preferred_time } = req.body;

        const isValid = id && new_travel_date && preferred_time;
        if (!isValid) {
            return res.status(400).json({
                status : false,
                message : "id, new_travel_date and preferred_time must exit"
            });
        }

        const query = `
            UPDATE reschedule_requests 
            SET new_travel_date = ?, preferred_time = ? 
            WHERE id = ?
        `;
        const [result] = await db.execute(query, [new_travel_date, preferred_time, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: false,
                message: "Reschedule request not found"
            });
        }

        const [rows] = await db.execute(
            'SELECT * FROM reschedule_requests WHERE id = ?', 
            [id]
        );

        return res.status(200).json({
            status: true,
            message: 'Reschedule request updated successfully',
            data: rows[0]
        });

    } catch(err) {
        res.status(500).json({
            status : false,
            message : err.message
        })
    }
}

export const updateRescheduleStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        if (!id || !status) {
            return res.status(400).json({
                status: false,
                message: "id and status are required"
            });
        }

        const allowedStatuses = ['PENDING', 'APPROVED', 'REJECTED'];

        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                status: false,
                message: `Invalid status. Status must be one of: ${allowedStatuses.join(', ')}`
            });
        }

        const query = 'UPDATE reschedule_requests SET status = ? WHERE id = ?';
        const [result] = await db.execute(query, [status, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: false,
                message: "Reschedule request not found"
            });
        }

        const [rows] = await db.execute(
            'SELECT * FROM reschedule_requests WHERE id = ?', 
            [id]
        );

        return res.status(200).json({
            status: true,
            message: `Reschedule request status changed to ${status}`,
            data: rows[0]
        });

    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    }
};


export const deleteReschedule = async ( req , res ) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute('DELETE FROM reschedule_requests WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                status: true,
                message: 'Request not found' 
            });
        }
        res.status(200).json({
            status : false,
            message: 'Reschedule request deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}