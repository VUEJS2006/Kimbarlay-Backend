import db from "../config/db.js";
import { changeToImageFullUrl } from "../utils/image.js";

export const getSearchFlightsWithRelatedData = async(req , res) => {
    try {

        const { from , to , date , class : flightClass , passengers } = req.query;

        if(!from) {
            return res.status(400).json({
                success : false,
                message : "There must be a least one letter for the departure airport name."
            })
        }

        const query = `
            SELECT 
                a.id AS from_airport_id,
                a.name AS from_airport_name,
                a.code AS from_airport_code,
                a.city AS from_airport_city,
                a.country AS from_airport_country,

                t.id AS to_airport_id,
                t.name AS to_airport_name,
                t.code AS to_airport_code,
                t.city AS to_airport_city,
                t.country AS to_airport_country,
                
                r.id AS route_id,
                r.stops,
                r.route_type,

                f.id AS flight_id,
                f.departure_time,
                f.arrival_time,
                f.price,
                f.adult_price,
                f.child_price,
                f.infant_price,
                f.duration AS flight_duration,
                
                al.id AS airline_id,
                al.name AS airline_name,
                al.code AS airline_code,
                al.logo_url AS airline_logo,
                al.brand_color AS airline_brand_color,
                al.status AS airline_status

            FROM airports a
            INNER JOIN routes r ON a.id = r.from_airport_id
            INNER JOIN airports t ON r.to_airport_id = t.id

            INNER JOIN flights f ON r.id = f.route_id

            INNER JOIN airlines al ON f.airline_id = al.id

            WHERE a.city LIKE ?;
        `

        // const query = `SELECT * FROM airports WHERE name LIKE ?`;
        let [flights] = await db.execute(query , [`%${from}%`]);

        if(to) {
            flights = flights.filter(item => item.to_airport_city && item.to_airport_city.toLowerCase().includes(to.toLowerCase())).map(item => ({...item , airline_logo : changeToImageFullUrl(item.airline_logo)}))
        }

        res.status(200).json({
            success : true,
            data : {
                from, to , class : flightClass , date , passengers,
                flights 
            }
        })

    } catch(err) {
        console.error("Database Error:", err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

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
        const { route_id, airline_id, departure_time, arrival_time, price, adult_price, child_price, infant_price, duration } = req.body;

        
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
            INSERT INTO flights (
                route_id,
                airline_id,
                departure_time,
                arrival_time,
                price,
                adult_price,
                child_price,
                infant_price,
                duration
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(query, [
            route_id, 
            airline_id, 
            departure_time, 
            arrival_time, 
            price,
            adult_price,
            child_price,
            infant_price, 
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
        const { id, route_id, airline_id, departure_time, arrival_time, price,  adult_price, child_price, infant_price, duration } = req.body;

        
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
            UPDATE flights
            SET
                route_id = ?,
                airline_id = ?,
                departure_time = ?,
                arrival_time = ?,
                price = ?,
                adult_price = ?,
                child_price = ?,
                infant_price = ?,
                duration = ?
            WHERE id = ?
        `;

        await db.execute(query, [
            route_id,
            airline_id,
            departure_time,
            arrival_time,
            price,
            adult_price,
            child_price,
            infant_price,
            duration,
            id
        ]);

        const [rows] = await db.execute('SELECT * FROM flights WHERE id = ?', [id]);
        
        return res.status(201).json({
            success : true,
            message: "Flight updated successfully",
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