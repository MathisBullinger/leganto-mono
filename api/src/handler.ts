import { schema } from './graphql'
import { graphql } from 'graphql'
import { oneOf } from 'froebel'
import resolvers, { createContext } from './resolvers'
import type {
  APIGatewayProxyEvent,
  Handler,
  APIGatewayProxyResult,
} from 'aws-lambda'

export const handler: Handler<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = async event => {
  let request: Record<string, string | undefined> = {}

  if (event.httpMethod === 'POST' && typeof event.body === 'string') {
    try {
      request = JSON.parse(event.body)
    } catch (e) {
      console.error('failed to parse query', e)
      return respond(400)
    }
  }

  if (event.httpMethod === 'GET') {
    request = event.queryStringParameters ?? {}
  }

  if (!isValid(request)) return respond(400)
  return await resolve(request)
}

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

const resolve = async (request: GQLRequest) => {
  try {
    const context = createContext()
    const result = await graphql({
      schema,
      rootValue,
      contextValue: context,
      source: request.query,
      operationName: request.operationName,
      variableValues: request.variables,
    })
    return respond(200, JSON.stringify(result), context.getHeaders())
  } catch (e) {
    console.error('failed to resolve query', e)
    return respond(500)
  }
}

const respond = (
  statusCode: number,
  body: string = '',
  data: Partial<APIGatewayProxyResult> = {}
) => ({
  statusCode,
  body,
  ...data,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    ...data.headers,
  },
})
