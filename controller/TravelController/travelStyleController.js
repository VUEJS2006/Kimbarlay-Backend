import db from "../../config/db.js";
import { changeToImageFullUrl, deleteStoredImage, storeImageToDynamicFolder } from "../../utils/image.js";


export const getAllTavelStyle = async (req , res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM travel_styles ORDER BY id ASC");

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

export const createTavelStyle = async (req , res) => {
    try {
        const { title , icon , image_url } = req.body;
        const image = req.file;

        if(!title) {
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
            url = await storeImageToDynamicFolder(image , "travel_styles");
        }

        const [ result ] = await db.query(`INSERT INTO travel_styles (  title , icon , image_url ) VALUES ( ? , ? , ? )` , [ title , icon , url ])
        const [ rows ] = await db.query(`SELECT * FROM travel_styles WHERE id = ?` , [result.insertId]);

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

export const updateTavelStyle = async (req , res) => {
    try {
        const { id , title , icon , image_url } = req.body;
        const image = req.file;

        const isValid = id && title;
        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Id and title are required"
            })
        } 

        if(!image && !image_url) {
            return res.status(400).json({
                status : false,
                message : "One of Image file or image_url are required"
            })
        }

        const [ exitRows ] = await db.query(`SELECT * FROM travel_styles WHERE id = ?` , [id]);

        if(!exitRows || !exitRows.length) {
            return res.status(400).json({
                status : false,
                message : "Wrong  or invalid Id!"
            })
        }

        let url = image_url;
        if(image) {
            url = await storeImageToDynamicFolder(image , "travel_styles");
        }

        await db.query(`UPDATE travel_styles SET title = ? , icon = ? , image_url = ? WHERE id = ?` , [ title , icon , url , id])

        await deleteStoredImage(exitRows[0].image_url)

        const [ rows ] = await db.query(`SELECT * FROM travel_styles WHERE id = ?` , [id]);

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

export const deleteTavelStyle = async (req , res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({
                status : false,
                message : "Id is required"
            })
        }

        const [ rows ] = await db.query(`SELECT * FROM travel_styles WHERE id = ?` , [id]);

        const [ result ] = await db.query(`DELETE FROM travel_styles WHERE id = ?` , [ id ]);

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