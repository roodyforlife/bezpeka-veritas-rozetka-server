import { rozetkaCategoriesFile, rozetkaFile } from "../consts.js";
import { getCategoryFile } from "../utils/getCategoryFile.js";
import { getXmlStream } from "../utils/getXmlStream.js";
import { updateCategoriesFile } from "../utils/updateCategoriesFile.js";

function rozetkaController(app) {
    app.get('/stream/rozetka/feed.xml', async (req, res) => {
        await getXmlStream(res, rozetkaFile)
    });

    app.get('/rozetka/categories', async (req, res) => {
        await getCategoryFile(res, rozetkaCategoriesFile)
    });

    app.post('/rozetka/categories', async (req, res) => {
        await updateCategoriesFile(req, res, rozetkaCategoriesFile)
    });
}

export default rozetkaController;