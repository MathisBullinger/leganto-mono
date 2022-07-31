import type { Operations } from './graphql/types'
import * as queries from './graphql/queries'
import * as mutations from './graphql/mutations'
import { url } from 'util/url'

const endpoint = process.env.API_ENDPOINT!

const opFactory = <T extends Record<string, string>>(
  ops: T,
  method: HTTPMethod
): MapOps<T> =>
  Object.fromEntries(
    Object.entries(ops).map(([name, query]) => [
      name,
      (variables?: Record<string, unknown>) =>
        execute({ query, variables, method }),
    ])
  ) as any

const execute = async ({
  method,
  ...payload
}: {
  query: string
  variables?: Record<string, any>
  method?: HTTPMethod
}) => {
  const request =
    method === 'GET'
      ? fetch(url(endpoint, payload))
      : fetch(endpoint, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' },
        })

  const response = await request
  const { data } = await response.json()
  return data
}

export const query = opFactory(queries, 'GET')
export const mutate = opFactory(mutations, 'PUT')

type HTTPMethod = 'GET' | 'PUT'

type MapOps<T extends Record<string, string>> = {
  [K in Extract<keyof T, keyof Operations>]: (
    ...p: QueryParams<Operations[K][1]>
  ) => Promise<Operations[K][0]>
}

type Variables<T> = { [K in keyof T as T[K] extends never ? never : K]: T[K] }

type QueryParams<T> = RequiredKeys<Variables<T>> extends never
  ? keyof Variables<T> extends never
    ? []
    : [variables?: Variables<T>]
  : [variables: Variables<T>]

type OptionalKeys<T> = Exclude<
  {
    [K in keyof T]: {} extends Pick<T, K> ? K : never
  }[keyof T],
  undefined
>

type RequiredKeys<T> = Exclude<keyof T, OptionalKeys<T>>
