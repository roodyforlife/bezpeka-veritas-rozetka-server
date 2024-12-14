import express from 'express';
import cors from 'cors';
import { fetchProductsAsync } from './utils/fetchProductsAsync.js';
import wordController from './controllers/wordController.js';
import rozetkaController from './controllers/rozetkaController.js';
import hotlineController from './controllers/hotlineController.js';
import epicentrController from './controllers/epicentrController.js';
import templateController from './controllers/templateController.js';
import HTTP from 'http';

const WebServer = HTTP.createServer();

const app = express();
const PORT = 8080;
// WebServer.listen(PORT, "127.1.3.19")

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