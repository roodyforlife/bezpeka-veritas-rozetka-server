import multer from "multer";
import { wordFilesDir, wordFilesJsonFile } from "../consts.js";
import { randomUUID } from "crypto";
import fs from 'fs/promises';
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, wordFilesDir);
    },
    filename: async (req, file, cb) => {
      const originalName = Buffer.from(file.originalname, "latin1").toString("utf8");
      const fileExtension = path.extname(originalName);
      const generatedId = `${randomUUID()}${fileExtension}`;
  
      await writeNewFile(generatedId, originalName);
      cb(null, generatedId);
    },
  });

export const uploadFile = multer({ storage });

async function writeNewFile(id, name) {
    try {
        const content = await fs.readFile(wordFilesJsonFile, "utf8")
        const jsonFiles = JSON.parse(content)
        jsonFiles.push({
            id: id,
            name: name
        })

        await fs.writeFile(wordFilesJsonFile, JSON.stringify(jsonFiles), "utf8")
    } catch (error) {
        console.log(error)
    }
}
