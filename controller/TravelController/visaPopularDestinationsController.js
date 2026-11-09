import db from "../../config/db.js";


export const getAllVisaPopularDestinations = async (req , res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM visa_popular_destinations ORDER BY id ASC");

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

export const createVisaPopularDestinations = async (req , res) => {
    try {
        const { title , subtitle , duration } = req.body;

        const isValid = title && subtitle;
        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Title and subtitle are required"
            })
        }

        const [ result ] = await db.query(`INSERT INTO visa_popular_destinations ( title , subtitle , duration ) VALUES ( ? , ? , ? )` , [title , subtitle , duration])
        const [ rows ] = await db.query(`SELECT * FROM visa_popular_destinations WHERE id = ?` , [result.insertId]);

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

export const updateVisaPopularDestinations = async (req , res) => {
    try {
        const { id, title , subtitle , duration } = req.body;

        const isValid = id && subtitle;

        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Id, title and subtitle are required"
            })
        }

        const [ result ] = await db.query(`UPDATE visa_popular_destinations SET title = ? , subtitle = ? , duration = ? WHERE id = ?` , [title , subtitle , duration , id])
        
        if(result.affectedRows === 0) {
            return res.status(400).json({
                status : false,
                message : "Wrong  or invalid Id!"
            })
        }

        const [ rows ] = await db.query(`SELECT * FROM visa_popular_destinations WHERE id = ?` , [id]);


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

export const deleteVisaPopularDestinations = async (req , res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({
                status : false,
                message : "Id is required"
            })
        }

        const [ result ] = await db.query(`DELETE FROM visa_popular_destinations WHERE id = ?` , [ id ]);

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