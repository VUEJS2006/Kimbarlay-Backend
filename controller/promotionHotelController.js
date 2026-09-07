import db from "../config/db.js";
import { getTownshipTemp } from "../utils/weather.js";

export const promotionHotelCreate = async (req , res) => {
    try {
        const { township_id , promotions } = req.body;

        if(!township_id || !promotions || promotions.length !== 3) {
            return res.status(400).json({
                success : false,
                message : "You must provide exactly 3 hotels for Priority 1, 2 and 3. And township_id must exit."                
            })
        }

        const connection = await db.getConnection();

        const [townships] = await connection.execute(
            'SELECT id, name, latitude, longitude FROM townships WHERE id = ?', 
            [township_id]
        );
        const foundTownShip = townships[0];

        if(!foundTownShip) {
            return res.status(400).json({
                success : false,
                message : "Your township does not exit in database"                
            })
        }

        const hotelIds = promotions.map(p => p.hotel_id);

        const [validHotels] = await connection.query(
            'SELECT id FROM domestic_hotels WHERE id IN (?) AND township_id = ?',
            [hotelIds, township_id]
        );

        if (validHotels.length !== 3) {
            return res.status(400).json({
                success: false,
                message: "One or more selected hotels are invalid or do not belong to this township."
            });
        }

        const [existingPromotions] = await connection.execute(
            'SELECT id FROM promotion_hotels WHERE township_id = ? LIMIT 1', 
            [township_id]
        );

        if (existingPromotions.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Promotion hotels already exist for this township. Please use the update route to modify."
            });
        }


        const temp = await getTownshipTemp(foundTownShip.latitude , foundTownShip.longitude , foundTownShip.id);

        // insert into database
        await connection.beginTransaction();

        const insertValues = promotions.map(p => [township_id, p.hotel_id, p.priority]);

        await connection.query(
            'INSERT INTO promotion_hotels (township_id, hotel_id, priority) VALUES ?',
            [insertValues]
        );

        const [savedPromotions] = await connection.execute(
            'SELECT id, hotel_id, priority, created_at FROM promotion_hotels WHERE township_id = ? ORDER BY priority ASC',
            [township_id]
        );

        await connection.commit();
        

        return res.status(200).json({
            success: true,
            message: `Successfully updated promotion hotels for ${foundTownShip.name}.`,
            data: {
                township_id,
                township_name : foundTownShip.name,
                temperature: temp,
                promotions: savedPromotions
            }
        });

    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

