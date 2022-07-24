import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user', table => {
    table.text('id').primary()
    table.text('name').notNullable().unique()
  })

  await knex.schema.createTable('signin_google', table => {
    table.text('googleId').primary()
    table.text('userId').notNullable().references('user.id').onDelete('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('signin_google')
  await knex.schema.dropTable('user')
}
