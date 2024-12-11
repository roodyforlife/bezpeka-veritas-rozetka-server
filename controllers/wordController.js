import path from "path";
import { wordFilesDir } from "../consts.js";
import WordService from "../services/WordService.js";
import { uploadFile } from "../utils/uploadFile.js";
import fs from 'fs';

const wordService = new WordService();

function wordController(app) {
    app.post("/word/upload", uploadFile.single("file"), (req, res) => {
        if (!req.file) {
          return res.status(400).send("Файл не был загружен");
        }
        res.send({ message: "Файл успешно загружен", file: req.file });
      });
      
      app.get("/word/download/:id", (req, res) => {
        const fileId = req.params.id;
        const filePath = path.join(wordFilesDir, fileId);
      
        if (!fs.existsSync(filePath)) {
          return res.status(404).send("Файл не найден");
        }
      
        res.download(filePath, (err) => {
          if (err) {
            console.error("Ошибка при скачивании файла:", err);
            res.status(500).send("Ошибка при скачивании файла");
          }
        });
      });
      
      app.get("/word/files", async (req, res) => {
        const result = await wordService.getFiles();
        res.send(result);
      })

      app.delete("/word/file/:id", (req, res) => {
        try {
            wordService.remove(req.params.id)
            res.send(200)
        } catch (error) {
            res.send(500)
        }
      })

      app.post("/word/download", async (req, res) => {
        try {
            const dtoResult = req.body;
            const zipBlob = await wordService.getResult(dtoResult.selectedFiles, dtoResult.selectedTemplate);
            const buffer = Buffer.from(await zipBlob.arrayBuffer());
            res.setHeader("Content-Type", "application/zip");
            res.setHeader("Content-Disposition", "attachment; filename=download.zip");
    
            res.send(buffer);
        } catch (error) {
            console.error("Ошибка:", error);
            res.status(500).send("Ошибка при обработке запроса");
        }
    });
}

export default wordController;