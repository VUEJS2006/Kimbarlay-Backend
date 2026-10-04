import db from "../config/db.js"

export const getFaqs = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM faqs ORDER BY id DESC");

        return res.status(200).json({
            status: true,
            message: "FAQs fetched successfully.",
            body: rows.map(item => ({...item , is_active : (item.is_active === 1) }))
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    }
};

export const createFaqs = async(req , res) => {
    try {
        const { question, answer, is_active } = req.body;

        if (!question || !answer) {
            return res.status(400).json({
                status: false,
                message: "question and answer are required"
            });
        }
        const activeStatus = is_active !== undefined ? Boolean(is_active) : true;

        const query = `
            INSERT INTO faqs (question, answer, is_active) 
            VALUES (?, ?, ?)
        `;

        const [result] = await db.execute(query, [question, answer, activeStatus]);
        const [rows] = await db.execute("SELECT * FROM faqs WHERE id = ?", [result.insertId]);

        return res.status(201).json({
            status: true,
            message: "FAQ created successfully",
            body: {...rows[0] , is_active : (rows[0].is_active === 1)}
        });

    } catch(err) {
        res.status(500).json({
            status : false,
            message : err.message
        })
    }
}



export const updateFaqs = async(req , res) => {
    try {
        const { id, question , answer, is_active } = req.body;

        if (!id || !question || !answer) {
            return res.status(400).json({
                status: false,
                message: "id, question, and answer are required"
            });
        }

        const activeStatus = is_active !== undefined ? Boolean(is_active) : true;

        const query = `
            UPDATE faqs SET 
                question = ?, 
                answer = ?, 
                is_active = ? 
            WHERE id = ?
        `;

        const [result] = await db.execute(query, [question, answer, activeStatus, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: false,
                message: "FAQ not found"
            });
        }

        const [rows] = await db.execute("SELECT * FROM faqs WHERE id = ?", [id]);

        return res.status(200).json({
            status: true,
            message: "FAQ updated successfully",
            body: {...rows[0] , is_active : (rows[0].is_active === 1)}
        });

    } catch(err) {
        res.status(500).json({
            status : false,
            message : err.message
        })
    }
}


export const deleteFaq = async (req, res) => {
    try {
        const { id } = req.params;

        const query = `DELETE FROM faqs WHERE id = ?`;
        const [result] = await db.execute(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: false,
                message: "FAQ not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "FAQ deleted successfully"
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    }
};