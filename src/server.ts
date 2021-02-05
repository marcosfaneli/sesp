import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { errors } from "celebrate"
import { attachPaginate } from "knex-paginate"

import routes from './routes'

attachPaginate()

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(routes)

app.use(errors())

const port = process.env.PORT

app.listen(port, () => {
    console.log('Servidor on line')
})