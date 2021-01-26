import express from "express"

import AuthController from './controllers/AuthController'

const routes = express.Router()

const authController = new AuthController()

routes.post('/register', authController.register)
routes.post('/authenticate', authController.authenticate)

export default routes