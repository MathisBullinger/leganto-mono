import express, { Response } from 'express'
import { schema } from './graphql'
import { graphql } from 'graphql'
import oneOf from 'froebel/oneOf'
import resolvers, { createContext } from './resolvers'

const app = express()
app.use(express.text())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  next()
})

app.post('/', async (req, res) => {
  let request: Record<string, string | undefined> = {}

  try {
    request = JSON.parse(req.body)
  } catch (e) {
    console.error('failed to parse query', e)
    return res.sendStatus(400)
  }

  if (!isValid(request)) return res.sendStatus(400)
  return await resolve(request, res)
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
