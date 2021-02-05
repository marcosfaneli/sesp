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
            const rs = await knex('artistes')
                .select({
                          album: 'albums.name', 
                          year: 'albums.year', 
                          artiste: 'artistes.name', 
                          label: 'albums.label',
                          id: 'artistes.id',
                          albumId: 'albums.id'
                        })
                .join('albums', 'artistes.id','=','albums.artiste_id')
                .whereRaw(`LOWER(artistes.name) LIKE ? OR LOWER(albums.name) LIKE ? `, [search, search])
                .orderBy('artistes.name','asc')
                .paginate({ perPage, currentPage })

            const data = rs.data.map(item => {
                    return {
                        ...item,
                        image_url: `https://play.min.io/album-files-bucket/${item.label}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=Q3AM3UQ867SPQQA43P2F%2F20210205%2F%2Fs3%2Faws4_request&X-Amz-Date=20210205T014348Z&X-Amz-Expires=432000&X-Amz-SignedHeaders=host&X-Amz-Signature=f4b6387ab0bdc11a52378b70fe5991ef7cedf2e727cd73765ea0bd0c115d6cfe`
                    }
                })
            
            return res.send({data, pagination: rs.pagination})

        }catch(err){
            console.log(err)
            return res.status(400).send({error: "Erro ao consultar"})
        }
    }

    async create(req: Request, res: Response) {
        const { artiste, albums } = req.body

        if ((await knex('artistes').whereRaw(`LOWER(artistes.name) = ? `, [artiste.toString().toLowerCase()])).length > 0){
            return res.status(400).send({ error: 'Artista já cadastrado'})
        }

        const trx = await knex.transaction()
        try {
            const rs = await trx('artistes').insert({ name: artiste },'id')

            const artisteId = rs[0]

            const items = await Promise.all(
                albums.map(async (item: { name: string; year: number; label: string }) => {
                    return  { name: item.name, year: item.year, artiste_id: artisteId, label: item.label }
                })
            )

            await trx('albums').insert(items)

            trx.commit()

            return res.send({ id: artisteId, name: artiste, albums: items })
        } catch (error) {
            console.log(error)
            trx.rollback()
            return res.status(400).send({ error: 'Erro ao registrar artista' })
        }
    }

    async update(req: Request, res: Response) {

        const id = req.params.id

        if ((await knex('artistes').where(`id`, '=', id)).length == 0){
            return res.status(400).send({ error: 'Artista não existe'})
        }

        const {artiste, albums } = req.body

        const trx = await knex.transaction()
        try {
            const rs = await trx('artistes').update({ name: artiste }).where({id: id})

            const items = await Promise.all(
                albums.map(async (item: { name: string; year: number; label: string, id: number }) => {
                    const album = { name: item.name, year: item.year, artiste_id: id, label: item.label }
                    
                    await trx('albums').update(album).where({id: item.id})

                    return album
                })
            )

            trx.commit()

            return res.send({ id: id, name: artiste, albums: items })
        } catch (error) {
            console.log(error)
            trx.rollback()
            return res.status(400).send({ error: 'Erro ao atualizar artista' })
        }
    }

    async delete(req: Request, res: Response) {
        const id = req.params.id

        const trx = await knex.transaction()
        try {
            await trx('albums').delete().where({artiste_id: id})

            await trx('artistes').delete().where({ id: id })

            trx.commit()

            return res.send({ sucess: true })
        } catch (error) {
            console.log(error)
            trx.rollback()
            return res.status(400).send({ error: 'Erro ao remover artista' })
        }
    }
}

export default ArtisteController