import NodeCache from "node-cache"

const weatherCache = new NodeCache({ stdTTL : 1800 });
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'YOUR_OPENWEATHERMAP_API_KEY';

// to get only one township temp
export const getTownshipTemp = async (lat, lon, townshipId) => {
    const cacheKey = `temp_township_${townshipId}`;

    if(weatherCache.has(cacheKey)) {
        console.log(`[CACHE HIT] Township ID ${townshipId} temp retrieved from Cache.`);
        return weatherCache.get(cacheKey)
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;

        const response = await fetch(url);
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json();

        const tempMin = Math.round(data.main.temp_min);
        const tempMax = Math.round(data.main.temp_max);
        const tempString = `${tempMin}°C - ${tempMax}°C`;

        weatherCache.set(cacheKey, tempString);
        return tempString;

    } catch(err) {
        console.error(`Weather API Error for Township ID ${townshipId}:`, err.message);
        return "N/A";
    }
}


// to get multiple township temp
export const getTemperaturesForTownships = async (townships) => {
    const tempPromises = townships.map(township => 
        getTownshipTemp(township.latitude, township.longitude, township.id).then(temp => ({ id: township.id, temp }))
    );

    return await Promise.all(tempPromises);
}