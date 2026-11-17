import db from "../../config/db.js";
import { backendDomainUrl, changeToImageFullUrl, deleteStoredImage, storeImageToDynamicFolder } from "../../utils/image.js";

export const getBusOrBoatBanner = async ( req , res ) => {
    try {
        const id = req.id;

        const [ rows ] = await db.query(`SELECT * FROM ticket_bus_boat_car_banners_unity WHERE id = ?` , [id]);

        let data = {}
        if(rows && rows.length) {
            const { id : newId , ...exitData } = rows[0];
            const new_background_image_url = (exitData.background_image_url && exitData.background_image_url.startsWith("images")) ? changeToImageFullUrl(exitData.background_image_url) : exitData.background_image_url;
            const new_phone_screen_image_url = (exitData.phone_screen_image_url && exitData.phone_screen_image_url.startsWith("images")) ? changeToImageFullUrl(exitData.phone_screen_image_url) : exitData.phone_screen_image_url;
            const new_qr_code_image_url = (exitData.qr_code_image_url && exitData.qr_code_image_url.startsWith("images")) ? changeToImageFullUrl(exitData.qr_code_image_url) : exitData.qr_code_image_url;
            data = {...exitData , background_image_url : new_background_image_url , phone_screen_image_url : new_phone_screen_image_url , qr_code_image_url : new_qr_code_image_url }
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

export const updateBusAndBoatBanner = async ( req , res ) => {
    try {
        const id = req.id;
        const files = req.files;
        const { title , subtitle , description , qr_caption , background_image_url , phone_screen_image_url , qr_code_image_url } = req.body;

        const isValid = title && subtitle;
        if(!isValid) {
            res.status(400).json({
                success : false,
                message : "Title and subtitle are required"
            })
        }

        const bgImageContainer = files["background_image"]
        if(!bgImageContainer && !background_image_url) {
            res.status(400).json({
                success : false,
                message : "One of background_image file or background_image_url is required"
            })
        }

        const phScreenImageContainer = files["phone_screen_image"]
        if(!phScreenImageContainer && !phone_screen_image_url) {
            res.status(400).json({
                success : false,
                message : "One of phone_screen_image file or phone_screen_image_url is required"
            })
        }

        const qrCodeImageContainer = files["qr_code_image"];
        if(!qrCodeImageContainer && !qr_code_image_url) {
            res.status(400).json({
                success : false,
                message : "One of qr_code_image file or qr_code_image_url is required"
            })
        }


        const [ oldData ] = await db.query(`SELECT * from ticket_bus_boat_car_banners_unity WHERE id = ?` , [id])
        if(oldData && oldData.length) {

            if( !(!bgImageContainer && background_image_url.includes(backendDomainUrl)) && oldData[0].background_image_url && oldData[0].background_image_url.startsWith("images")) {
                await deleteStoredImage(oldData[0].background_image_url)
            }

            if( !(!phScreenImageContainer && phone_screen_image_url.includes(backendDomainUrl)) && oldData[0].phone_screen_image_url && oldData[0].phone_screen_image_url.startsWith("images")) {
                await deleteStoredImage(oldData[0].phone_screen_image_url)
            }

            if( !(!qrCodeImageContainer && qr_code_image_url.includes(backendDomainUrl)) && oldData[0].qr_code_image_url && oldData[0].qr_code_image_url.startsWith("images")) {
                await deleteStoredImage(oldData[0].qr_code_image_url)
            }

        }

        let bgImgUrl = background_image_url;
        if(bgImageContainer) {
            bgImgUrl = await storeImageToDynamicFolder(bgImageContainer[0], id)
        } else if( background_image_url.includes(backendDomainUrl) ) {
            bgImgUrl = oldData[0].background_image_url;
        }

        let phScreenImgUrl = phone_screen_image_url;
        if(phScreenImageContainer) {
            phScreenImgUrl = await storeImageToDynamicFolder(phScreenImageContainer[0], id)
        } else if( phone_screen_image_url.includes(backendDomainUrl) ) {
            phScreenImgUrl = oldData[0].phone_screen_image_url;
        }

        let qrCodeImgUrl = qr_code_image_url;
        if(qrCodeImageContainer) {
            qrCodeImgUrl = await storeImageToDynamicFolder(qrCodeImageContainer[0], id)
        } else if( qr_code_image_url.includes(backendDomainUrl) ) {
            qrCodeImgUrl = oldData[0].qr_code_image_url;
        }

        const query = `
        INSERT INTO ticket_bus_boat_car_banners_unity (id, title, subtitle, description, qr_caption , background_image_url, phone_screen_image_url, qr_code_image_url)
        VALUES ( ?, ? , ? , ? , ? , ? , ? , ?)
        ON DUPLICATE KEY UPDATE 
            title = VALUES(title),
            subtitle = VALUES(subtitle),
            description = VALUES(description),
            qr_caption = VALUES(qr_caption),
            background_image_url = VALUES(background_image_url), 
            phone_screen_image_url = VALUES(phone_screen_image_url),
            qr_code_image_url = VALUES(qr_code_image_url);
        `;

        const dataArray = [ id , title , subtitle , description , qr_caption , bgImgUrl , phScreenImgUrl , qrCodeImgUrl ]
        await db.query(query , dataArray);

        const [ rows ] = await db.query(`SELECT * FROM ticket_bus_boat_car_banners_unity WHERE id = ?` , [id]);

        const { id : newId , ...data } = rows[0];
        const new_background_image_url = (data.background_image_url && data.background_image_url.startsWith("images")) ? changeToImageFullUrl(data.background_image_url) : data.background_image_url;
        const new_phone_screen_image_url = (data.phone_screen_image_url && data.phone_screen_image_url.startsWith("images")) ? changeToImageFullUrl(data.phone_screen_image_url) : data.phone_screen_image_url;
        const new_qr_code_image_url = (data.qr_code_image_url && data.qr_code_image_url.startsWith("images")) ? changeToImageFullUrl(data.qr_code_image_url) : data.qr_code_image_url;

        res.status(200).json({
            success : true,
            message : id + " is successfully updated.",
            data : {...data , background_image_url : new_background_image_url , phone_screen_image_url : new_phone_screen_image_url , qr_code_image_url : new_qr_code_image_url } 
        })
        
    } catch(err) {
        res.status(500).json({
            success : false,
            message : err.message
        })
    }
}