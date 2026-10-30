import db from "../../config/db.js";


export const getAllSpecialOffersAndDeals = async (req , res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM special_offers_and_deals ORDER BY id ASC");

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

export const createSpecialOfferAndDeal = async (req , res) => {
    try {
        const { title , description , meta } = req.body;

        if(!title) {
            return res.status(400).json({
                status : false,
                message : "Title is required"
            })
        }

        const [ result ] = await db.query(`INSERT INTO special_offers_and_deals (title, description, meta) VALUES ( ? , ? , ? )` , [title , description , meta])
        const [ rows ] = await db.query(`SELECT * FROM special_offers_and_deals WHERE id = ?` , [result.insertId]);

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

export const updateSpecialOfferAndDeal = async (req , res) => {
    try {
        const { id, title , description , meta } = req.body;

        const isValid = id && title;

        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Id and title are required"
            })
        }

        const [ result ] = await db.query(`UPDATE special_offers_and_deals SET title = ? , description = ? , meta = ? WHERE id = ?` , [title , description , meta , id])
        
        if(result.affectedRows === 0) {
            return res.status(400).json({
                status : false,
                message : "Wrong  or invalid Id!"
            })
        }

        const [ rows ] = await db.query(`SELECT * FROM special_offers_and_deals WHERE id = ?` , [id]);


        return res.status(200).json({
            status : true,
            message : "Successfully udated.",
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

export const deleteSpecialOfferAndDeal = async (req , res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({
                status : false,
                message : "Id is required"
            })
        }

        const [ result ] = await db.query(`DELETE FROM special_offers_and_deals WHERE id = ?` , [ id ]);

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