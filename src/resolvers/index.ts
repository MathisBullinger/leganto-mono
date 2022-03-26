import type { Resolvers } from '../graphql/types'
import { queries } from './queries'

const resolvers: Resolvers = {
  Query: queries,
}

export default resolvers
