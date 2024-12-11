import fetch from "node-fetch";
import { defaultLink, EPICENTR_TYPE, HOTLINE_TYPE, promFile, ROZETKA_TYPE } from "../consts.js";
import fs from 'fs/promises'
import { fetchCategories } from "./fetchCategories.js";

export async function fetchProductsAsync() {
    const response = await fetch(defaultLink)
  
    try {
      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.statusText}`);
      }
  
      const xmlData = await response.text();
      await fs.writeFile(promFile, xmlData, 'utf8');
      await fetchCategories(EPICENTR_TYPE, xmlData)
      await fetchCategories(ROZETKA_TYPE, xmlData)
      await fetchCategories(HOTLINE_TYPE, xmlData)
    } catch (error) {
          console.error('Ошибка:', error);
        }
  }