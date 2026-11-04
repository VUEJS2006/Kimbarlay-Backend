import db from "../../config/db.js";


export const getAllInsuranceFAQs = async (req , res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM insurance_faqs ORDER BY id ASC");

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

export const createInsuranceFAQs = async (req , res) => {
    try {
        const { question , answer } = req.body;

        if(!question) {
            return res.status(400).json({
                status : false,
                message : "Question is required"
            })
        }

        const [ result ] = await db.query(`INSERT INTO insurance_faqs (question , answer) VALUES ( ? , ? )` , [question , answer])
        const [ rows ] = await db.query(`SELECT * FROM insurance_faqs WHERE id = ?` , [result.insertId]);

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

export const updateInsuranceFAQs = async (req , res) => {
    try {
        const { id,  question , answer } = req.body;

        const isValid = id && question;

        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Id and question are required"
            })
        }

        const [ result ] = await db.query(`UPDATE insurance_faqs SET question = ? , answer = ? WHERE id = ?` , [question , answer , id])
        
        if(result.affectedRows === 0) {
            return res.status(400).json({
                status : false,
                message : "Wrong  or invalid Id!"
            })
        }

        const [ rows ] = await db.query(`SELECT * FROM insurance_faqs WHERE id = ?` , [id]);


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

export const deleteInsuranceFAQs = async (req , res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({
                status : false,
                message : "Id is required"
            })
        }

        const [ result ] = await db.query(`DELETE FROM insurance_faqs WHERE id = ?` , [ id ]);

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