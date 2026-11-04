import db from "../../config/db.js";


export const getAllInsuranceCoverageFeatures = async (req , res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM insurance_coverage_features ORDER BY id ASC");

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

export const createInsuranceCoverageFeatures = async (req , res) => {
    try {
        const { title , description , icon } = req.body;

        if(!title) {
            return res.status(400).json({
                status : false,
                message : "Title is required"
            })
        }

        const [ result ] = await db.query(`INSERT INTO insurance_coverage_features (title, description, icon) VALUES ( ? , ? , ? )` , [title , description , icon])
        const [ rows ] = await db.query(`SELECT * FROM insurance_coverage_features WHERE id = ?` , [result.insertId]);

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

export const updateInsuranceCoverageFeatures = async (req , res) => {
    try {
        const { id, title , description , icon } = req.body;

        const isValid = id && title;

        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Id and title are required"
            })
        }

        const [ result ] = await db.query(`UPDATE insurance_coverage_features SET title = ? , description = ? , icon = ? WHERE id = ?` , [title , description , icon , id])
        
        if(result.affectedRows === 0) {
            return res.status(400).json({
                status : false,
                message : "Wrong  or invalid Id!"
            })
        }

        const [ rows ] = await db.query(`SELECT * FROM insurance_coverage_features WHERE id = ?` , [id]);


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

export const deleteInsuranceCoverageFeatures = async (req , res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({
                status : false,
                message : "Id is required"
            })
        }

        const [ result ] = await db.query(`DELETE FROM insurance_coverage_features WHERE id = ?` , [ id ]);

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