import db from "../../config/db.js";

const allowedScopes = [ "Domestic" , "International" ]

export const getAllBusRoutes = async (req , res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM bus_routes ORDER BY id ASC");

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

export const createBusRoute = async (req , res) => {
    try {
        const { origin , destination , sub_origin , sub_destination , duration , price , scope , operators } = req.body;

        const isValid = origin && destination && sub_origin && sub_destination && duration && price && scope && operators;
        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Origin , destination , sub_origin , sub_destination , duration , price , scope and operators are required"
            })
        }

        if(!allowedScopes.includes(scope)) {
            return res.status(400).json({
                status : false,
                message : "Scope is allowed only for " + allowedScopes.join(" , ")
            })
        }

        const [ result ] = await db.query(`INSERT INTO bus_routes ( origin , destination , sub_origin , sub_destination , duration , price , scope , operators ) VALUES ( ? , ? , ? , ? , ? , ? , ? , ? )` , [origin , destination , sub_origin , sub_destination , duration , price , scope , operators])
        const [ rows ] = await db.query(`SELECT * FROM bus_routes WHERE id = ?` , [result.insertId]);

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

export const updateBusRoute = async (req , res) => {
    try {
        const { id, origin , destination , sub_origin , sub_destination , duration , price , scope , operators } = req.body;

        const isValid = id && origin && destination && sub_origin && sub_destination && duration && price && scope && operators;

        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Id , origin , destination , sub_origin , sub_destination , duration , price , scope and operators are required"
            })
        }

        if(!allowedScopes.includes(scope)) {
            return res.status(400).json({
                status : false,
                message : "Scope is allowed only for " + allowedScopes.join(" , ")
            })
        }

        const [ result ] = await db.query(`UPDATE bus_routes SET origin = ? , destination = ? , sub_origin = ? , sub_destination = ? , duration = ? , price = ? , scope = ? , operators = ? WHERE id = ?` , [origin , destination , sub_origin , sub_destination , duration , price , scope , operators , id])
        
        if(result.affectedRows === 0) {
            return res.status(400).json({
                status : false,
                message : "Wrong  or invalid Id!"
            })
        }

        const [ rows ] = await db.query(`SELECT * FROM bus_routes WHERE id = ?` , [id]);

        return res.status(200).json({
            status : true,
            message : "Successfully updated.",
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

export const deleteBusRoute = async (req , res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({
                status : false,
                message : "Id is required"
            })
        }

        const [ result ] = await db.query(`DELETE FROM bus_routes WHERE id = ?` , [ id ]);

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