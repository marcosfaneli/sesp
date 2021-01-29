import express from "express"
import cors from "cors"

import AuthToken from "./middlware/AuthToken"
import AuthController from './controllers/AuthController'
import ArtisteController from './controllers/ArtisteController'

const routes = express.Router()

const authToken = new AuthToken()
const authController = new AuthController()
const artisteController = new ArtisteController()

routes.post('/register', authController.register)
routes.post('/authenticate', authController.authenticate)

routes.use(authToken.validateToken)

routes.get('/artistes', artisteController.page)
routes.post('/artistes', artisteController.create)
routes.put('/artistes', artisteController.update)

export default routes