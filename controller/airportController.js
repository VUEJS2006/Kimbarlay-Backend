import db from "../config/db.js";
import { changeToImageFullUrl, deleteStoredImage, storeImageToDynamicFolder } from "../utils/image.js";

const allowedTypes = ['domestic', 'international'];

export const getAirport = async(req , res) => {
    try {
        const query = `SELECT * FROM airports ORDER BY id DESC`;
        const [rows] = await db.execute(query);

        const data = rows.map(item => ({...item , image_url : changeToImageFullUrl(item.image_url) }))

        return res.status(200).json({
            success: true,
            total: rows.length,
            data
        });
    } catch(error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}

export const createAirport = async(req , res) => {
    try {
        const {code, type, name, city, country, note } = req.body;

        const isValid = code && allowedTypes.includes(type) && name;
        if(!isValid) return res.status(400).json({
            success : false,
            message : "code and name must exit ,and type must be domestic or international!"
        })

        const image_url = await storeImageToDynamicFolder(req.file , "airport");

        const query = `
            INSERT INTO airports (code, type, name, city, country, note, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(query, [
            code,
            type,
            name,
            city || null,
            country || null,
            note || null,
            image_url || null
        ]);

        const [rows] = await db.execute('SELECT * FROM airports WHERE id = ?', [result.insertId]);

        res.status(201).json({
            success : true,
            message: 'Airport created successfully',
            data: {...rows[0] , image_url : changeToImageFullUrl(rows[0].image_url)}
        });
    } catch(error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}

export const updateAirport = async(req , res) => {
    try {
        const {id, code, type, name, city, country, note } = req.body;

        const isValid = id && code && allowedTypes.includes(type) && name;
        if(!isValid) return res.status(400).json({
            success : false,
            message : "id, code and name must exit ,and type must be domestic or international!"
        })

        const [existing] = await db.execute('SELECT * FROM airports WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Airport not found."
            });
        }

        let image_url = existing[0].image_url;
        if (req.file) {
            if(existing[0].image_url) {
                await deleteStoredImage(existing[0].image_url)
            }
            image_url = await storeImageToDynamicFolder(req.file, "airport");
        }

        const updateQuery = `
            UPDATE airports 
            SET code = ?, type = ?, name = ?, city = ?, country = ?, note = ?, image_url = ?
            WHERE id = ?
        `;

        await db.execute(updateQuery, [
            code,
            type,
            name,
            city || null,
            country || null,
            note || null,
            image_url,
            id
        ]);

        const [updatedRow] = await db.execute('SELECT * FROM airports WHERE id = ?', [id]);
        
        res.status(201).json({
            success : true,
            message: 'Airport updated successfully',
            data: {...updatedRow[0] , image_url : changeToImageFullUrl(updatedRow[0].image_url)}
        });
    } catch(error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}

export const deleteAirport = async(req , res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Airport ID is required."
            });
        }

        const [existing] = await db.execute('SELECT * FROM airports WHERE id = ?', [id]);
        if (!existing || existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Airport not found."
            });
        }

        await db.execute('DELETE FROM airports WHERE id = ?', [id]);

        if(existing[0].image_url) {
            await deleteStoredImage(existing[0].image_url)
        }

        return res.status(200).json({
            success: true,
            message: "Airport , related routes and related flights are deleted successfully",
        });

    } catch(error) {
        res.status(500).json({
            success : false,
            message : error.message
        });
    }
}
