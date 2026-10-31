import db from "../../config/db.js";


export const getAllTavelTestimonials = async (req , res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM testimonials ORDER BY id ASC");

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

export const createTourismTourPackages = async (req , res) => {
    try {
        const { package_name , category , price , old_price  , rating , discount_tag , description , image_url } = req.body;
// here
        const isValid = customerName && destination && avatarImageUrl && rating && reviewText;

        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Customer name, destination, avatar image url, rating and review text are required"
            })
        }

        const [ result ] = await db.query(`INSERT INTO testimonials ( customer_name, destination, avatar_image_url, rating, review_text ) VALUES ( ? , ? , ? , ? , ? )` , [ customerName , destination , avatarImageUrl , rating  , reviewText ])
        const [ rows ] = await db.query(`SELECT * FROM testimonials WHERE id = ?` , [result.insertId]);

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

export const updateTavelTestimonials = async (req , res) => {
    try {
        const { id, customerName , destination , avatarImageUrl , rating  , reviewText } = req.body;

        const isValid = id && customerName && destination && avatarImageUrl && rating && reviewText;

        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Id, customer name, destination, avatar image url, rating and review text are required"
            })
        }

        const [ result ] = await db.query(`UPDATE testimonials SET customer_name = ? , destination = ? , avatar_image_url = ? , rating = ? , review_text = ? WHERE id = ?` , [ customerName , destination , avatarImageUrl , rating  , reviewText , id])
        
        if(result.affectedRows === 0) {
            return res.status(400).json({
                status : false,
                message : "Wrong  or invalid Id!"
            })
        }

        const [ rows ] = await db.query(`SELECT * FROM testimonials WHERE id = ?` , [id]);

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

export const deleteTavelTestimonials = async (req , res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({
                status : false,
                message : "Id is required"
            })
        }

        const [ result ] = await db.query(`DELETE FROM testimonials WHERE id = ?` , [ id ]);

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