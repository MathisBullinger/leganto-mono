import express, { Response } from 'express'
import { schema } from './graphql'
import { graphql } from 'graphql'
import oneOf from 'froebel/oneOf'
import resolvers, { createContext } from './resolvers'
import { IncomingHttpHeaders } from 'http'

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
  return await resolve(req.body, res, req.headers)
})

app.get('/', async (req, res) => {
  if (!isValid(req.query)) return res.sendStatus(400)
  return await resolve(req.query, res, req.headers)
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

const resolve = async (
  gqlRequest: GQLRequest,
  res: Response,
  headers: IncomingHttpHeaders
) => {
  const headerMap = new Map(
    Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])
  )
  const rawCookies = headerMap.get('cookie')
  const cookies = Object.fromEntries(
    (!rawCookies
      ? []
      : typeof rawCookies === 'string'
      ? rawCookies.split('; ')
      : rawCookies
    )
      .map(cookie => cookie.split('='))
      .map(([k, v]) => [k.trim(), v])
  )

  try {
    const context = createContext(cookies)
    const result = await graphql({
      schema,
      rootValue,
      contextValue: context,
      source: gqlRequest.query,
      operationName: gqlRequest.operationName,
      variableValues:
        typeof gqlRequest.variables === 'string'
          ? JSON.parse(gqlRequest.variables)
          : gqlRequest.variables,
    })
    for (const [name, values] of context.headers) {
      for (const value of values) {
        res.setHeader(name, value)
      }
    }

    result.errors?.forEach(error => console.log('gql error:', error))

    res.setHeader('Content-Type', 'application/json')
    return res.status(200).send(JSON.stringify(result))
  } catch (e) {
    console.error('failed to resolve query', e)
    return res.status(500)
  }
}
