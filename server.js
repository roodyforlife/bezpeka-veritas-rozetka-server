import express from 'express';
import cors from 'cors';
import { fetchProductsAsync } from './utils/fetchProductsAsync.js';
import wordController from './controllers/wordController.js';
import rozetkaController from './controllers/rozetkaController.js';
import hotlineController from './controllers/hotlineController.js';
import epicentrController from './controllers/epicentrController.js';
import templateController from './controllers/templateController.js';

const app = express();
const PORT = 8080;

  app.use(cors());

  app.use(express.json());
  rozetkaController(app)
  hotlineController(app)
  epicentrController(app)
  wordController(app);
  templateController(app)

  app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
  });

  setInterval(fetchProductsAsync, 1800000);
  fetchProductsAsync()

// app.post('/settings', async (req, res) => {
//     const settingsData = req.body;
//     const filePath = path.join('', 'settings.json');
//     let currentData = [];
//     currentData.push(...settingsData);
//     console.log(`LOG: push the new settings ${Date.now()}`, currentData)
//     try {
//         await fs.writeFile(filePath, JSON.stringify(currentData, null, 2), "utf8")
//         res.status(200).send('Данные успешно сохранены');
//     } catch (error) {
//         return res.status(500).send('Ошибка при записи в файл');
//     }
// })
