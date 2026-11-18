import db from "../../config/db.js";


export const getAllBusLines = async (req , res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM bus_lines ORDER BY id ASC");

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

export const createBusLine = async (req , res) => {
    try {
        const { title , subtitle , icon } = req.body;

        const isValid = title;
        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Title is required"
            })
        }

        const [ result ] = await db.query(`INSERT INTO bus_lines ( title , subtitle , icon) VALUES ( ? , ? , ? )` , [title , subtitle , icon])
        const [ rows ] = await db.query(`SELECT * FROM bus_lines WHERE id = ?` , [result.insertId]);

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

export const updateBusLine = async (req , res) => {
    try {
        const { id, title , subtitle , icon } = req.body;

        const isValid = id && title;

        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Id and title are required"
            })
        }

        const [ result ] = await db.query(`UPDATE bus_lines SET title = ? , subtitle = ? , icon = ? WHERE id = ?` , [title , subtitle , icon , id])
        
        if(result.affectedRows === 0) {
            return res.status(400).json({
                status : false,
                message : "Wrong  or invalid Id!"
            })
        }

        const [ rows ] = await db.query(`SELECT * FROM bus_lines WHERE id = ?` , [id]);


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

export const deleteBusLine = async (req , res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({
                status : false,
                message : "Id is required"
            })
        }

        const [ result ] = await db.query(`DELETE FROM bus_lines WHERE id = ?` , [ id ]);

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