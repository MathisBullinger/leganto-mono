import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('story', table => {
    table.text('id').primary()
    table.text('author').references('user.id')
    table.boolean('isDraft').notNullable().defaultTo(false)
    table.text('revises').references('story.id')
    table.text('title')
    table.text('content')
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('story')
}
