import Knex from 'knex'

export async function up(knex: Knex){
    return knex.schema.createTable('albums', table => {
        table.increments('id').primary()
        table.string('name').notNullable
        table.integer('year').notNullable
        table.string('label').notNullable
        table.integer('artiste_id').notNullable().unsigned().index().references('id').inTable('artistes')
    })
}

export async function down(knex: Knex){
    return knex.schema.dropTable('albums')
}