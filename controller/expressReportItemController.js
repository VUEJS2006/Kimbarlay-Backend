import { changeToImageFullUrl, deleteStoredImage, storeImageToDynamicFolder } from "../utils/image.js";
import db from "../config/db.js"

export const getAllExpressReportItem = async(req , res) => {
    try {
        const [ items ] = await db.execute('SELECT * FROM express_report_items ORDER BY id ASC');

        res.status(200).json({
            success : true , 
            data : items.map(item => ({...item , image_url : changeToImageFullUrl(item.image_url)}))
        })
    } catch(err) {
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

export const createExpressReportItem = async(req , res) => {
    try {
        const { category_id, image_url : url , from, to, price, date, discount } = req.body;

        if (!category_id || !from || !to) {
            return res.status(400).json({ 
                success: false, 
                error: 'category_id, from, and to are required' 
            });
        }

        const [ isExitCategory ] = await db.execute(
            'SELECT * FROM express_report_categories WHERE id = ?',
            [category_id]
        );

        if(!isExitCategory || !isExitCategory.length) return res.status(400).json({ success: false , message : 'Category related to category_id does not exit in database' });

        let image_url = url;
        const image = req.file;
        if(image) {
            image_url = await storeImageToDynamicFolder(image , "airfair_category_items" );
        }

        const query = `
            INSERT INTO express_report_items 
            (category_id, image_url, \`from\`, \`to\`, price, \`date\`, discount)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(query, [
            category_id,
            image_url || null,
            from,
            to,
            price || null,
            date || null,
            discount || null
        ]);

        const [rows] = await db.execute(
            'SELECT * FROM express_report_items WHERE id = ?', 
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: 'Item created successfully',
            data: {...rows[0] , image_url : changeToImageFullUrl(rows[0].image_url)}
        });

    } catch(err) {
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}


export const updateExpressReportItem = async(req , res) => {
    try {
        const { id , image_url : url , from, to, price, date, discount } = req.body;

        if (!id || !from || !to) {
            return res.status(400).json({ 
                success: false, 
                error: 'id, from, and to are required' 
            });
        }

        const [ isExitItem ] = await db.execute(
            'SELECT * FROM express_report_items WHERE id = ?',
            [id]
        );

        if(!isExitItem || !isExitItem.length) return res.status(400).json({ success: false , message : 'The item that you wnat to update does not exit in database' });

        if(isExitItem[0].image_url) {
            await deleteStoredImage(isExitItem[0].image_url)
        }
        

        let image_url = url;
        const image = req.file;
        if(image) {
            image_url = await storeImageToDynamicFolder(image , "airfair_category_items" );
        }

        const query = `
            UPDATE express_report_items 
            SET image_url = ?, \`from\` = ?, \`to\` = ?, price = ?, \`date\` = ?, discount = ?
            WHERE id = ?
        `;

        const [result] = await db.execute(query, [
            image_url || null,
            from,
            to,
            price || null,
            date || null,
            discount || null,
            id
        ]);

        const [rows] = await db.execute(
            'SELECT * FROM express_report_items WHERE id = ?', 
            [id]
        );

        res.status(200).json({
            success: true,
            message: 'Item updated successfully',
            data: {...rows[0] , image_url : changeToImageFullUrl(rows[0].image_url)}
        });

    } catch(err) {
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

export const deleteExpressReportItem = async(req , res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return req.status(400).json({
                success : false,
                message : "Id must exit"
            })
        }

        const [found] = await db.execute(
            'SELECT * FROM express_report_items WHERE id = ?',
            [id]
        );

        if(!found || !found.length) return res.status(400).json({ success: false , message : 'The item that you wnat to delete does not exit in database' });

        if(found[0].image_url) {
            await deleteStoredImage(found[0].image_url)
        }

        await db.execute('DELETE FROM express_report_items WHERE id = ?', [id]);

        res.status(200).json({
            success : true,
            message : "The item is successfully deleted."
        })

    } catch(err) {
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}