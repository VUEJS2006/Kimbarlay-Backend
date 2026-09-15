import db from "../config/db.js";

export const getFlights = async(req , res) => {
    try {

        const query = `SELECT * FROM flights ORDER BY id DESC`;
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

export const createFlight = async(req , res) => {
    try {
        const { route_id, airline_id, departure_time, arrival_time, price , duration } = req.body;

        
        const isValid = route_id && airline_id;
        if(!isValid) {
            return res.status(400).json({
                success: false,
                message: "'route_id' and 'airline_id' must exit!"
            });
        }

        const [routes] = await db.execute('SELECT id FROM routes WHERE id = ?', [route_id]);
        if (routes.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Route with ID ${route_id} does not exist in database.`
            });
        }

        const [airlines] = await db.execute('SELECT id FROM airlines WHERE id = ?', [airline_id]);
        if (airlines.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Airline with ID ${airline_id} does not exist in database.`
            });
        }

        const query = `
            INSERT INTO flights (route_id, airline_id, departure_time, arrival_time, price, duration)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(query, [
            route_id, 
            airline_id, 
            departure_time, 
            arrival_time, 
            price, 
            duration
        ]);

        const [rows] = await db.execute('SELECT * FROM flights WHERE id = ?', [result.insertId]);
        
        return res.status(201).json({
            success : true,
            message: "Flight created successfully",
            data : rows[0]
        });

    } catch(err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export const updateFlight = async(req , res) => {
    try {
        const { id, route_id, airline_id, departure_time, arrival_time, price , duration } = req.body;

        
        const isValid = id && route_id && airline_id;
        if(!isValid) {
            return res.status(400).json({
                success: false,
                message: "'id' , 'route_id' and 'airline_id' must exit!"
            });
        }

        const [flights] = await db.execute('SELECT * FROM flights WHERE id = ?', [id]);
        if(flights.length === 0) {
             return res.status(404).json({
                success: false,
                message: `Flight with ID ${id} does not exist in database.`
            });
        }


        const [routes] = await db.execute('SELECT id FROM routes WHERE id = ?', [route_id]);
        if (routes.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Route with ID ${route_id} does not exist in database.`
            });
        }

        const [airlines] = await db.execute('SELECT id FROM airlines WHERE id = ?', [airline_id]);
        if (airlines.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Airline with ID ${airline_id} does not exist in database.`
            });
        }

        const query = `
            INSERT INTO flights (route_id, airline_id, departure_time, arrival_time, price, duration)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(query, [
            route_id, 
            airline_id, 
            departure_time, 
            arrival_time, 
            price, 
            duration
        ]);

        const [rows] = await db.execute('SELECT * FROM flights WHERE id = ?', [result.insertId]);
        
        return res.status(201).json({
            success : true,
            message: "Flight created successfully",
            data : rows[0]
        });

    } catch(err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export const deleteFlight = async(req , res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Flight ID is required."
            });
        }

        const [flights] = await db.execute('SELECT * FROM flights WHERE id = ?', [id]);
        if(flights.length === 0) {
             return res.status(404).json({
                success: false,
                message: `Flight with ID ${id} does not exist in database.`
            });
        }

        await db.execute('DELETE FROM flights WHERE id = ?', [id]);

        return res.status(200).json({
            success: true,
            message: "Flight is deleted successfully",
        });

    } catch(err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}