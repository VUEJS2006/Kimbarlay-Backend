import db from "../config/db.js"
import { asyncHandel } from "../middleware/asyncMiddleware.js"
import fs from "fs";
import path from "path";
import sharp from "sharp";

export const helpfulCreate = asyncHandel(async (req, res) => {
    try {

        const { guide_id } = req.body;
        const userID = req.user.id

        if (req.user.role !== "user") {
            return res.status(403).json({
                success: false,
                message: "Only users can give helpful!"
            });
        }
        if (!guide_id) {
            return res.status(400).json({
                success: false,
                message: "Guide ID is required!"
            });
        }
        const [guide] = await db.query(
            `SELECT id FROM guides WHERE id = ?`,
            [guide_id]
        );
        if (guide.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Guide not found!"
            });
        }
        const [result] = await db.query(
            `
            INSERT IGNORE INTO help_ful
                (guide_id, user_id)
            VALUES (?, ?)
            `,
            [guide_id, userID]
        );
        if (result.affectedRows === 0) {
            return res.status(409).json({
                success: false,
                message: "You have already marked this guide as helpful!"
            });
        }
        const [count] = await db.query(
            `
            SELECT COUNT(*) AS total_helpful
            FROM help_ful
            WHERE guide_id = ?
            `,
            [guide_id]
        );

        return res.status(201).json({
            success: true,
            message: "Guide marked as helpful!",
            total_helpful: count[0].total_helpful
        });



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
})