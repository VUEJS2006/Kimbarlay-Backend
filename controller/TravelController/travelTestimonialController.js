import db from "../../config/db.js";
import { changeToImageFullUrl , deleteStoredImage, storeImageToDynamicFolder } from "../../utils/image.js";


export const getAllTavelTestimonials = async (req , res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM testimonials ORDER BY id ASC");

        const data = rows.map(item => (item.avatar_image_url && item.avatar_image_url.startsWith("images") ? {...item , avatar_image_url : changeToImageFullUrl(item.avatar_image_url)} : item ))

        res.status(200).json({
            status : true,
            message : "All items are here",
            data
        })

    } catch(err) {
        console.error(err);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}

export const createTavelTestimonials = async (req , res) => {
    try {
        const { customerName , destination , avatarImageUrl , rating  , reviewText } = req.body;
        const image = req.file;

        const isValid = customerName && destination && rating && reviewText;

        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Customer name, destination, rating and review text are required"
            })
        }

         if(!image && !avatarImageUrl) {
            return res.status(400).json({
                status : false,
                message : "Image file or avatarImageUrl is required"
            })
        }
        
        let url = avatarImageUrl;
        if(image) {
            url = await storeImageToDynamicFolder(image , "travel_testimonial");
        }

        const [ result ] = await db.query(`INSERT INTO testimonials ( customer_name, destination, avatar_image_url, rating, review_text ) VALUES ( ? , ? , ? , ? , ? )` , [ customerName , destination , url , rating  , reviewText ])
        const [ rows ] = await db.query(`SELECT * FROM testimonials WHERE id = ?` , [result.insertId]);

        return res.status(201).json({
            status : true,
            message : "Successfully created",
            data : image ? {...rows[0] , avatar_image_url : changeToImageFullUrl(rows[0].avatar_image_url)} : rows[0]
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
        const image = req.file;
  
        const isValid = id && customerName && destination && rating && reviewText;

        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Id, customer name, destination, rating and review text are required"
            })
        }

        if(!image && !avatarImageUrl) {
            return res.status(400).json({
                status : false,
                message : "One of Image file or avatarImageUrl is required"
            })
        }

        const [ exitRows ] = await db.query(`SELECT * FROM testimonials WHERE id = ?` , [id]);

        if(!exitRows || !exitRows.length) {
            return res.status(400).json({
                status : false,
                message : "Wrong  or invalid Id!"
            })
        }

        let url = avatarImageUrl;
        if(image) {
            url = await storeImageToDynamicFolder(image , "travel_testimonial");
        }

        await db.query(`UPDATE testimonials SET customer_name = ? , destination = ? , avatar_image_url = ? , rating = ? , review_text = ? WHERE id = ?` , [ customerName , destination , url, rating  , reviewText , id])
        
        await deleteStoredImage(exitRows[0].avatar_image_url)

        const [ rows ] = await db.query(`SELECT * FROM testimonials WHERE id = ?` , [id]);

        return res.status(200).json({
            status : true,
            message : "Successfully updated.",
            data :  rows[0].avatar_image_url && rows[0].avatar_image_url.startsWith("images") ? {...rows[0] , avatar_image_url : changeToImageFullUrl(rows[0].avatar_image_url)} : rows[0]
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