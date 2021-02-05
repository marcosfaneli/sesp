import { Request, Response, Errback } from "express"

class UploadController {
    async upload (req: Request, res: Response, err: Errback){
        console.log(err)

        try {
            const { originalname: name, size, filename: key } = req.file
            return res.send({ name })
        } catch (e) {
            console.error(e)
            return res.status(400).send({ error: 'Error uploading files' })
        }
    }
}

export default UploadController