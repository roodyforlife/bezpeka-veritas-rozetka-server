import { epicentrCategoriesFile, epicentrFile } from "../consts.js";
import { getCategoryFile } from "../utils/getCategoryFile.js";
import { getXmlStream } from "../utils/getXmlStream.js";
import { updateCategoriesFile } from "../utils/updateCategoriesFile.js";

function epicentrController(app) {
    app.get('/stream/epicentr/feed.xml', async (req, res) => {
        await getXmlStream(res, epicentrFile)
    });
    
    app.get('/epicentr/categories', async (req, res) => {
        await getCategoryFile(res, epicentrCategoriesFile)
    });

    app.post('/epicentr/categories', async (req, res) => {
        await updateCategoriesFile(req, res, epicentrCategoriesFile)
    });
}

export default epicentrController;