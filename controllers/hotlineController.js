import { hotlineCategoriesFile, hotlineFile } from "../consts.js";
import { getCategoryFile } from "../utils/getCategoryFile.js";
import { getXmlStream } from "../utils/getXmlStream.js";
import { updateCategoriesFile } from "../utils/updateCategoriesFile.js";

function hotlineController(app) {
    app.get('/stream/hotline/feed.xml', async (req, res) => {
        await getXmlStream(res, hotlineFile)
    });

    app.get('/hotline/categories', async (req, res) => {
      await getCategoryFile(res, hotlineCategoriesFile)
    });

    app.post('/hotline/categories', async (req, res) => {
        await updateCategoriesFile(req, res, hotlineCategoriesFile)
    });
}

export default hotlineController;