import db from "../../config/db.js";


export const getAllInsuranceFourSteps = async (req , res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM insurance_four_steps ORDER BY id ASC");

        res.status(200).json({
            status : true,
            message : "All steps are here",
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

const allowedIds = [ 1, 2, 3 , 4 ]

export const updateAllInsuranceFourSteps = async (req , res) => {
    try {
        const steps = req.body;
        if (!Array.isArray(steps) || steps.length !== 4) {
            return res.status(400).json({
                success: false,
                message: `Request body must be an array containing exactly 4 steps.`
            });
        }
        
        for (const step of steps) {

            if (!allowedIds.includes(step.id)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid Step ID: '${step.id}'. ID must be only from 1 to 4.`
                });
            }

            const isValid = step.title && step.description;
            if (!isValid) {
                return res.status(400).json({
                    success: false,
                    message: `Title and description are required for step '${step.id}'.`
                });
            }
        }

        const submittedIds = steps.map(c => c.id);
        const hasAllCards = allowedIds.every(id => submittedIds.includes(id));
        
        if (!hasAllCards) {
            return res.status(400).json({
                success: false,
                message: `You must provide all steps : ${allowedIds.join(" , ")}.`
            });
        }

       const values = steps.map(step => [step.id , step.title , step.description ]);

        const query = `
        INSERT INTO insurance_four_steps (id, title, description)
        VALUES ?
        ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            description = VALUES(description),
            updated_at = CURRENT_TIMESTAMP;
        `;

        await db.query(query, [values]);

        const [rows] = await db.execute("SELECT * FROM insurance_four_steps ORDER BY id ASC");


        res.status(200).json({
            status : true,
            message : "After updated, all steps are here",
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