import { EPICENTR_TYPE, epicentrCategoriesFile, epicentrFile, HOTLINE_TYPE, hotlineCategoriesFile, hotlineFile, promFile, ROZETKA_TYPE, rozetkaCategoriesFile, rozetkaFile } from "../consts.js";
import fs from 'fs/promises'
import xml2js from 'xml2js'

export async function updateXMLFile(dataType) {
    const promXmlData = await fs.readFile(promFile, "utf8");
    const result = await xml2js.parseStringPromise(promXmlData);
    let settingsfilePath;
    let xmlFilePath;
  
    switch (dataType) {
      case EPICENTR_TYPE:
        settingsfilePath = epicentrCategoriesFile
        xmlFilePath = epicentrFile
      break;
      case HOTLINE_TYPE:
        settingsfilePath = hotlineCategoriesFile
        xmlFilePath = hotlineFile
      break;
      case ROZETKA_TYPE:
        settingsfilePath = rozetkaCategoriesFile
        xmlFilePath = rozetkaFile
      break;
    }
  
    if (!settingsfilePath || !xmlFilePath) {
      console.error('Ошибка');
    }
    
    if (result.yml_catalog?.shop[0]?.offers?.[0]?.offer) {
      const offers = result.yml_catalog.shop[0].offers[0].offer;
      const categories = result.yml_catalog.shop[0].categories[0].category;
      let settingData = [];
  
      try {
        const fileData = await fs.readFile(settingsfilePath, 'utf8');
        settingData = JSON.parse(fileData);
      } catch (err) {
        if (err.code !== 'ENOENT') {
          return res.status(500).send('Ошибка при чтении файла');
        }
      }
  
      const updatedCategories = categories.map((category) => {
        const currentCategory = settingData.find((cat) => cat.id.toString() === category.$.id?.toString());
        if (currentCategory) {
          return {
            ...category,
            _: `${currentCategory.secondName || category._}`,
          }
        }
  
        return category
      })
  
      const updatedOffers = offers
      .filter((offer) => {
        if (offer.price?.[0]) {
          const currentCategory = settingData.find(
            (cat) => cat.id.toString() === offer.categoryId?.[0]?.toString()
          );
          return currentCategory?.checked; // Сохраняем только те, где `checked === true`
        }
        return false; // Пропускаем элементы без `price`
      })
      .map((offer) => {
        const currentCategory = settingData.find(
          (cat) => cat.id.toString() === offer.categoryId?.[0]?.toString()
        );
  
        // Обновляем цену
        return {
          ...offer,
          price: [
            Math.round(
              parseInt(offer.price[0]) * (1 + currentCategory.percent / 100)
            ),
            ...offer.price.slice(1), // Сохраняем остальные элементы, если они есть
          ],
        };
      });
    
      // Преобразование обновленного массива в XML
      result.yml_catalog.shop[0].offers[0].offer = updatedOffers; // Обновляем объект
      result.yml_catalog.shop[0].categories[0].category = updatedCategories;
      const builder = new xml2js.Builder();
      const updatedXml = builder.buildObject(result);
    
      // Запись XML в файл
      await fs.writeFile(xmlFilePath, updatedXml, 'utf8');
      console.log(`LOG: data.xml file is updated ${Date.now()}`);
    } else {
      console.error('Ошибка');
    }
  }