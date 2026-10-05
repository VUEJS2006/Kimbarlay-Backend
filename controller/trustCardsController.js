import db from "../config/db.js";


export const trustAllowedIds = ['card_1', 'card_2', 'card_3'];
export const refundAllowedIds = ['refund_card_1', 'refund_card_2' , 'refund_card_3' ]

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

        const rows = await generalUpdateThreeCards({cards , allowedIds : trustAllowedIds , isFromTrust : true , res})

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

        const rows = await generalUpdateThreeCards({cards , allowedIds : refundAllowedIds , isFromTrust : false , res})

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

const generalUpdateThreeCards = async({cards , allowedIds , isFromTrust , res}) => {
    try {
        if (!Array.isArray(cards) || cards.length !== 3) {
            return res.status(400).json({
                success: false,
                message: `Request body must be an array containing exactly 3 ${isFromTrust ? "trust" : "refund"} cards.`
            });
        }

        for (const card of cards) {
            if (!allowedIds.includes(card.id)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid Card ID: '${card.id}'. ID must be one of ${isFromTrust ? "'card_1', 'card_2', or 'card_3'" : "'refund_card_1', 'refund_card_2', or 'refund_card_3'"}.`
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
        const hasAllThree = allowedIds.every(id => submittedIds.includes(id));
        
        if (!hasAllThree) {
            return res.status(400).json({
                success: false,
                message: `You must provide all 3 cards: ${isFromTrust ? "'card_1', 'card_2', or 'card_3'" : "'refund_card_1', 'refund_card_2', or 'refund_card_3'"}.`
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
            'SELECT * FROM trust_cards WHERE id IN (?, ?, ?) ORDER BY id ASC',
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