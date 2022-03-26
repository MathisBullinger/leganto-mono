import type { Queries } from './graphql/types'
import * as queries from './graphql/queries'
import { url } from 'util/url'

const query = Object.fromEntries(
  Object.entries(queries).map(([name, query]) => [
    name,
    (vars?: Record<string, unknown>) => execQuery(query, vars),
  ])
) as unknown as {
  [K in keyof Queries]: (
    ...p: QueryParams<Queries[K][1]>
  ) => Promise<Queries[K][0]>
}

const endpoint = 'http://localhost:7001'

async function execQuery(query: string, variables?: Record<string, any>) {
  const response = await fetch(url(endpoint, { query }))
  const { data } = await response.json()
  return data
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

query.hello().then(res => console.log(res))
