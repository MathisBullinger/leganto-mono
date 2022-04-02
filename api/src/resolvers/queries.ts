import type { QueryResolvers } from '../graphql/types'

export const queries: QueryResolvers = {
  hello: () => 'hello world',
}
