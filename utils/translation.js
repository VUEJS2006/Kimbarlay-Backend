// this func is for formatting response data from translations table
export const translationsFormat = (rows) => {
    const translations =  {};
    rows.forEach(row => {
        translations[row.translation_key] = {
            en : row.en,
            zh : row.zh
        }
    })
    return translations;
}