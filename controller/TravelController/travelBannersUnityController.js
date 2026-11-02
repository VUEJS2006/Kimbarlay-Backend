import db from "../../config/db.js";
import { changeToImageFullUrl, deleteStoredImage, storeImageToDynamicFolder } from "../../utils/image.js";
import fs from "fs";
import path from "path";

export const getAllTavelBannerImage = async (req , res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM travel_banner_images ORDER BY id ASC");

        const data = rows.map(item => (item.travel_banner_image_url && item.travel_banner_image_url.startsWith("images") ? {...item , travel_banner_image_url : changeToImageFullUrl(item.travel_banner_image_url)} : item ))

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


export const updateTravelBannersUnity = async (req , res) => {
    try {
        const { background_image_url , title , subtitle , tag , badge } = req.body;
        const image = req.file;
        const id = req.id;
        const finalTag = tag && badge;

        if(!image && !background_image_url) {
            return res.status(400).json({
                status : false,
                message : "One of Image file or background_image_url are required"
            })
        }

        const isValid = title && subtitle;
        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Title and subtitle are required"
            })
        }

        const folder = path.join(
            process.cwd(),
            "images",
            id
        )

        if(fs.existsSync(folder)) {
            fs.rmSync(folder , { recursive : true , force : true })
        }

        let url = background_image_url;
        if(image) {
            url = await storeImageToDynamicFolder(image , id);
        }

        const query = `
        INSERT INTO travel_banners_unity (id, background_image_url, tag, title, subtitle)
        VALUES ( ?, ? , ? , ? , ? )
        ON DUPLICATE KEY UPDATE 
            background_image_url = VALUES(background_image_url),
            tag = VALUES(tag),
            title = VALUES(title),
            subtitle = VALUES(subtitle);
        `;

        await db.query(query , [ id , url , finalTag , title , subtitle ]);

        const [ rows ] = await db.query(`SELECT * FROM travel_banner_images WHERE id = ?` , [id]);

        return res.status(200).json({
            status : true,
            message : "Successfully edited.",
            data : rows[0].background_image_url && rows[0].background_image_url.startsWith("images") ? {...rows[0] , background_image_url : changeToImageFullUrl(rows[0].background_image_url)} : rows[0]
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