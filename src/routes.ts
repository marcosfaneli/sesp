import express from "express"
import multerConfig from "./config/multerConfig"

import AuthToken from "./middlware/AuthToken"
import AuthController from './controllers/AuthController'
import ArtisteController from './controllers/ArtisteController'
import UploadController from "./controllers/UploadController"

const routes = express.Router()

const authToken = new AuthToken()
const authController = new AuthController()
const artisteController = new ArtisteController()
const uploadController = new UploadController()

routes.post('/register', authController.register)
routes.post('/authenticate', authController.authenticate)

routes.use(authToken.validateToken)

routes.get('/artistes', artisteController.page)
routes.post('/artistes', artisteController.create)
routes.put('/artistes', artisteController.update)

routes.post('/upload', multerConfig.single('file'),uploadController.upload)

export default routes