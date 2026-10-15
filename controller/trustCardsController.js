import db from "../config/db.js";


export const trustAllowedIds = ['card_1', 'card_2', 'card_3'];
export const refundAllowedIds = ['refund_card_1', 'refund_card_2' , 'refund_card_3' ]
export const hotelAllowedIds = ['hotel_card_1', 'hotel_card_2' , 'hotel_card_3' ]
// export const travelSecurityAllowedIds = ['travel_security_card_1', 'travel_security_card_2' , 'travel_security_card_3' , 'travel_security_card_4', 'travel_security_card_5' , 'travel_security_card_6'  , 'travel_security_card_7', 'travel_security_card_8' ]
export const travelSecurityAllowedIds = [1, 2, 3, 4, 5, 6, 7, 8].map(item => "travel_security_card_" + item)

export const getAllTrustCards = async ( req , res ) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM trust_cards WHERE id IN (?, ?, ?) ORDER BY id ASC',
            trustAllowedIds
        );

        return res.status(200).json({ 
            success : true,
            message: 'All trust cards are here',
            data : rows
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}

export const updateAllTrustCards = async ( req , res ) => {
    try {
        const cards = req.body;

        const rows = await generalUpdateThreeCards({cards , allowedIds : trustAllowedIds , cardTypeId : 1 , res})

        return res.status(200).json({ 
            success : true,
            message: 'All trust cards updated successfully',
            data : rows
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}


export const getAllRefundCards = async ( req , res ) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM trust_cards WHERE id IN (?, ?, ?) ORDER BY id ASC',
            refundAllowedIds
        );

        return res.status(200).json({ 
            success : true,
            message: 'All refund cards are here',
            data : rows
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}

export const updateAllRefundCards = async ( req , res ) => {
    try {
        const cards = req.body;

        const rows = await generalUpdateThreeCards({cards , allowedIds : refundAllowedIds , cardTypeId : 2 , res})

        return res.status(200).json({ 
            success : true,
            message: 'All refund cards updated successfully',
            data : rows
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}


export const getAllHotelCards = async ( req , res ) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM trust_cards WHERE id IN (?, ?, ?) ORDER BY id ASC',
            hotelAllowedIds
        );

        return res.status(200).json({ 
            success : true,
            message: 'All hotels cards are here',
            data : rows
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}

export const updateAllHotelsCards = async ( req , res ) => {
    try {
        const cards = req.body;

        const rows = await generalUpdateThreeCards({cards , allowedIds : hotelAllowedIds , cardTypeId : 3 , res})

        return res.status(200).json({ 
            success : true,
            message: 'All hotels cards updated successfully',
            data : rows
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}

export const getAllTravelSecurityCards = async ( req , res ) => {
    try {
        const [rows] = await db.execute(
            `SELECT * FROM trust_cards WHERE id IN (${travelSecurityAllowedIds.map(_ => "?").join(",")}) ORDER BY id ASC`,
            travelSecurityAllowedIds
        );

        return res.status(200).json({ 
            success : true,
            message: 'All travel security cards are here',
            data : rows
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}

export const updateAllTravelSecurityCards = async ( req , res ) => {
    try {
        const cards = req.body;

        const rows = await generalUpdateThreeCards({cards , allowedIds : travelSecurityAllowedIds , cardTypeId : 4 , res})

        return res.status(200).json({ 
            success : true,
            message: 'All travel security cards updated successfully',
            data : rows
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}



const generalUpdateThreeCards = async({cards , allowedIds , cardTypeId , res}) => {
    try {
        if (!Array.isArray(cards) || (cardTypeId === 4 ? cards.length !== 8 : cards.length !== 3)) {
            return res.status(400).json({
                success: false,
                message: `Request body must be an array containing exactly ${cardTypeId === 1 ? "3 trust" : ""}${cardTypeId === 2 ? "3 refund" : ""}${cardTypeId === 3 ? "3 hotel" : ""}${cardTypeId === 4 ? "8 travel security" : ""} cards.`
            });
        }

        for (const card of cards) {
            if (!allowedIds.includes(card.id)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid Card ID: '${card.id}'. ID must be one of ${cardTypeId === 1 ? "'card_1', 'card_2', or 'card_3'" : ""}${cardTypeId === 2 ? "'refund_card_1', 'refund_card_2', or 'refund_card_3'" : ""}${cardTypeId === 3 ? "'hotel_card_1', 'hotel_card_2' , or 'hotel_card_3'" : ""}${cardTypeId === 4 ? travelSecurityAllowedIds.join(" , ") : ""}.`
                });
            }

            const isValid = card.title && card.description && card.color;
            if (!isValid) {
                return res.status(400).json({
                    success: false,
                    message: `Title, description, and color are required for card '${card.id}'.`
                });
            }
        }

        const submittedIds = cards.map(c => c.id);
        const hasAllCards = allowedIds.every(id => submittedIds.includes(id));
        
        if (!hasAllCards) {
            return res.status(400).json({
                success: false,
                message: `You must provide all ${cardTypeId === 1 ? "3 cards: 'card_1', 'card_2', and 'card_3'" : ""}${cardTypeId === 2 ? "3 cards: 'refund_card_1', 'refund_card_2', and 'refund_card_3'" : ""}${cardTypeId === 3 ? "3 cards: 'hotel_card_1', 'hotel_card_2' , and 'hotel_card_3'" : ""}${cardTypeId === 4 ? "8 cards: "  + travelSecurityAllowedIds.join(" , ") : ""}.`
            });
        }

        const values = cards.map(c => [c.id, c.title, c.description, c.color]);

        const query = `
        INSERT INTO trust_cards (id, title, description, color)
        VALUES ?
        ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            description = VALUES(description),
            color = VALUES(color),
            updated_at = CURRENT_TIMESTAMP;
        `;

        await db.query(query, [values]);

        const [rows] = await db.execute(
            `SELECT * FROM trust_cards WHERE id IN (${allowedIds.map(_ => "?").join(",")}) ORDER BY id ASC`,
            allowedIds
        );

        return rows;
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            success: false,
            message: err.message 
        });
    }
}