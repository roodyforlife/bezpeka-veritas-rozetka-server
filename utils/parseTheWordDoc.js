import fs from "fs/promises";
import PizZip from "pizzip";
import JSZip from "jszip";
import { fileURLToPath } from "url";
import Docxtemplater from "docxtemplater";
import { wordFilesDir, wordFilesJsonFile } from "../consts.js";
import ImageModule from "docxtemplater-image-module-free";
import sizeOf from "image-size";
import {default as sfs} from 'fs'

export async function processFilesAndCreateZip(files, dataObject, imageBytes) {
    console.log(imageBytes)
    try {
        const zip = new JSZip();
        const contentFiles = await fs.readFile(wordFilesJsonFile, 'utf8')
        const jsonfiles = JSON.parse(contentFiles)
        const imageBuffer = Buffer.from(imageBytes);

        for (const file of files) {
            const content = await fs.readFile(`${wordFilesDir}/${file}`, "binary");
            var opts = {}
            opts.centered = false;
            opts.fileType = "docx";
            opts.getImage = function(tagValue, tagName) {
                if (tagValue === "image") {
                    return imageBuffer; // Используем переданный imageBuffer
                }
                throw new Error(`Unknown tag value: ${tagValue}`);
            }
            
            opts.getSize = function(img, tagValue, tagName) {
                const dimensions = sizeOf(img); // Извлекаем размеры из буфера
                return [150, 150];
            }
            const docZip = new PizZip(content);

            var imageModule = new ImageModule(opts);
            var doc = new Docxtemplater()
                .attachModule(imageModule)
                .loadZip(docZip)
                .setData({...dataObject, image: imageBytes?.data?.length ? "image" : ""})
                .render();
            
            var buf = doc
                    .getZip()
                    .generate({type:"nodebuffer"});
            // const doc = new Docxtemplater(docZip, {
            //     paragraphLoop: true,
            //     linebreaks: true,
            // });

            // doc.render({
            //     ...dataObject,
            // });

            // const buf = doc.getZip().generate({
            //     type: "nodebuffer",
            //     compression: "DEFLATE",
            // });

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

// export async function processFilesAndCreateZip(files, dataObject) {
//     try {
//         const zip = new JSZip();
//         const contentFiles = await fs.readFile(wordFilesJsonFile, 'utf8')
//         const jsonfiles = JSON.parse(contentFiles)

//         for (const file of files) {
//             const content = await fs.readFile(`${wordFilesDir}/${file}`, "binary");

//             const docZip = new PizZip(content);

//             const doc = new Docxtemplater(docZip, {
//                 paragraphLoop: true,
//                 linebreaks: true,
//             });

//             doc.render({
//                 ...dataObject,
//             });

//             const buf = doc.getZip().generate({
//                 type: "nodebuffer",
//                 compression: "DEFLATE",
//             });

//             // const fileName = file.split("/").pop();
//             const fileName = jsonfiles.find((jsonfile) => jsonfile.id === file)?.name
//             zip.file(fileName, buf);
//         }

//         const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

//         const blob = new Blob([zipBuffer], { type: "application/zip" });

//         console.log("Архив успешно создан!");
//         return blob;
//     } catch (error) {
//         console.error("Ошибка обработки файлов:", error.message);
//         if (error.properties && error.properties.errors) {
//             error.properties.errors.forEach((e) => {
//                 console.error(e);
//             });
//         }
//         throw error;
//     }
// }