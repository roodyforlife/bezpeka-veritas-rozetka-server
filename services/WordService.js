import fs from 'fs/promises';
import { templatesFile, wordFilesDir, wordFilesJsonFile } from '../consts.js';
import { processFilesAndCreateZip } from '../utils/parseTheWordDoc.js';

class WordService {
    constructor() {
    }

    getFiles = async () => {
        const content = await fs.readFile(wordFilesJsonFile, "utf8");
        return JSON.parse(content)
    }

    remove = async (id) => {
        try {
            const content = await fs.readFile(wordFilesJsonFile, "utf8");
            const jsonContent = JSON.parse(content)
            const result = jsonContent.filter((file) => file.id !== id)
            await fs.writeFile(wordFilesJsonFile, JSON.stringify(result), "utf8");
            await fs.unlink(`${wordFilesDir}/${id}`)
        } catch (error) {
            console.log(error)
        }
    }

    getResult = async (selectedFiles, selectedTemplate) => {
        if (selectedTemplate) {
            const result = selectedTemplate.items.reduce((acc, item) => {
                acc[item.key] = item.value;
                return acc;
            }, {});

            const content = await fs.readFile(templatesFile, "utf8");
            const templates = JSON.parse(content)
            const template = templates.find((template) => template.id === selectedTemplate.id)
            var imageBytes = [];
            if (template) {
                imageBytes = template.image
            }

            const zipResult = await processFilesAndCreateZip(selectedFiles, result, imageBytes)
            return zipResult
        } else {
            throw Error("Error")
        }
    }
}

export default WordService