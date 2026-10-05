import db from "../config/db.js";

export const getRefundRequests = async (req, res) => {
    try {
        const { user_id } = req.query;
        let query = 'SELECT * FROM refund_requests';
        let params = [];

        if (user_id) {
            query += ' WHERE user_id = ?';
            params.push(user_id);
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await db.execute(query, params);

        res.status(200).json({
            status: true,
            message: 'Refund requests retrieved successfully',
            data: rows
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

export const createRefundRequest = async( req , res ) => {
    try {
        const { booking_id, user_id, reason } = req.body;

        if (!booking_id || !user_id) {
            return res.status(400).json({
                status: false,
                message: "booking_id and user_id are required"
            });
        }

        const [ alreadyRefunded ] = await db.execute(
            `SELECT id, status FROM refund_requests 
            WHERE booking_id = ? AND user_id = ? AND status IN ('PENDING', 'APPROVED')`, 
            [booking_id, user_id]
        );

        if (alreadyRefunded && alreadyRefunded.length > 0) {
            return res.status(400).json({
                status: false,
                message: "A refund request has already been submitted for this booking."
            });
        }

        const [ users ] =  await db.execute('SELECT * FROM users WHERE id = ?', [user_id])

        if(!users || !users.length) {
            return res.status(400).json({
                status : false,
                message : "User not found in database"
            });
        }

        const [ bookings ] =  await db.execute(`SELECT * FROM bookings WHERE id = ? AND user_id = ? AND status IN ('PENDING', 'CONFIRMED')`, [booking_id , user_id])

        if(!bookings || !bookings.length) {
            return res.status(400).json({
                status : false,
                message : "pending or confirmed booking of your booking_id does not exit in database"
            });
        }

        const query = `
            INSERT INTO refund_requests (booking_id, user_id, reason, status)
            VALUES (?, ?, ?, 'PENDING')
        `;

        const [result] = await db.execute(query, [
            booking_id, 
            user_id, 
            reason || null
        ]);

        const [rows] = await db.execute(
            'SELECT * FROM refund_requests WHERE id = ?', 
            [result.insertId]
        );

        res.status(201).json({
            status: true,
            message: 'Refund request submitted successfully',
            data: rows[0]
        });

    } catch(err) {
        res.status(500).json({
            status : false,
            message : err.message
        })
    }
}

export const updateRefundRequest = async (req, res) => {
    try {
        const id = req.params.id;
        const { reason } = req.body;

        const query = `
            UPDATE refund_requests 
            SET reason = ? 
            WHERE id = ?
        `;
        const [result] = await db.execute(query, [reason || null, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: false,
                message: "Refund request not found"
            });
        }

        const [rows] = await db.execute(
            'SELECT * FROM refund_requests WHERE id = ?', 
            [id]
        );

        return res.status(200).json({
            status: true,
            message: 'Refund request updated successfully',
            data: rows[0]
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
};

export const updateRefundStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;

        const allowedStatuses = ['PENDING', 'APPROVED', 'REJECTED'];

        if (!status || !allowedStatuses.includes(status)) {
            return res.status(400).json({
                status: false,
                message: `Invalid status. Status must be one of: ${allowedStatuses.join(', ')}`
            });
        }

        const query = 'UPDATE refund_requests SET status = ? WHERE id = ?';
        const [result] = await db.execute(query, [status, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: false,
                message: "Refund request not found"
            });
        }

        const [rows] = await db.execute(
            'SELECT * FROM refund_requests WHERE id = ?', 
            [id]
        );

        return res.status(200).json({
            status: true,
            message: `Refund request status changed to ${status}`,
            data: rows[0]
        });

    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    }
};

export const deleteRefundRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.execute('DELETE FROM refund_requests WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                status: false,
                message: 'Refund request not found' 
            });
        }

        res.status(200).json({
            status: true,
            message: 'Refund request deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            status: false, 
            message: error.message 
        });
    }
};