import db from "../config/db.js";
import { changeToImageFullUrl, deleteStoredImage, storeImageToDynamicFolder } from "../utils/image.js";

const allowedTypes = ['domestic', 'international'];
const allowedStatus = ['active', 'inactive'];

export const getAirlines = async (req, res) => {
    try {
        const query = `SELECT * FROM airlines ORDER BY id DESC`;
        const [rows] = await db.execute(query);

        return res.status(200).json({
            success: true,
            total: rows.length,
            data: rows
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const createAirline = async (req, res) => {
    try {
        const { code, name, country, type, status, brand_color } = req.body;

        const isValid = code && allowedTypes.includes(type) && name && allowedStatus.includes(status);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: "code and name must exit. type must be 'domestic' or 'international' and status must be 'active', 'inactive'!"
            });
        }

        const logo_url = await storeImageToDynamicFolder(req.file, "airline");

        const query = `
            INSERT INTO airlines (code, name, country, type, status, brand_color, logo_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(query, [
            code,
            name,
            country || null,
            type,
            status,
            brand_color || null,
            logo_url
        ]);

        const [createdRow] = await db.execute('SELECT * FROM airlines WHERE id = ?', [result.insertId]);

        return res.status(201).json({
            success: true,
            message: "Airline created successfully",
            data: {...createdRow[0] , logo_url : changeToImageFullUrl(createdRow[0].logo_url)}
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const updateAirline = async (req, res) => {
    try {
        const { id, code, name, country, type, status, brand_color } = req.body;

        const isValid = id && code && allowedTypes.includes(type) && name && allowedStatus.includes(status);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: "id, code and name must exit. type must be 'domestic' or 'international' and status must be 'active', 'inactive'!"
            });
        }

        const [existing] = await db.execute('SELECT * FROM airlines WHERE id = ?', [id]);
        if (!existing || existing.length === 0) {
            return res.status(404).json({ success: false, message: "Airline not found." });
        }

        let logo_url = existing[0].logo_url;
        if (req.file) {
            if(existing[0].logo_url) {
                await deleteStoredImage(existing[0].logo_url)
            }
            logo_url = await storeImageToDynamicFolder(req.file, "airline");
        }

        const updateQuery = `
            UPDATE airlines 
            SET code = ?, name = ?, country = ?, type = ?, status = ?, brand_color = ?, logo_url = ?
            WHERE id = ?
        `;

        await db.execute(updateQuery, [
            code,
            name,
            country || null,
            type,
            status,
            brand_color || null,
            logo_url,
            id
        ]);

        const [updatedRow] = await db.execute('SELECT * FROM airlines WHERE id = ?', [id]);

        return res.status(200).json({
            success: true,
            message: "Airline updated successfully",
            data: {...updatedRow[0] , logo_url : changeToImageFullUrl(updatedRow[0].logo_url)}
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const deleteAirline = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "Airline ID is required." });
        }

        const [existing] = await db.execute('SELECT * FROM airlines WHERE id = ?', [id]);
        if (!existing || existing.length === 0) {
            return res.status(404).json({ success: false, message: "Airline not found." });
        }

        await db.execute('DELETE FROM airlines WHERE id = ?', [id]);

        if(existing[0].logo_url) {
            await deleteStoredImage(existing[0].logo_url)
        }

        return res.status(200).json({
            success: true,
            message: "Airline and related Flights are deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
