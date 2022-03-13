import type {
  APIGatewayEvent,
  Handler,
  APIGatewayProxyResult,
} from 'aws-lambda'

export const handler: Handler<
  APIGatewayEvent,
  APIGatewayProxyResult
> = async event => {
  console.log('request', event)

  await new Promise(res => res(''))

  return { statusCode: 200, body: 'test' }
}
