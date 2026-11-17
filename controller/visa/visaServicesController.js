import db from "../../config/db.js";


export const getAllVisaServices = async (req , res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM visa_services ORDER BY id ASC");

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

export const createVisaServices = async (req , res) => {
    try {
        const { title , description , icon , color } = req.body;

        const isValid = title && icon && color;
        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Title, icon and color are required"
            })
        }

        const [ result ] = await db.query(`INSERT INTO visa_services ( title , description , icon , color ) VALUES ( ? , ? , ? , ? )` , [title , description , icon , color])
        const [ rows ] = await db.query(`SELECT * FROM visa_services WHERE id = ?` , [result.insertId]);

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

export const updateVisaServices = async (req , res) => {
    try {
        const { id, title , description , icon , color } = req.body;

        const isValid = id && title && icon && color;

        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Id, title, icon and color are required"
            })
        }

        const [ result ] = await db.query(`UPDATE visa_services SET title = ? , description = ? , icon = ? , color = ? WHERE id = ?` , [title , description , icon , color , id])
        
        if(result.affectedRows === 0) {
            return res.status(400).json({
                status : false,
                message : "Wrong  or invalid Id!"
            })
        }

        const [ rows ] = await db.query(`SELECT * FROM visa_services WHERE id = ?` , [id]);


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

export const deleteVisaServices = async (req , res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({
                status : false,
                message : "Id is required"
            })
        }

        const [ result ] = await db.query(`DELETE FROM visa_services WHERE id = ?` , [ id ]);

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