import db from "../../config/db.js";


export const getAllBoatTrustBadges = async (req , res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM boat_trust_badges ORDER BY id ASC");

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

export const createBoatTrustBadge = async (req , res) => {
    try {
        const { title , icon } = req.body;

        const isValid = title;
        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Title is required"
            })
        }

        const [ result ] = await db.query(`INSERT INTO boat_trust_badges ( title , icon) VALUES ( ? , ? )` , [title , icon])
        const [ rows ] = await db.query(`SELECT * FROM boat_trust_badges WHERE id = ?` , [result.insertId]);

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

export const updateBoatTrustBadge = async (req , res) => {
    try {
        const { id, title , icon } = req.body;

        const isValid = id && title;

        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Id and title are required"
            })
        }

        const [ result ] = await db.query(`UPDATE boat_trust_badges SET title = ? , icon = ? WHERE id = ?` , [title , icon , id])
        
        if(result.affectedRows === 0) {
            return res.status(400).json({
                status : false,
                message : "Wrong  or invalid Id!"
            })
        }

        const [ rows ] = await db.query(`SELECT * FROM boat_trust_badges WHERE id = ?` , [id]);


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

export const deleteBoatTrustBadge = async (req , res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({
                status : false,
                message : "Id is required"
            })
        }

        const [ result ] = await db.query(`DELETE FROM boat_trust_badges WHERE id = ?` , [ id ]);

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