import express, { Response } from 'express'
import { schema } from './graphql'
import { graphql } from 'graphql'
import oneOf from 'froebel/oneOf'
import resolvers, { createContext } from './resolvers'

const app = express()
app.use(express.json())

app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Origin',
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://leganto.com'
  )
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  next()
})

app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.sendStatus(204)
})

app.post('/', async (req, res) => {
  if (!isValid(req.body)) return res.sendStatus(400)
  return await resolve(req.body, res)
})

app.get('/', async (req, res) => {
  if (!isValid(req.query)) return res.sendStatus(400)
  return await resolve(req.query, res)
})

app.listen(7001)

type GQLRequest = {
  query: string
  operationName?: string
  variables?: Record<string, unknown>
}

const isValid = (request: any): request is GQLRequest => {
  if (typeof request !== 'object' || request === null) return false
  if (typeof request.query !== 'string') return false
  if (oneOf(request.operationName, null, undefined))
    delete request.operationName
  if ('operationName' in request && typeof request.operationName !== 'string')
    return false
  return true
}

const rootValue = { ...resolvers.Query, ...resolvers.Mutation }

const resolve = async (gqlRequest: GQLRequest, res: Response) => {
  try {
    const context = createContext()
    const result = await graphql({
      schema,
      rootValue,
      contextValue: context,
      source: gqlRequest.query,
      operationName: gqlRequest.operationName,
      variableValues: gqlRequest.variables,
    })
    for (const [name, values] of context.headers) {
      for (const value of values) {
        res.setHeader(name, value)
      }
    }
    res.setHeader('Content-Type', 'application/json')
    return res.status(200).send(JSON.stringify(result))
  } catch (e) {
    console.error('failed to resolve query', e)
    return res.status(500)
  }
}
