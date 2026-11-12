import db from "../../config/db.js";
import { changeToImageFullUrl, deleteStoredImage, storeImageToDynamicFolder } from "../../utils/image.js";
import fs from "fs";
import path from "path";

export const getTravelBannersUnity = async (req , res) => {
    try {
        const id = req.id;

        const [ rows ] = await db.query(`SELECT * FROM travel_banners_unity WHERE id = ?` , [id]);

        let data = {};
        if(rows[0]) {
            data ={ background_image_url : rows[0].background_image_url , title : rows[0].title , subtitle : rows[0].subtitle , created_at :  rows[0].created_at , updated_at : rows[0].updated_at }
            if(id === "insurance_banner") {
                data.tag = rows[0].tag;
            } else if(id === "private_customize_travel_banner") {
                data.badge = rows[0].tag;
            } else if(id === "visa_banner") {
                data.badge = rows[0].tag;
                data.highlighted_text = rows[0].highlighted_text;
            }
        }

        return res.status(200).json({
            status : true,
            message : id + " is here.",
            data : data.background_image_url && data.background_image_url.startsWith("images") ? {...data , background_image_url : changeToImageFullUrl(data.background_image_url)} : data
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
        const { background_image_url , title , subtitle , tag , badge , highlighted_text } = req.body;
        const image = req.file;
        const id = req.id;
        const finalTag = tag || badge;

        if(id === "visa_banner" && (!highlighted_text || !badge) ) {
            return res.status(400).json({
                status : false,
                message : "Highlighted text and badge are required"
            })
        }

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
        INSERT INTO travel_banners_unity (id, background_image_url, tag, title, subtitle , highlighted_text)
        VALUES ( ?, ? , ? , ? , ? , ?)
        ON DUPLICATE KEY UPDATE 
            background_image_url = VALUES(background_image_url),
            tag = VALUES(tag),
            title = VALUES(title),
            subtitle = VALUES(subtitle),
            highlighted_text = VALUES(highlighted_text);
        `;

        await db.query(query , [ id , url , finalTag , title , subtitle , highlighted_text ]);

        const [ rows ] = await db.query(`SELECT * FROM travel_banners_unity WHERE id = ?` , [id]);

        let data ={ background_image_url : rows[0].background_image_url , title : rows[0].title , subtitle : rows[0].subtitle , created_at :  rows[0].created_at , updated_at : rows[0].updated_at }
        if(id === "insurance_banner") {
            data.tag = rows[0].tag;
        } else if(id === "private_customize_travel_banner") {
            data.badge = rows[0].tag;
        } else if(id === "visa_banner") {
            data.badge = rows[0].tag;
            data.highlighted_text = rows[0].highlighted_text;
        }


        return res.status(200).json({
            status : true,
            message : "Successfully edited.",
            data : data.background_image_url && data.background_image_url.startsWith("images") ? {...data , background_image_url : changeToImageFullUrl(data.background_image_url)} : data
        })

    } catch(err) {
        console.error(err);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}
