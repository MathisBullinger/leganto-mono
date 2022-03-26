import { schema } from './graphql'
import { graphql } from 'graphql'
import type {
  APIGatewayEvent,
  Handler,
  APIGatewayProxyResult,
} from 'aws-lambda'

const rootValue = {
  hello: () => {
    return 'Hello world!'
  },
}

export const handler: Handler<
  APIGatewayEvent,
  APIGatewayProxyResult
> = async event => {
  if (event.httpMethod === 'POST' && typeof event.body === 'string') {
    const parsed = JSON.parse(event.body)
    console.log(parsed)

    const response = await resolve(parsed.query, parsed.operationName)

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    }
  }

  await new Promise(res => res(''))

  return { statusCode: 200, body: 'test' }
}

const resolve = async (source: string, operationName?: string) =>
  await graphql({ schema, source, operationName, rootValue })
