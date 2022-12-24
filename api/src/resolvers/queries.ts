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

  text: async ({ textId }) => {
    const text = await db.Story.query().findById(textId)

    return text && (new resolver.Text(textId) as any)
  },

  draft: async ({ textId }) => {
    const story =
      (await db.Story.query().where('revises', textId).limit(1).first()) ??
      (await db.Story.query().findById(textId))

    return story && (new resolver.Text(textId) as any)
  },

  texts: async ({ languages }) => {
    const stories = await db.Story.query()
      .innerJoinRelated('translations_')
      .whereIn('language', languages)
      .groupBy('story.id')
      .having(db.Story.raw('count(*)'), '=', languages.length)

    return stories.map(v => new resolver.Text(v.id))
  },
}
