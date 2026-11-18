
import db from "../../config/db.js";

export const getBusOrBoatContact = async ( req , res ) => {
    try {
        const id = req.id;

        const [ rows ] = await db.query(`SELECT * FROM bus_and_boat_contact WHERE id = ?` , [id]);

        let data = {};
        if(rows && rows.length) {
            const { id : newId , ...newData } = rows[0];
            data = newData;
        }

        res.status(200).json({
            success : true,
            message : id + " is here.",
            data
        })  

    } catch (err) {
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}

export const updateBusOrBoatContact = async ( req , res ) => {
    try {
        const id = req.id;
        const { heading , paragraph , phone , email , whatsapp , viber , disclaimer  } = req.body;

        const isValid = heading && phone && email && whatsapp && viber;

        if(!isValid) {
            return res.status(400).json({
                success : false,
                message : "Heading, phone, email, whatsapp and viber are required."
            })
        }

        const query = `
        INSERT INTO bus_and_boat_contact (id, heading , paragraph , phone , email , whatsapp , viber , disclaimer)
        VALUES (?, ?, ? , ? , ? , ? , ? , ?)
        ON DUPLICATE KEY UPDATE 
            heading = VALUES(heading),
            paragraph = VALUES(paragraph),
            phone = VALUES(phone),
            email = VALUES(email),
            whatsapp = VALUES(whatsapp),
            viber = VALUES(viber),
            disclaimer = VALUES(disclaimer);
        `;

        await db.query(query , [ id , heading , paragraph , phone , email , whatsapp , viber , disclaimer ]);

        const [ rows ] = await db.query(`SELECT * FROM bus_and_boat_contact WHERE id = ?` , [id]);

        const { id : newId , ...data } = rows[0];

        res.status(200).json({
            success : true,
            message : id + " is successfully updated.",
            data
        })        

    } catch (err) {
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}