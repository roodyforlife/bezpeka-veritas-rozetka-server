import path from 'path';

export const defaultLink = "https://bezpeka-veritas.in.ua/products_feed.xml?hash_tag=4f482c6bb1330a1ad5e7bc61763328f8&sales_notes=&product_ids=&label_ids=10827772&exclude_fields=description&html_description=0&yandex_cpa=&process_presence_sure=&languages=ru&group_ids="
export const promFile = path.join('./data', 'data.xml')

export const epicentrCategoriesFile = path.join('./data/epicentr', 'categories.json')
export const rozetkaCategoriesFile = path.join('./data/rozetka', 'categories.json')
export const hotlineCategoriesFile = path.join('./data/hotline', 'categories.json')

export const epicentrFile = path.join('./data/epicentr', 'epicentr.xml')
export const rozetkaFile = path.join('./data/rozetka', 'rozetka.xml')
export const hotlineFile = path.join('./data/hotline', 'hotline.xml')

export const wordFilesDir = path.join('./data/word/files')
export const wordFilesJsonFile = path.join('./data/word/files.json')
export const templatesFile = path.join('./data/word/templates.json')

export const EPICENTR_TYPE = "epicentr"
export const HOTLINE_TYPE = "hotline"
export const ROZETKA_TYPE = "rozetka"