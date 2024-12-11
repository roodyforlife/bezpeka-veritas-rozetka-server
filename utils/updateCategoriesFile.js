import fs from 'fs/promises'

export async function updateCategoriesFile(req, res, filePath) {
    try {
    const settingsData = req.body;
    let currentData = [];
    currentData.push(...settingsData);
    console.log(`LOG: push the new settings ${Date.now()}`)
    try {
        await fs.writeFile(filePath, JSON.stringify(currentData, null, 2), "utf8")
        res.status(200).send('Данные успешно сохранены');
    } catch (error) {
        return res.status(500).send('Ошибка при записи в файл');
    }
    } catch (error) {
        return res.status(500).send('Ошибка');
    }
}