import { schema } from './graphql'
import { graphql } from 'graphql'
import { oneOf } from 'facula'
import resolvers from './resolvers'
import type {
  APIGatewayEvent,
  Handler,
  APIGatewayProxyResult,
} from 'aws-lambda'

export const handler: Handler<
  APIGatewayEvent,
  APIGatewayProxyResult
> = async event => {
  let request: Record<string, string>

  if (event.httpMethod === 'POST' && typeof event.body === 'string') {
    try {
      request = JSON.parse(event.body)
    } catch (e) {
      console.error('failed to parse query', e)
      return respond(400)
    }
  }

  if (event.httpMethod === 'GET') {
    request = event.queryStringParameters
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
  console.log('resolve', request)
  try {
    const result = await graphql({
      schema,
      rootValue,
      contextValue: {},
      source: request.query,
      operationName: request.operationName,
      variableValues: request.variables,
    })
    return respond(200, JSON.stringify(result))
  } catch (e) {
    console.error('failed to resolve query', e)
    return respond(500)
  }
}

const respond = (statusCode: number, body?: string) => ({
  statusCode,
  body,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
})
