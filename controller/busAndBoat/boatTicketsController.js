import db from "../../config/db.js";
import { backendDomainUrl, changeToImageFullUrl, deleteStoredImage, storeImageToDynamicFolder } from "../../utils/image.js";

const allowedTicketClasses = [ 'VIP', 'Deluxe' , 'Standard' ]

export const getAllBoatTickets = async (req , res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM boat_tickets ORDER BY id ASC");

        const data = rows.map(item => (item.ticket_image_url && item.ticket_image_url.startsWith("images") ? {...item , ticket_image_url : changeToImageFullUrl(item.ticket_image_url)} : item ))

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

export const createBoatTicket = async (req , res) => {
    try {
        const { route , sub_route , departure_time , arrival_time , price , currency_unit , ticket_class , is_popular , ticket_image_url } = req.body;
        const image = req.file;

        const isValid = route && sub_route && departure_time && arrival_time && price !== undefined && currency_unit && ticket_class && is_popular !== undefined;
        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Route , sub_route , departure_time , arrival_time , price , currency_unit , ticket_class and is_popular are required"
            })
        }
        
        if(!allowedTicketClasses.includes(ticket_class)) {
            return res.status(400).json({
                status : false,
                message : "ticket_class is allowed only for " + allowedTicketClasses.join(" , ")
            })
        }

        if(!image && !ticket_image_url) {
            return res.status(400).json({
                status : false,
                message : "Image file or ticket_image_url is required"
            })
        }

        let url = ticket_image_url;
        if(image) {
            url = await storeImageToDynamicFolder(image , "boat_tickets");
        }

        const [ result ] = await db.query(`INSERT INTO boat_tickets ( route , sub_route , departure_time , arrival_time , price , currency_unit , ticket_class , is_popular , ticket_image_url) VALUES ( ? , ? , ? , ? , ? , ? , ? , ? , ? )` , [ route , sub_route , departure_time , arrival_time , price , currency_unit , ticket_class , is_popular , url ])
        const [ rows ] = await db.query(`SELECT * FROM boat_tickets WHERE id = ?` , [result.insertId]);

        res.status(201).json({
            status : true,
            message : "Successfully created",
            data : image ? {...rows[0] , ticket_image_url : changeToImageFullUrl(rows[0].ticket_image_url)} : rows[0]
        })

    } catch(err) {
        console.error(err);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}

export const updateBoatTicket = async (req , res) => {
    try {
        const { id , route , sub_route , departure_time , arrival_time , price , currency_unit , ticket_class , is_popular , ticket_image_url } = req.body;
        const image = req.file;

        const isValid = id && route && sub_route && departure_time && arrival_time && price !== undefined && currency_unit && ticket_class && is_popular !== undefined;
        if(!isValid) {
            return res.status(400).json({
                status : false,
                message : "Id , route , sub_route , departure_time , arrival_time , price , currency_unit , ticket_class and is_popular are required"
            })
        } 

        if(!image && !ticket_image_url) {
            return res.status(400).json({
                status : false,
                message : "One of Image file or ticket_image_url are required"
            })
        }

        if(!allowedTicketClasses.includes(ticket_class)) {
            return res.status(400).json({
                status : false,
                message : "ticket_class is allowed only for " + allowedTicketClasses.join(" , ")
            })
        }

        const [ exitRows ] = await db.query(`SELECT * FROM boat_tickets WHERE id = ?` , [id]);

        if(!exitRows || !exitRows.length) {
            return res.status(400).json({
                status : false,
                message : "Wrong  or invalid Id!"
            })
        }

        let url = ticket_image_url;
        if(image) {
            url = await storeImageToDynamicFolder(image , "boat_tickets");
        }

        await db.query(`UPDATE boat_tickets SET route = ? , sub_route = ? , departure_time = ? , arrival_time = ? , price = ? , currency_unit = ? , ticket_class = ? , is_popular = ? , ticket_image_url = ? WHERE id = ?` , [ route , sub_route , departure_time , arrival_time , price , currency_unit , ticket_class , is_popular , url , id])

        if( !(!image && ticket_image_url.includes(backendDomainUrl)) ) {
            await deleteStoredImage(exitRows[0].ticket_image_url)
        }

        const [ rows ] = await db.query(`SELECT * FROM boat_tickets WHERE id = ?` , [id]);

        return res.status(200).json({
            status : true,
            message : "Successfully updated.",
            data : rows[0].ticket_image_url && rows[0].ticket_image_url.startsWith("images") ? {...rows[0] , ticket_image_url : changeToImageFullUrl(rows[0].ticket_image_url)} : rows[0]
        })

    } catch(err) {
        console.error(err);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}

export const deleteBoatTicket = async (req , res) => {
    try {
        const { id } = req.params;

        if(!id) {
            return res.status(400).json({
                status : false,
                message : "Id is required"
            })
        }

        const [ rows ] = await db.query(`SELECT * FROM boat_tickets WHERE id = ?` , [id]);

        const [ result ] = await db.query(`DELETE FROM boat_tickets WHERE id = ?` , [ id ]);

        if(result.affectedRows === 0) {
            return res.status(400).json({
                status : false,
                message : "Wrong or invalid id!"
            })
        }

        await deleteStoredImage(rows[0].ticket_image_url)

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