import type { Queries } from './types'
import * as db from '../db'

export const queries: Queries = {
  me: async (_, { userId }) => {
    if (!userId) return null
    return (await db.User.query().findById(userId)) as any
  },
}
