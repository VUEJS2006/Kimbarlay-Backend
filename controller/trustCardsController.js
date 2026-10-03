import db from "../config/db.js";


export const getAllTrustCards = async ( req , res ) => {
    try {
        const [rows] = await db.execute('SELECT * FROM trust_cards ORDER BY id ASC');

        return res.status(200).json({ 
            success : true,
            message: 'All trust cards are here',
            data : rows
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const allowedIds = ['card_1', 'card_2', 'card_3'];

export const updateAllTrustCards = async ( req , res ) => {
    try {
        const cards = req.body;

        if (!Array.isArray(cards) || cards.length !== 3) {
        return res.status(400).json({
            success: false,
            message: "Request body must be an array containing exactly 3 trust cards."
        });
        }

        for (const card of cards) {
        if (!allowedIds.includes(card.id)) {
            return res.status(400).json({
            success: false,
            message: `Invalid Card ID: '${card.id}'. ID must be one of 'card_1', 'card_2', or 'card_3'.`
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
            message: "You must provide all 3 cards: 'card_1', 'card_2', and 'card_3'."
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

        const [rows] = await db.execute('SELECT * FROM trust_cards ORDER BY id ASC');

        return res.status(200).json({ 
            success : true,
            message: 'All trust cards updated successfully',
            data : rows
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}