import Knex from 'knex'
import { Model } from 'objection'
export * from './models'

const knex = Knex({
  client: 'postgresql',
  connection: {
    port: parseInt(process.env.DB_PORT!),
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  },
})

Model.knex(knex)
