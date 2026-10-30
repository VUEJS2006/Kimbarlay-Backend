import db from "../../config/db.js";
import { changeToImageFullUrl, deleteStoredImage, storeImageToDynamicFolder } from "../../utils/image.js";


export const getAllTavelBannerImage = async (req , res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM travel_banner_images ORDER BY id ASC");

        const data = rows.map(item => (item.travel_banner_image_url.startsWith("images") ? {...item , travel_banner_image_url : changeToImageFullUrl(item.travel_banner_image_url)} : item ))

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

export const createTavelBannerImage = async (req , res) => {
    try {
        const { image_url } = req.body;
        const image = req.file;

        if(!image && !image_url) {
            return res.status(400).json({
                status : false,
                message : "Image file or image_url is required"
            })
        }

        let url = image_url;
        if(image) {
            url = await storeImageToDynamicFolder(image , "travel_banner");
        }

        const [ result ] = await db.query(`INSERT INTO travel_banner_images ( travel_banner_image_url ) VALUES ( ? )` , [ url ])
        const [ rows ] = await db.query(`SELECT * FROM travel_banner_images WHERE id = ?` , [result.insertId]);

        res.status(201).json({
            status : true,
            message : "Successfully created",
            data : image ? {...rows[0] , travel_banner_image_url : changeToImageFullUrl(rows[0].travel_banner_image_url)} : rows[0]
        })

    } catch(err) {
        console.error(err);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}

export const updateTavelBannerImage = async (req , res) => {
    try {
        const { id , image_url } = req.body;
        const image = req.file;

        if(!id || (!image && !image_url)) {
            return res.status(400).json({
                status : false,
                message : "Id and one of Image file or image_url are required"
            })
        }

        const [ exitRows ] = await db.query(`SELECT * FROM travel_banner_images WHERE id = ?` , [id]);

        if(!exitRows || !exitRows.length) {
            return res.status(400).json({
                status : false,
                message : "Wrong  or invalid Id!"
            })
        }

        let url = image_url;
        if(image) {
            url = await storeImageToDynamicFolder(image , "travel_banner");
        }

        await db.query(`UPDATE travel_banner_images SET travel_banner_image_url = ? WHERE id = ?` , [ url , id])

        await deleteStoredImage(exitRows[0].travel_banner_image_url)

        const [ rows ] = await db.query(`SELECT * FROM travel_banner_images WHERE id = ?` , [id]);

        return res.status(200).json({
            status : true,
            message : "Successfully udated.",
            data : rows[0].travel_banner_image_url.startsWith("images") ? {...rows[0] , travel_banner_image_url : changeToImageFullUrl(rows[0].travel_banner_image_url)} : rows[0]
        })

    } catch(err) {
        console.error(err);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}

export const deleteTavelBannerImage = async (req , res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({
                status : false,
                message : "Id is required"
            })
        }

        const [ rows ] = await db.query(`SELECT * FROM travel_banner_images WHERE id = ?` , [id]);

        const [ result ] = await db.query(`DELETE FROM travel_banner_images WHERE id = ?` , [ id ]);

        if(result.affectedRows === 0) {
            return res.status(400).json({
                status : false,
                message : "Wrong or invalid id!"
            })
        }

        await deleteStoredImage(rows[0].travel_banner_image_url)

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