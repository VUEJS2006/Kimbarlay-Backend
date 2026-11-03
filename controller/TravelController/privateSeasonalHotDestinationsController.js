import db from "../../config/db.js";
import { changeToImageFullUrl, deleteStoredImage, storeImageToDynamicFolder } from "../../utils/image.js";


export const getAllPrivateSeasonalHotDestinations = async (req , res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM private_seasonal_hot_destinations ORDER BY id ASC");

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

export const createPrivateSeasonalHotDestinations = async (req , res) => {
    try {
        const { title , duration  , price = 0 , description , image_url } = req.body;
        const image = req.file;

        const isValid = title;
        if(!isValid ) {
            return res.status(400).json({
                status : false,
                message : "Title is required"
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
            url = await storeImageToDynamicFolder(image , "private_seasonal_hot_destinations");
        }

        const [ result ] = await db.query(`INSERT INTO private_seasonal_hot_destinations ( title , duration , price , description , image_url ) VALUES ( ? , ? , ? , ? , ? )` , [ title , duration , price , description , url ])
        const [ rows ] = await db.query(`SELECT * FROM private_seasonal_hot_destinations WHERE id = ?` , [result.insertId]);

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

export const updatePrivateSeasonalHotDestinations = async (req , res) => {
    try {
        const { id , title , duration  , price = 0 , description , image_url } = req.body;
        const image = req.file;

        const isValid = id && title;
        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Id  and title are required"
            })
        }

        if(!image && !image_url) {
            return res.status(400).json({
                status : false,
                message : "One of Image file or image_url are required"
            })
        }

        const [ exitRows ] = await db.query(`SELECT * FROM private_seasonal_hot_destinations WHERE id = ?` , [id]);

        if(!exitRows || !exitRows.length) {
            return res.status(400).json({
                status : false,
                message : "Wrong  or invalid Id!"
            })
        }

        let url = image_url;
        if(image) {
            url = await storeImageToDynamicFolder(image , "private_seasonal_hot_destinations");
        }

        await db.query(`UPDATE private_seasonal_hot_destinations SET title = ? , duration = ? , price = ? , description = ? , image_url = ? WHERE id = ?` , [ title , duration , price , description , url , id])

        await deleteStoredImage(exitRows[0].image_url)

        const [ rows ] = await db.query(`SELECT * FROM private_seasonal_hot_destinations WHERE id = ?` , [id]);

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

export const deletePrivateSeasonalHotDestinations = async (req , res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({
                status : false,
                message : "Id is required"
            })
        }

        const [ rows ] = await db.query(`SELECT * FROM private_seasonal_hot_destinations WHERE id = ?` , [id]);

        const [ result ] = await db.query(`DELETE FROM private_seasonal_hot_destinations WHERE id = ?` , [ id ]);

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
