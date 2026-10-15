import { changeToImageFullUrl, storeImageToDynamicFolder } from "../utils/image.js";
import fs from "fs";
import path from "path";
import db from "../config/db.js";

export const getBanner = async(req , res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM banners WHERE id = 1');

        res.status(200).json({
            success : true,
            data : rows[0]
        })

    } catch(err) {
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

export const bannerUpdate = async(req , res) => {
    try {
        const { title , subtitle1 = null , subtitle2 = null , image_url : url } = req.body;
        const image = req.file;

        if(!title || (!url && !image)) return res.status(400).json({
            success : false,
            message : "title and one of the image or image_url must exit."
        })

        const subFolder = "banner";

        const folderName = path.join(
            process.cwd(),
            "images",
            subFolder
        )

        if(fs.existsSync(folderName)) {
            fs.rmSync(folderName , { recursive : true , force : true })
        }

        let image_url = url;

        if(image) {
            image_url = changeToImageFullUrl(await storeImageToDynamicFolder(image , subFolder));
        }

        // saved in database
        const query = `
            INSERT INTO banners (id, title, subtitle1, subtitle2, image_url)
            VALUES (1, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                title = VALUES(title),
                subtitle1 = VALUES(subtitle1),
                subtitle2 = VALUES(subtitle2),
                image_url = VALUES(image_url);
        `;
        await db.execute(query , [title, subtitle1, subtitle2, image_url]);

        const [rows] = await db.execute('SELECT * FROM banners WHERE id = 1');

        res.status(201).json({
            success : true,
            message : "Oversea hotel banner is successfully updated.",
            data : rows[0]
        })

    } catch(err) {
        res.status(500).json({
            success : false,
            message : err.message
        })
    }

}


export const getOverseaHotelBanner = async(req , res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM banners WHERE id = 2');

        const modifiedRows = rows.map(item => ({ title : item.title , subtitle : item.subtitle1 , image_url : item.image_url , updated_at : item.updated_at }))

        res.status(200).json({
            success : true,
            data : modifiedRows[0]
        })

    } catch(err) {
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

export const overSeaBannerUpdate = async(req , res) => {
    try {
        const { title , subtitle = null , image_url : url } = req.body;
        const image = req.file;
        const subtitle1 = subtitle;

        if(!title || (!url && !image)) return res.status(400).json({
            success : false,
            message : "title and one of the image or image_url must exit."
        })

        const subFolder = "oversea_banner";

        const folderName = path.join(
            process.cwd(),
            "images",
            subFolder
        )

        if(fs.existsSync(folderName)) {
            fs.rmSync(folderName , { recursive : true , force : true })
        }

        let image_url = url;

        if(image) {
            image_url = changeToImageFullUrl(await storeImageToDynamicFolder(image , subFolder));
        }

        // saved in database
        const query = `
            INSERT INTO banners (id, title, subtitle1, subtitle2, image_url)
            VALUES (2, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                title = VALUES(title),
                subtitle1 = VALUES(subtitle1),
                subtitle2 = VALUES(subtitle2),
                image_url = VALUES(image_url);
        `;
        await db.execute(query , [title, subtitle1, null, image_url]);

        const [rows] = await db.execute('SELECT * FROM banners WHERE id = 2');

        const modifiedRows = rows.map(item => ({ title : item.title , subtitle : item.subtitle1 , image_url : item.image_url , updated_at : item.updated_at }))

        res.status(201).json({
            success : true,
            message : "Oversea hotel banner is successfully updated.",
            data : modifiedRows[0]
        })

    } catch(err) {
        res.status(500).json({
            success : false,
            message : err.message
        })
    }

}