import { EPICENTR_TYPE, epicentrCategoriesFile, HOTLINE_TYPE, hotlineCategoriesFile, ROZETKA_TYPE, rozetkaCategoriesFile } from "../consts.js";
import fs from 'fs/promises'
import { updateXMLFile } from "./updateXMLFile.js";
import xml2js from 'xml2js'

export async function fetchCategories(dataType, xmlData) {
    let filePath;
    switch (dataType) {
      case EPICENTR_TYPE:
        filePath = epicentrCategoriesFile;
        break;
      case HOTLINE_TYPE:
        filePath = hotlineCategoriesFile;
        break;
      case ROZETKA_TYPE:
        filePath = rozetkaCategoriesFile;
        break;
    }
  
    if (!filePath) {
      console.error('Ошибка');
    }
  
    const result = await xml2js.parseStringPromise(xmlData);
    const categoriesFromJson = await fs.readFile(filePath, "utf8");
  
    const jsonCategories = JSON.parse(categoriesFromJson);
  
    if (result.yml_catalog?.shop?.[0]?.offers?.[0]?.offer) {
      const categories = result.yml_catalog.shop[0].categories[0].category;
      const categoriesArray = categories.map(category => {
          const currentCategory = jsonCategories.find((jsonCategory) => jsonCategory.id === category.$.id)
          if (currentCategory) {
            return currentCategory
          } else {
            return {
              id: category.$.id,
              parentId: category.$.parentId,
              name: category._,
              checked: false,
              percent: "0",
              secondName: ""
            }
          }
      });
  
      await fs.writeFile(filePath, JSON.stringify(categoriesArray), "utf8");
      await updateXMLFile(dataType)
    } else {
      res.status(500).send('Данные в XML некорректны');
    }
  }