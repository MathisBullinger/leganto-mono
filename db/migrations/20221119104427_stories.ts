import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('story', table => {
    table.text('id').primary()
    table.text('author').references('user.id')
    table.boolean('isDraft').notNullable().defaultTo(false)
    table.text('revises').references('story.id')
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated').notNullable().defaultTo(knex.fn.now())
  })

  const langs = ['de', 'en', 'es', 'fr', 'it', 'pt', 'nl']
  await knex.schema.raw(
    `CREATE TYPE language as ENUM (${langs
      .map(lang => `'${lang}'`)
      .join(', ')})`
  )

  await knex.schema.createTable('translation', table => {
    table.text('story').notNullable().references('story.id').onDelete('CASCADE')
    table.specificType('language', 'language').notNullable()
    table.primary(['story', 'language'])
    table.text('title')
    table.text('content')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('story')
  await knex.schema.dropTable('translation')
  await knex.schema.raw('DROP TYPE language')
}
