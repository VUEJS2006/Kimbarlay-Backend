import db from "../config/db.js";
import { allowedTypes } from "../utils/enum.js";

export const getRoutes= async(req , res) => {
    try {

        const query = `SELECT * FROM routes ORDER BY id DESC`;
        const [rows] = await db.execute(query);

        return res.status(200).json({
            success: true,
            total: rows.length,
            data : rows
        });

    } catch(err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export const createRoute = async(req , res) => {
    try {
        const { from_airport_id , to_airport_id , duration , stops = 0 , route_type  , is_popular = false } = req.body;
        
        const isValid = from_airport_id && to_airport_id && allowedTypes.includes(route_type);
        if(!isValid) {
            return res.status(400).json({
                success: false,
                message: "'from_airport_id' and 'to_airport_id' must exit. 'route_type' must be 'domestic' or 'international'!"
            });
        }

        if (from_airport_id === to_airport_id) {
            return res.status(400).json({ 
                success: false,
                message: "Departure and destination airports cannot be the same." 
            });
        }

        const [existingAirports] = await db.query(
            `SELECT id FROM airports WHERE id IN (?, ?)`,
            [from_airport_id, to_airport_id]
        );

        if (existingAirports.length !== 2) {
            return res.status(404).json({ 
                success : false,
                message: "One or both selected airports do not exist in the database." 
            });
        }

        const query = `INSERT INTO routes (from_airport_id, to_airport_id, duration, stops, route_type, is_popular)
        VALUES (?, ?, ?, ?, ?, ?)`;

        const [result] = await db.execute(query, [
            from_airport_id, 
            to_airport_id, 
            duration, 
            stops, 
            route_type, 
            is_popular
        ]);

        const [rows] = await db.execute('SELECT * FROM routes WHERE id = ?', [result.insertId]);
        
        return res.status(201).json({
            success : true,
            message: "Route created successfully",
            data : rows[0]
        });

    } catch(err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export const updateRoute = async(req , res) => {
    try {
        const { id , from_airport_id , to_airport_id , duration , stops = 0 , route_type  , is_popular = false } = req.body;
        
        const isValid = id && from_airport_id && to_airport_id && allowedTypes.includes(route_type);
        if(!isValid) {
            return res.status(400).json({
                success: false,
                message: "'id' , 'from_airport_id' and 'to_airport_id' must exit. 'route_type' must be 'domestic' or 'international'!"
            });
        }

        const [existing] = await db.execute('SELECT * FROM routes WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Route not found."
            });
        }

        if (from_airport_id === to_airport_id) {
            return res.status(400).json({
                success: false,
                message: "Departure and destination airports cannot be the same." 
            });
        }

        const [existingAirports] = await db.query(
            `SELECT id FROM airports WHERE id IN (?, ?)`,
            [from_airport_id, to_airport_id]
        );

        if (existingAirports.length !== 2) {
            return res.status(404).json({ 
                success : false,
                message: "One or both selected airports do not exist in the database." 
            });
        }

        const query = `
            UPDATE routes 
            SET from_airport_id = ?, to_airport_id = ?, duration = ?, stops = ?, route_type = ?, is_popular = ?
            WHERE id = ?
        `;

        await db.execute(query, [
            from_airport_id, 
            to_airport_id, 
            duration, 
            stops, 
            route_type, 
            is_popular,
            id
        ]);

        const [rows] = await db.execute('SELECT * FROM routes WHERE id = ?', [id]);
        
        return res.status(201).json({
            success : true,
            message: "Route updated successfully",
            data : rows[0]
        });

    } catch(err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


export const deleteRoute = async(req , res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Route ID is required."
            });
        }

        const [existing] = await db.execute('SELECT * FROM routes WHERE id = ?', [id]);

        if (!existing || existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Route not found."
            });
        }

        await db.execute('DELETE FROM routes WHERE id = ?', [id]);

        return res.status(200).json({
            success: true,
            message: "Route and related flights are deleted successfully",
        });

    } catch(err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}