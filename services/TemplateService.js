import fs from 'fs/promises';
import { templatesFile } from '../consts.js';

const getJsonTemplates = async () => {
    const content = await fs.readFile(templatesFile, "utf8");
    return JSON.parse(content)
}

class TemplateService {
    constructor() {
    }

    add = async (template) => {
        try {
            const templates = await getJsonTemplates()
            templates.push(template)
            await fs.writeFile(templatesFile, JSON.stringify(templates, null, 2), "utf8");
        } catch (error) {
            console.log(error)
        }
    }

    getAll = async () => {
        const templates = await getJsonTemplates()
        return templates
    }

    edit = async (template) => {
        const templates = await getJsonTemplates()
        const updatedTemplates = templates.map((currentTemplate) => {
            if (currentTemplate.id === template.id) {
                return {...template, image: currentTemplate.image};
            }

            return currentTemplate;
        })

        await fs.writeFile(templatesFile, JSON.stringify(updatedTemplates, null, 2), "utf8");
    }

    remove = async (id) => {
        const templates = await getJsonTemplates()
        const updatedTemplates = templates.filter((template) => template.id !== id)
        await fs.writeFile(templatesFile, JSON.stringify(updatedTemplates, null, 2), "utf8");
    }
}

export default TemplateService