import { Request, Response } from "express"
import knex from "../database/connection"
import AuthToken from "../middlware/AuthToken"
import * as bcrypt from "bcryptjs"

class AuthController {
    async register(req: Request, res: Response) {
        const { name, email, password } = req.body

        if ((await knex('users').where('email', email)).length > 0){
            return res.status(400).send({ error: 'Usuário já existe'})
        }

        const trx = await knex.transaction()
        try{
            const hash = await bcrypt.hash(password, 10)

            const rs = await trx('users').insert({ name, email, password: hash })

            const token = new AuthToken().generateToken({ id: rs[0] })

            trx.commit()

            return res.send({id: rs[0], name, email, token})
        }catch(error){
            console.log(error)
            trx.rollback()
            return res.status(400).send({error: 'Erro ao registrar o usuário'})
        }
    }

    async authenticate(req: Request, res: Response) {
        const { email, password } = req.body

        try{
            const rs = await knex('users').where('email', email)
            
            if (rs.length == 0){
                return res.status(400).send({ error: 'Usuário não existe'})
            }

            const {id, name, password: hash } = rs[0]

            if (!await bcrypt.compare(password, hash)){
                return res.status(400).send({error: 'Senha inválida'})
            }
            
            const token = new AuthToken().generateToken({ id: id })
           
            return res.send({id, name, token})
        }catch(error){
            console.log(error)
            return res.status(400).send({error: 'Erro ao registrar o usuário'})
        }
    }
}

export default AuthController