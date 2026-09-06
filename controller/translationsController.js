import { translationsFormat } from "../utils/translation.js";
import db from "./../config/db.js"

export const changeTranslation = async(req , res ) => {
    try {
        const { translation_key , en , zh  } = req.body;
        console.log("B : " ,req.body)
        const isValid = translation_key && en !== undefined && zh !== undefined && (en || zh);
        if(!isValid) {
            return res.status(400).json({
                success : false,
                message : "Tanslation_key must not empty and both en and zh should not be underfined !"
            })
        }

        const sql = `
            INSERT INTO translations (translation_key, en, zh)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
                en = COALESCE(VALUES(en), en),
                zh = COALESCE(VALUES(zh), zh);
        `;
        await db.query(sql , [translation_key , en , zh ] )

        const selectSql = `
            SELECT id, translation_key, en, zh 
            FROM translations 
            WHERE translation_key = ?
        `;
        const [rows] = await db.query(selectSql, [translation_key])

        const result = translationsFormat(rows)
        
        res.status(200).json({
            success : true,
            data : result,
            message : "Tanslation Chaning is successfully done."
        })

    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}
 
export const getAllTranslations = async(req , res ) => {
    try {
        const [rows] = await db.query(`SELECT translation_key, en, zh FROM translations`)

        const result = translationsFormat(rows)
        
        res.status(200).json({
            success : true,
            data : result,
            message : "Get all Translations successfully!"
        })

    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}