import { changeToImageFullUrl, deleteManyStoredImages, deleteStoredImage, storeImageToDynamicFolder } from "../utils/image.js";
import db from "../config/db.js"

export const getExpressReportCategories = async(req , res) => {
    try {
        const [categories] = await db.execute('SELECT * FROM express_report_categories ORDER BY id ASC');
        
        res.status(201).json({
            success : true,
            data :  categories.map(item => ({...item , icon_url : changeToImageFullUrl(item.icon_url)}))
        })
    } catch(err) {
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

export const createExpressReportCategory = async(req , res) => {
    try {

        const { title, color, icon_url : url } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message : 'Title is required' });
        }

        let icon_url = url;
        const icon = req.file;
        if(icon) {
            icon_url = await storeImageToDynamicFolder(icon , "airfair_category" );
        }


        const query = `
            INSERT INTO express_report_categories (title, color, icon_url)
            VALUES (?, ?, ?)
        `;
        
        const [result] = await db.execute(query, [
            title,
            color || '#22BCB0',
            icon_url || null
        ]);

        const [rows] = await db.execute(
            'SELECT * FROM express_report_categories WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success : true,
            message : "New Category is successfully created.",
            data : {...rows[0] , icon_url : changeToImageFullUrl(rows[0].icon_url) }
        })

    } catch(err) {
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

export const updateExpressReportCategory = async(req , res) => {
    try {

        const { id , title, color, icon_url : url } = req.body;

        if (!title || !id) {
            return res.status(400).json({ success: false, message : 'Id and Title are required' });
        }

        const [found] = await db.execute(
            'SELECT * FROM express_report_categories WHERE id = ?',
            [id]
        );

        if(!found || !found.length) return res.status(400).json({ success: false , message : 'Category does not exit in database' });

        if(found[0].icon_url) {
            await deleteStoredImage(found[0].icon_url)
        }

        let icon_url = url;
        const icon = req.file;
        if(icon) {
            icon_url = await storeImageToDynamicFolder(icon , "airfair_category" );
        }


        const query = `
            UPDATE express_report_categories 
            SET title = ?, color = ?, icon_url = ?
            WHERE id = ?
        `;
        
        await db.execute(query, [
            title,
            color || '#22BCB0',
            icon_url || null,
            id
        ]);

        const [rows] = await db.execute(
            'SELECT * FROM express_report_categories WHERE id = ?',
            [id]
        );

        res.status(201).json({
            success : true,
            message : "Category is successfully updated.",
            data : {...rows[0] , icon_url : changeToImageFullUrl(rows[0].icon_url) }
        })

    } catch(err) {
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

export const deleteExpressReportCategory = async(req , res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return req.status(400).json({
                success : false,
                message : "Id must exit"
            })
        }

        const [found] = await db.execute(
            'SELECT * FROM express_report_categories WHERE id = ?',
            [id]
        );

        if(!found || !found.length) return res.status(400).json({ success: false , message : 'Category does not exit in database' });

        const [rows] = await db.execute(
            'SELECT * FROM express_report_items WHERE category_id = ? ORDER BY id ASC',
            [id]
        );

        if(rows && rows.length) {
            await deleteManyStoredImages(rows.map(item => item.image_url))
        }

        if(found[0].icon_url) {
            await deleteStoredImage(found[0].icon_url)
        }

        await db.execute('DELETE FROM express_report_categories WHERE id = ?', [id]);

        res.status(200).json({
            success : true,
            message : "Category is successfully deleted."
        })

    } catch(err) {
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}