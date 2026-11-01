import db from "../../config/db.js";
import { changeToImageFullUrl, deleteStoredImage, storeImageToDynamicFolder } from "../../utils/image.js";


const tourismTourPackageCategories = [ 'Domestic', 'Local', 'Overseas' ]

export const getAllTourismTourPackages = async (req , res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM tourism_tour_package ORDER BY id ASC");

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

export const createTourismTourPackages = async (req , res) => {
    try {
        const { package_name , category , price , old_price  , rating , discount_tag , description , image_url } = req.body;
        const image = req.file;

        const isValid = package_name && category && price && rating && description;

        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Package_name , category , price , rating and description are required"
            })
        }

        if(!tourismTourPackageCategories.includes(category)) {
            return res.status(400).json({
                status : false,
                message : "Category must exactly be one of " + tourismTourPackageCategories.join(", ")
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
            url = await storeImageToDynamicFolder(image , "tourism_tour_package");
        }

        const [ result ] = await db.query(`INSERT INTO tourism_tour_package ( package_name , category , price , old_price  , rating , discount_tag , description , image_url ) VALUES ( ? , ? , ? , ? , ? , ? , ? , ? )` , [ package_name , category , price , old_price  , rating , discount_tag , description , url ])
        const [ rows ] = await db.query(`SELECT * FROM tourism_tour_package WHERE id = ?` , [result.insertId]);

        return res.status(201).json({
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

export const updateTourismTourPackages = async (req , res) => {
    try {
        const { id , package_name , price , old_price  , rating , discount_tag , description , image_url } = req.body;
        const image = req.file;

        const isValid = id && package_name && price && rating && description;

        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Id , package_name , price , rating and description are required"
            })
        }

        if(!image && !image_url) {
            return res.status(400).json({
                status : false,
                message : "Image file or image_url is required"
            })
        }

        const [ exitRows ] = await db.query(`SELECT * FROM tourism_tour_package WHERE id = ?` , [id]);

        if(!exitRows || !exitRows.length) {
            return res.status(400).json({
                status : false,
                message : "Wrong  or invalid Id!"
            })
        }

        let url = image_url;
        if(image) {
            url = await storeImageToDynamicFolder(image , "travel_testimonial");
        }

        await db.query(`UPDATE tourism_tour_package SET package_name = ? , price = ? , old_price  = ? , rating = ? , discount_tag = ? , description = ? , image_url = ? WHERE id = ?` , [ package_name , price , old_price  , rating , discount_tag , description , url , id])
        
        await deleteStoredImage(exitRows[0].image_url)

        const [ rows ] = await db.query(`SELECT * FROM tourism_tour_package WHERE id = ?` , [id]);

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

export const deleteTavelTourismTourPackages = async (req , res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({
                status : false,
                message : "Id is required"
            })
        }

        const [ result ] = await db.query(`DELETE FROM tourism_tour_package WHERE id = ?` , [ id ]);

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