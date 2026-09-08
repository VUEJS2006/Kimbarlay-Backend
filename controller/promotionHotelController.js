import db from "../config/db.js";
import { checkValidHotels, checkValidPriorities, searchTownship } from "../utils/promotionHotel.js";
import { getTemperaturesForTownships, getTownshipTemp } from "../utils/weather.js";

// get for each township
export const getPromotionHotelsForEachTownship = async (req , res) => {
     const { township_id } = req.params;

    if (!township_id) {
        return res.status(400).json({
            success: false,
            message: "Township ID is required."
        });
    }

    const connection = await db.getConnection();

    try {
        const foundTownShip = await searchTownship(township_id, connection);

        if (!foundTownShip) {
            return res.status(404).json({
                success: false,
                message: "Township does not exist in the database."
            });
        }

        const [promotionRows] = await connection.execute(
            `SELECT 
                ph.id,
                ph.township_id,
                ph.hotel_id,
                ph.priority,
                dh.title AS hotel_name,
                dh.price,
                dh.rating
             FROM promotion_hotels ph
             JOIN domestic_hotels dh ON ph.hotel_id = dh.id
             WHERE ph.township_id = ?
             ORDER BY ph.priority ASC`,
            [township_id]
        );

        if (promotionRows.length === 0) {
            return res.status(200).json({
                township_id : foundTownShip.id,
                message: "No promotion hotels found for this township.",
                promotions : []
            });
        }

        const temp = await getTownshipTemp(foundTownShip.latitude, foundTownShip.longitude, foundTownShip.id);

        return res.status(200).json({
            success: true,
            data: {
                township_id: foundTownShip.id,
                township_name: foundTownShip.name,
                temperature: temp,
                promotions: promotionRows 
            }
        });

    } catch (error) {
        console.error("Delete Promotion Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    } finally {
        connection.release();
    }
}

// get for all township
export const getPromotionHotelsForAllTownships = async (req , res) => {

    let connection;

    try {
        connection = await db.getConnection();

        const [townships] = await connection.execute(
            `
                SELECT
                    id,
                    name,
                    latitude,
                    longitude
                FROM townships
                ORDER BY name ASC
            `
        );

        if (townships.length === 0) {
            return res.status(200).json({
                success: true,
                data: []
            });
        }

        const [promotionRows] = await connection.execute(
            `
                SELECT
                    ph.id,
                    ph.township_id,
                    ph.hotel_id,
                    ph.priority,
                    dh.title AS hotel_name,
                    dh.price,
                    dh.rating
                FROM promotion_hotels ph
                JOIN domestic_hotels dh
                    ON ph.hotel_id = dh.id
                ORDER BY ph.township_id ASC, ph.priority ASC
            `
        );

        const promotionsByTownship = new Map();

        for (const promotion of promotionRows) {
            if (!promotionsByTownship.has(promotion.township_id)) {
                promotionsByTownship.set(promotion.township_id, []);
            }

            promotionsByTownship
                .get(promotion.township_id)
                .push(promotion);
        }

        const promotionTownships = townships.filter(
            (township) => promotionsByTownship.has(township.id)
        );

        const temperatures = await getTemperaturesForTownships(promotionTownships);

        const temperatureMap = new Map(
            temperatures.map((item) => [item.id, item.temp])
        );

        const data = promotionTownships.map((township) => ({
            township_id: township.id,
            township_name: township.name,
            temperature: temperatureMap.get(township.id) || "N/A",
            promotions: promotionsByTownship.get(township.id)
        }));


        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        console.error("Delete Promotion Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

export const promotionHotelCreate = async (req , res) => {
    let connection;
    try {
        const { township_id , promotions } = req.body;

        const isValidPriority = checkValidPriorities(promotions)


        if(!township_id || !promotions || promotions.length !== 3 || !isValidPriority  ) {
            return res.status(400).json({
                success : false,
                message : "You must provide exactly 3 hotels for Priority 1, 2 and 3. And township_id must exit."                
            })
        }

        connection = await db.getConnection();

        const foundTownShip = await searchTownship(township_id , connection);

        if(!foundTownShip) {
            return res.status(400).json({
                success : false,
                message : "Your township does not exit in database"                
            })
        }

        const hotelIds = promotions.map(p => p.hotel_id);

        const validHotels = await checkValidHotels(township_id , hotelIds , connection)

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
        

        return res.status(201).json({
            success: true,
            message: `Successfully updated promotion hotels for ${foundTownShip.name}.`,
            data: {
                township_id,
                township_name : foundTownShip.name,
                temperature: temp,
                promotions: savedPromotions
            }
        });

    }  catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    } finally {
        if (connection) { 
            connection.release(); 
        }
    }
}


export const updatePromotionHotels = async (req , res) => {
    let connection;
    try {
        const { township_id , promotions } = req.body;

        const isValidPriority = checkValidPriorities(promotions)

        if(!township_id || !promotions || promotions.length !== 3 || !isValidPriority  ) {
            return res.status(400).json({
                success : false,
                message : "You must provide exactly 3 hotels for Priority 1, 2 and 3 to update. And township_id must exit."                
            })
        }

        connection = await db.getConnection();

        const foundTownShip = await searchTownship(township_id , connection);

        if(!foundTownShip) {
            return res.status(400).json({
                success : false,
                message : "Your township does not exit in database"                
            })
        }
        
        const hotelIds = promotions.map(p => p.hotel_id);

        const validHotels = await checkValidHotels(township_id , hotelIds , connection)

        if (validHotels.length !== 3) {
            return res.status(400).json({
                success: false,
                message: "One or more selected hotels are invalid or do not belong to this township."
            });
        }

        const [existingRows] = await connection.execute(
            'SELECT id FROM promotion_hotels WHERE township_id = ?',
            [township_id]
        );

        if (existingRows.length !== 3) {
            return res.status(400).json({
                success: false,
                message: "This township does not have 3 existing promotion hotels to update. Please create them first."
            });
        }

        const temp = await getTownshipTemp(foundTownShip.latitude , foundTownShip.longitude , foundTownShip.id);

        await connection.beginTransaction();

        for (const promo of promotions) {
            await connection.execute(
                `UPDATE promotion_hotels 
                 SET hotel_id = ? 
                 WHERE township_id = ? AND priority = ?`,
                [promo.hotel_id, township_id, promo.priority]
            );
        }

        const [updatedPromotions] = await connection.execute(
            `SELECT id, hotel_id, priority 
             FROM promotion_hotels 
             WHERE township_id = ? 
             ORDER BY priority ASC`,
            [township_id]
        );

        await connection.commit();

        return res.status(200).json({
            success: true,
            message: `Successfully updated promotion hotels for ${foundTownShip.name}.`,
            data: {
                township_id,
                township_name: foundTownShip.name,
                temperature: temp,
                promotions: updatedPromotions
            }
        });

    } catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    } finally {
        if (connection) { 
            connection.release(); 
        }
    }
}

export const deletePromotionHotels = async (req , res) => {
    const { township_id } = req.params;

    if (!township_id) {
        return res.status(400).json({
            success: false,
            message: "Township ID is required."
        });
    }

    const connection = await db.getConnection();

    try {
        const foundTownShip = await searchTownship(township_id, connection);

        if (!foundTownShip) {
            return res.status(404).json({
                success: false,
                message: "Township does not exist in the database."
            });
        }

        // Delete rows matching township_id
        const [result] = await connection.execute(
            'DELETE FROM promotion_hotels WHERE township_id = ?',
            [township_id]
        );

        return res.status(200).json({
            success: true,
            message: `Successfully deleted all promotion hotels for ${foundTownShip.name}.`,
            deleted_count: result.affectedRows
        });

    } catch (error) {
        console.error("Delete Promotion Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    } finally {
        connection.release();
    }
}