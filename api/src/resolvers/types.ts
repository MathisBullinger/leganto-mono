import type { QueryResolvers, MutationResolvers } from '../graphql/types'
import type { Context } from './context'

export type Queries = QueryResolvers<Context>
export type Mutations = MutationResolvers<Context>
