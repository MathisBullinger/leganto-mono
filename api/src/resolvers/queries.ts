import type { Queries } from './types'
import * as db from '../db'
import * as resolver from './typeResolvers'

export const queries: Queries = {
  me: async (_, context) => {
    if (!context.userId) return null

    return await resolver.Person.fetch(context, context.userId)
  },
  user: async ({ userId }, context) =>
    await resolver.Person.fetch(context, userId),
  draft: async ({ textId }) => {
    const story =
      (await db.Story.query().where('revises', textId).limit(1).first()) ??
      (await db.Story.query().findById(textId))

    return story && (new resolver.Text(textId) as any)
  },
}
