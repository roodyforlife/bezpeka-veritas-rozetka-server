import TemplateService from "../services/TemplateService.js"
import multer from 'multer';

const templateService = new TemplateService()
const upload = multer();

function templateController(app) {
    app.get("/templates", async (req, res) => {
        const templates = await templateService.getAll()
        res.send(templates)
    })

    app.post("/template", upload.any(), async (req, res) => {
        try {
            const template = JSON.parse(req.body.template);
            if (req.files[0]) {
                template.image = req.files[0].buffer
            }

            await templateService.add(template)
            res.send(200)
        } catch (error) {
            res.send(500)
        }
    })

    app.put("/template", upload.any(), async (req, res) => {
        try {
            const template = JSON.parse(req.body.template);
            if (req.files[0]) {
                template.image = req.files[0].buffer
            }

            await templateService.edit(template)
            res.send(200)
        } catch (error) {
            res.send(500)
        }
    })

    app.delete("/template/:id", async (req, res) => {
        try {
            const id = req.params.id
            await templateService.remove(id)
            res.send(200)
        } catch (error) {
            res.send(500)
        }
    })
}

export default templateController;