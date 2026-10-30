import db from "../../config/db.js";


export const getAllTavelGroupOnBanners = async (req , res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM travel_group_on_banners ORDER BY id ASC");

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

export const createTavelGroupOnBanners = async (req , res) => {
    try {
        const { groupTitle , items } = req.body;

        if(!groupTitle) {
            return res.status(400).json({
                status : false,
                message : "Group title is required"
            })
        }

        const [ result ] = await db.query(`INSERT INTO travel_group_on_banners ( group_title, items ) VALUES ( ? , ? )` , [ groupTitle , items ])
        const [ rows ] = await db.query(`SELECT * FROM travel_group_on_banners WHERE id = ?` , [result.insertId]);

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

export const updateTavelGroupOnBanners = async (req , res) => {
    try {
        const { id, groupTitle , items } = req.body;

        const isValid = id && groupTitle;

        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Id and group title are required"
            })
        }

        const [ result ] = await db.query(`UPDATE travel_group_on_banners SET group_title = ? , items = ? WHERE id = ?` , [ groupTitle , items , id])
        
        if(result.affectedRows === 0) {
            return res.status(400).json({
                status : false,
                message : "Wrong  or invalid Id!"
            })
        }

        const [ rows ] = await db.query(`SELECT * FROM travel_group_on_banners WHERE id = ?` , [id]);

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

export const deleteTavelGroupOnBanners = async (req , res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({
                status : false,
                message : "Id is required"
            })
        }

        const [ result ] = await db.query(`DELETE FROM travel_group_on_banners WHERE id = ?` , [ id ]);

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