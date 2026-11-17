import db from "../../config/db.js";


export const getVisaUnity = async (req , res) => {
    try {
        const id = req.id;

        const [ rows ] = await db.query(`SELECT * FROM visa_unity WHERE id = ?` , [id]);

        let data ={ title : rows[0].title , description : rows[0].description , created_at :  rows[0].created_at , updated_at : rows[0].updated_at }
       
        if(id === "visa_cta") {
            data.call_button_label = rows[0].phone;
            data.email_button_label = rows[0].email;
        } else if(id === "visa_contact") {
            const { id , title , description , ...copiedData  } = rows[0];
            data = {...copiedData , office_hours : rows[0].title , address : rows[0].description }
        }

        res.status(200).json({
            success : true,
            message : id +" is here.",
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


export const eidtVisaUnity = async (req , res) => {
    try {
        const { title , description , call_button_label , email_button_label , office_hours , address ,  phone , email ,  } = req.body;
        const finalTitle = title || office_hours;
        const finalDescription = description || address;
        const finalPhone = call_button_label || phone;
        const finalEmail = email_button_label || email;
        const id = req.id;

        if( !finalTitle) {
            return res.status(400).json({
                success : false,
                message : (id === "visa_contact") ? "office_hours is required" : "Title is required" 
            })
        }

        const query = `
        INSERT INTO visa_unity (id, title , description , phone , email)
        VALUES ( ?, ? , ? , ? , ? )
        ON DUPLICATE KEY UPDATE 
            title = VALUES(title),
            description = VALUES(description),
            phone = VALUES(phone),
            email = VALUES(email);
        `;

        await db.query(query , [ id , finalTitle , finalDescription , finalPhone , finalEmail ]);

        const [ rows ] = await db.query(`SELECT * FROM visa_unity WHERE id = ?` , [id]);

        let data ={ title : rows[0].title , description : rows[0].description , created_at :  rows[0].created_at , updated_at : rows[0].updated_at }
       
        if(id === "visa_cta") {
            data.call_button_label = rows[0].phone;
            data.email_button_label = rows[0].email;
        } else if(id === "visa_contact") {
            const { id ,  title , description , ...copiedData  } = rows[0];
            data = {...copiedData , office_hours : rows[0].title , address : rows[0].description }
        }

        res.status(200).json({
            success : true,
            message : "Successfully updated.",
            data
        })

    } catch(err) {
        res.status(500).json({
            success : false,
            message : err.message
        })
    }

}