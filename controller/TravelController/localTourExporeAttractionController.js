import db from "../../config/db.js";
import { changeToImageFullUrl, deleteStoredImage, storeImageToDynamicFolder } from "../../utils/image.js";


export const getAllLocalExploreAttractions = async (req , res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM travel_local_explore_attractions ORDER BY id ASC");

        const data = rows.map(item => (item.image_url && item.image_url.startsWith("images") ? {...item , image_url : changeToImageFullUrl(item.image_url)} : item ))

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

export const createLocalExploreAttractions = async (req , res) => {
    try {
        const { title , description , price = 0 , rating , image_url } = req.body;
        const image = req.file;

        const isValid = title && rating;
        if(!isValid ) {
            return res.status(400).json({
                status : false,
                message : "Title and rating is required"
            })
        }

        if(rating > 5 || rating < 1) {
            return res.status(400).json({
                status : false,
                message : "Rating must be between 1 and 5!"
            })
        }

        if(!image && !image_url) {
            return res.status(400).json({
                status : false,
                message : "Image file or image_url is required"
            })
        }

        let url = image_url;
        if(image) {
            url = await storeImageToDynamicFolder(image , "local_explore_attractions");
        }

        const [ result ] = await db.query(`INSERT INTO travel_local_explore_attractions (  title , description , price , rating , image_url ) VALUES ( ? , ? , ? , ? , ? )` , [ title , description , price , rating , url ])
        const [ rows ] = await db.query(`SELECT * FROM travel_local_explore_attractions WHERE id = ?` , [result.insertId]);

        res.status(201).json({
            status : true,
            message : "Successfully created",
            data : image ? {...rows[0] , image_url : changeToImageFullUrl(rows[0].image_url)} : rows[0]
        })

    } catch(err) {
        console.error(err);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}

export const updateLocalExploreAttractions = async (req , res) => {
    try {
        const { id , title , description , price = 0 , rating , image_url } = req.body;
        const image = req.file;

        const isValid = id && title && rating;
        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Id, title and rating are required"
            })
        } 

        if(rating > 5 || rating < 1) {
            return res.status(400).json({
                status : false,
                message : "Rating must be between 1 and 5!"
            })
        }

        if(!image && !image_url) {
            return res.status(400).json({
                status : false,
                message : "One of Image file or image_url are required"
            })
        }

        const [ exitRows ] = await db.query(`SELECT * FROM travel_local_explore_attractions WHERE id = ?` , [id]);

        if(!exitRows || !exitRows.length) {
            return res.status(400).json({
                status : false,
                message : "Wrong  or invalid Id!"
            })
        }

        let url = image_url;
        if(image) {
            url = await storeImageToDynamicFolder(image , "local_explore_attractions");
        }

        await db.query(`UPDATE travel_local_explore_attractions SET title = ? , description = ? , price = ? , rating = ? , image_url = ? WHERE id = ?` , [ title , description , price , rating , url , id])

        await deleteStoredImage(exitRows[0].image_url)

        const [ rows ] = await db.query(`SELECT * FROM travel_local_explore_attractions WHERE id = ?` , [id]);

        return res.status(200).json({
            status : true,
            message : "Successfully updated.",
            data : rows[0].image_url && rows[0].image_url.startsWith("images") ? {...rows[0] , image_url : changeToImageFullUrl(rows[0].image_url)} : rows[0]
        })

    } catch(err) {
        console.error(err);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}

export const deleteLocalExploreAttractions = async (req , res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({
                status : false,
                message : "Id is required"
            })
        }

        const [ rows ] = await db.query(`SELECT * FROM travel_local_explore_attractions WHERE id = ?` , [id]);

        const [ result ] = await db.query(`DELETE FROM travel_local_explore_attractions WHERE id = ?` , [ id ]);

        if(result.affectedRows === 0) {
            return res.status(400).json({
                status : false,
                message : "Wrong or invalid id!"
            })
        }

        await deleteStoredImage(rows[0].image_url)

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
