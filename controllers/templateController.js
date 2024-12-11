import TemplateService from "../services/TemplateService.js"

const templateService = new TemplateService()

function templateController(app) {
    app.get("/templates", async (req, res) => {
        const templates = await templateService.getAll()
        res.send(templates)
    })

    app.post("/template", async (req, res) => {
        try {
            const template = req.body
            await templateService.add(template)
            res.send(200)
        } catch (error) {
            res.send(500)
        }
    })

    app.put("/template", async (req, res) => {
        try {
            const template = req.body
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