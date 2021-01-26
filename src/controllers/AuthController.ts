import { Request, Response } from "express"
import knex from '../database/connection'
import generateToken from "../middlware/auth";

class AuthController {
    async register(req: Request, res: Response) {
        const { name, email, password } = req.body

        let user = {name, email, password}

        const trx = await knex.transaction()
        try{
            if (await knex('users').where('email', email)){
                return res.status(400).send({ error: 'Usuário já existe'})
            }

            user = await trx('users').insert({ name, email, password })

            const token = generateToken({ id: user.email})

            user.password = undefined

            trx.commit()

            return res.send({user, token})
        }catch(error){
            console.log(error)
            trx.rollback()
            return res.status(400).send({error: 'Erro ao registrar o usuário'})
        }
    }

    async authenticate(req: Request, res: Response) {
        res.send({success: true})
    }
}

export default AuthController