import express from 'express'
import cors from 'cors'
import { errors } from "celebrate"

const app = express()

app.use(cors())
app.use(express.json())

app.get('/',(req,res) => {
    return res.send({status:"online"})
})

app.use(errors())

app.listen(3333)