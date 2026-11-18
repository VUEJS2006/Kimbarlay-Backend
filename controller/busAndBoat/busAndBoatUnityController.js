
import db from "../../config/db.js";

export const getBusOrBoatUnity = async ( req , res ) => {
    try {
        const id = req.id;

        const [ rows ] = await db.query(`SELECT * FROM bus_and_boat_unity WHERE id = ?` , [id]);

        let data = {};
        if(rows && rows.length) {
            const { id : newId , title : newTitle , subtitle : newSubTitle , ...newData } = rows[0];
            data = newData;

            if(id === "bus_step_heading" || "bus_why_heading") {
                data = { title : newTitle , ...data }
            } else if(id === "bus_intro" ) {
                data = { heading : newTitle , paragraph : newSubTitle , ...data }
            } else {
                data = { title : newTitle , subtitle : newSubTitle , ...data }
            }
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

export const updateBusOrBoatUnity = async ( req , res ) => {
    try {
        const id = req.id;
        const { heading , paragraph , title , subtitle } = req.body;
        const finalTitle = (id === "bus_intro" ? heading : title );
        const finalSubtitle = (id === "bus_intro" ? paragraph : subtitle );

        if(!finalTitle) {
            return res.status(400).json({
                success : false,
                message : (id === "bus_intro" ? "Heading" : "Title") + " is required"
            })
        }

        const query = `
        INSERT INTO bus_and_boat_unity (id, title , subtitle)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE 
            title = VALUES(title),
            subtitle = VALUES(subtitle);
        `;

        await db.query(query , [ id , finalTitle , finalSubtitle ]);

        const [ rows ] = await db.query(`SELECT * FROM bus_and_boat_unity WHERE id = ?` , [id]);

        const { id : newId , title : newTitle , subtitle : newSubTitle , ...newData } = rows[0];
        let data = newData;
        if(id === "bus_step_heading" || "bus_why_heading" ) {
            data = { title : newTitle , ...data }
        } else if(id === "bus_intro" ) {
            data = {  heading : newTitle , paragraph : newSubTitle , ...data }
        } else {
            data = { title : newTitle , subtitle : newSubTitle , ...data }
        }

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