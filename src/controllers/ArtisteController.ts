import { Request, Response } from "express"
import knex from "../database/connection"

class ArtisteController {
    
    async page(req: Request, res: Response) {
        
        let {search, page, size} = req.query

        if (!search){
            return res.status(400).send({error: "Não informada sentença para consulta"})
        }

        if (search.toString().trim().length < 3){
            return res.status(400).send({error: "Não informada sentença para consulta"})
        }

        search = `%${search.toString().trim().toLocaleLowerCase()}%`

        const perPage = size ? Number(size) : 10

        const currentPage = page ? Number(page) : 1

        try{
            const results = await knex('artistes')
                .select({
                          album: 'albums.name', 
                          year: 'albums.year', 
                          artiste: 'artistes.name', 
                          label: 'albums.label'
                        })
                .join('albums', 'artistes.id','=','albums.artiste_id')
                .whereRaw(`LOWER(artistes.name) LIKE ? OR LOWER(albums.name) LIKE ? `, [search, search])
                .paginate({ perPage, currentPage })
            
            return res.send(results)

        }catch(err){
            console.log(err)
            return res.status(400).send({error: "Erro ao consultar"})
        }
    }

    async create(req: Request, res: Response) {
        const { artiste, albums } = req.body

        const trx = await knex.transaction()
        try {
            const rs = await trx('artistes').insert({ name: artiste })

            const artisteId = rs[0]

            const items = await Promise.all(
                albums.map(async (item: { name: string; year: number }) => {
                    return  { name: item.name, year: item.year, artiste_id: artisteId }
                })
            )

            await trx('albums').insert(items)

            trx.commit()

            return res.send({ id: artisteId, name: artiste, albums: items })
        } catch (error) {
            console.log(error)
            trx.rollback()
            return res.status(400).send({ error: 'Erro ao registrar o usuário' })
        }
    }

    async create2(req: Request, res: Response) {
        const { artiste, albums } = req.body

        const trx = await knex.transaction()
        try {
            const rs = await trx('artistes').insert({ name: artiste })

            const artisteId = rs[0]

            const items = await Promise.all(
                albums.map(async (item: { name: string; year: number }) => {
                    return  { name: item.name, year: item.year, artiste_id: artisteId }
                })
            )

            await trx('albums').insert(items)

            trx.commit()

            return res.send({ id: artisteId, name: artiste, albums: items })
        } catch (error) {
            console.log(error)
            trx.rollback()
            return res.status(400).send({ error: 'Erro ao registrar o usuário' })
        }
    }

    async update(req: Request, res: Response) {
        return res.send({ ok: 'ok' })
    }
}

export default ArtisteController