import fs from 'fs/promises';

export async function getCategoryFile(res, filePath) {
    const categoriesFromJson = await fs.readFile(filePath, "utf8");
    const jsonCategories = JSON.parse(categoriesFromJson);
    res.setHeader('Content-Type', 'text/json');
    res.send(jsonCategories)
}