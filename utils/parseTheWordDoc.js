import fs from "fs/promises";
import PizZip from "pizzip";
import JSZip from "jszip";
import Docxtemplater from "docxtemplater";
import { wordFilesDir, wordFilesJsonFile } from "../consts.js";
import ImageModule from "docxtemplater-image-module-free";

export async function processFilesAndCreateZip(files, dataObject) {
    try {
        const zip = new JSZip();
        const contentFiles = await fs.readFile(wordFilesJsonFile, 'utf8')
        const jsonfiles = JSON.parse(contentFiles)

        for (const file of files) {
            const content = await fs.readFile(`${wordFilesDir}/${file}`, "binary");

            const docZip = new PizZip(content);

            const doc = new Docxtemplater(docZip, {
                paragraphLoop: true,
                linebreaks: true,
            });

            doc.render({
                ...dataObject,
            });

            const buf = doc.getZip().generate({
                type: "nodebuffer",
                compression: "DEFLATE",
            });

            // const fileName = file.split("/").pop();
            const fileName = jsonfiles.find((jsonfile) => jsonfile.id === file)?.name
            zip.file(fileName, buf);
        }

        const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

        const blob = new Blob([zipBuffer], { type: "application/zip" });

        console.log("Архив успешно создан!");
        return blob;
    } catch (error) {
        console.error("Ошибка обработки файлов:", error.message);
        if (error.properties && error.properties.errors) {
            error.properties.errors.forEach((e) => {
                console.error(e);
            });
        }
        throw error;
    }
}