import express from 'express';
import path from 'path';
import fetch from 'node-fetch';
import xml2js from 'xml2js'
import cors from 'cors';
import fs from 'fs/promises'
import {default as sfs} from 'fs'

const app = express();
const PORT = 8080;

  app.use(cors());

// Обслуживаем XML-файл
app.get('/feed.xml', async (req, res) => {
  try {
    const datafilePath = path.join('./', 'data.xml');
    const fileData = await fs.readFile(datafilePath, 'utf8');
    res.set('Content-Type', 'application/xml');
    res.send(fileData);
  } catch (error) {
    res.send(error);
  }
});

app.get('/stream/feed.xml', async (req, res) => {
  try {
    const datafilePath = path.join('./', 'data.xml');
    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Content-Disposition', 'inline; filename="feed.xml"');
    
    const readStream = sfs.createReadStream(datafilePath, 'utf8');

    readStream.on('error', (err) => {
      console.error('Ошибка при чтении файла:', err);
      res.status(500).send('Ошибка сервера');
    });

    readStream.pipe(res);
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).send('Ошибка сервера');
  }
});

app.get('/get_all_categories', async (req, res) => {
  try {
    const datafilePath = path.join('./', 'data.xml');
    const xmlData = await fs.readFile(datafilePath, 'utf8');
    const result = await xml2js.parseStringPromise(xmlData);
    try {
        const filePath = path.join('', 'settings.json');
        const fileData = await fs.readFile(filePath, 'utf8');
        const settingData = JSON.parse(fileData);
        if (result.yml_catalog?.shop?.[0]?.offers?.[0]?.offer) {
            const categories = result.yml_catalog.shop[0].categories[0].category;
            const offers = result.yml_catalog.shop[0].offers[0].offer;
            const categoriesArray = categories.map(category => {
                const categoryFromJson = settingData.find(({id}) => id.toString() === category.$.id.toString())
    
                return {
                    id: category.$.id,
                    parentId: category.$.parentId,
                    name: category._,
                    checked: categoryFromJson?.checked || false,
                    percent: categoryFromJson?.percent || "0"
                }
            });
    
            const filteredCategories = categoriesArray.filter(category => {
                return offers.some(offer => offer.categoryId.toString() === category.id);
            });
          
        res.set('Content-Type', 'text/json');
        res.send(filteredCategories);
          } else {
            res.status(500).send('Данные в XML некорректны');
          }
      } catch (err) {
        if (err.code !== 'ENOENT') {
          return res.status(500).send('Ошибка при чтении файла');
        }
      }
  } catch (error) {
    console.error('Ошибка:', error);
    res.status(500).send('Не удалось загрузить XML.');
  }
})

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

app.use(express.json());


app.post('/settings', async (req, res) => {
    const settingsData = req.body;
    const filePath = path.join('', 'settings.json');
    let currentData = [];
    currentData.push(...settingsData);
    try {
        await fs.writeFile(filePath, JSON.stringify(currentData, null, 2), "utf8")
        res.status(200).send('Данные успешно сохранены');
    } catch (error) {
        return res.status(500).send('Ошибка при записи в файл');
    }
})

async function fetchProductsAsync() {
  const response = await fetch(
    "https://bezpeka-veritas.in.ua/products_feed.xml?hash_tag=4f482c6bb1330a1ad5e7bc61763328f8&sales_notes=&product_ids=&label_ids=10827772&exclude_fields=description&html_description=0&yandex_cpa=&process_presence_sure=&languages=ru&group_ids="
  )

  try {
    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.statusText}`);
    }

    const xmlData = await response.text();
    const result = await xml2js.parseStringPromise(xmlData);
    if (result.yml_catalog?.shop?.[0]?.offers?.[0]?.offer) {
        const offers = result.yml_catalog.shop[0].offers[0].offer;
  
        const settingsfilePath = path.join('', 'settings.json');
        let settingData = [];
  
        try {
          const fileData = await fs.readFile(settingsfilePath, 'utf8');
          settingData = JSON.parse(fileData);
        } catch (err) {
          if (err.code !== 'ENOENT') {
            return res.status(500).send('Ошибка при чтении файла');
          }
        }
  
        for (const offer of offers) {
          if (offer.price?.[0]) {
            const currentCategory = settingData.find(
              (cat) => cat.id.toString() === offer.categoryId?.[0]?.toString()
            );
  
            if (currentCategory) {
              offer.price[0] = Math.round(parseInt(offer.price[0]) * (1 + (currentCategory.percent / 100)))
            }
          }
        }
  
        const builder = new xml2js.Builder();
        const updatedXml = builder.buildObject(result);
        const datafilePath = path.join('./', 'data.xml');
        await fs.writeFile(datafilePath, updatedXml, 'utf8');
      } else {
        console.error('Ошибка');
      }
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

setInterval(fetchProductsAsync, 1800000);
fetchProductsAsync()