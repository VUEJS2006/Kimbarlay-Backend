export const searchTownship = async (township_id , connection) => {
    const [townships] = await connection.execute(
        'SELECT id, name, latitude, longitude FROM townships WHERE id = ?', 
        [township_id]
    );
    return townships[0]
}


export const checkValidHotels = async (township_id , hotelIds , connection) => {
    const [validHotels] = await connection.query(
        'SELECT id FROM domestic_hotels WHERE id IN (?) AND township_id = ?',
        [hotelIds, township_id]
    );
    return validHotels
}

export const checkValidPriorities = (promotions) => {
    const priorities = promotions.map(p => p.priority).sort((a, b) => a - b);
    return priorities[0] === 1 && priorities[1] === 2 && priorities[2] === 3;
}