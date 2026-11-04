import db from "../../config/db.js";
import { changeToImageFullUrl, deleteStoredImage, storeImageToDynamicFolder } from "../../utils/image.js";


export const getAllInsurancePartners = async (req , res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM insurance_partners ORDER BY id ASC");

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

export const createInsurancePartners = async (req , res) => {
    try {
        const { name , image_url } = req.body;
        const image = req.file;

        if(!name) {
            return res.status(400).json({
                status : false,
                message : "name is required"
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
            url = await storeImageToDynamicFolder(image , "insurance_partners");
        }

        const [ result ] = await db.query(`INSERT INTO insurance_partners (  name , image_url ) VALUES ( ? , ? )` , [ name , url ])
        const [ rows ] = await db.query(`SELECT * FROM insurance_partners WHERE id = ?` , [result.insertId]);

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

export const updateInsurancePartners = async (req , res) => {
    try {
        const { id , name , image_url } = req.body;
        const image = req.file;

        const isValid = id && name;
        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Id and name are required"
            })
        } 

        if(!image && !image_url) {
            return res.status(400).json({
                status : false,
                message : "One of Image file or image_url are required"
            })
        }

        const [ exitRows ] = await db.query(`SELECT * FROM insurance_partners WHERE id = ?` , [id]);

        if(!exitRows || !exitRows.length) {
            return res.status(400).json({
                status : false,
                message : "Wrong  or invalid Id!"
            })
        }

        let url = image_url;
        if(image) {
            url = await storeImageToDynamicFolder(image , "insurance_partners");
        }

        await db.query(`UPDATE insurance_partners SET name = ? , image_url = ? WHERE id = ?` , [ name , url , id])

        await deleteStoredImage(exitRows[0].image_url)

        const [ rows ] = await db.query(`SELECT * FROM insurance_partners WHERE id = ?` , [id]);

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

export const deleteInsurancePartners = async (req , res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({
                status : false,
                message : "Id is required"
            })
        }

        const [ rows ] = await db.query(`SELECT * FROM insurance_partners WHERE id = ?` , [id]);

        const [ result ] = await db.query(`DELETE FROM insurance_partners WHERE id = ?` , [ id ]);

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