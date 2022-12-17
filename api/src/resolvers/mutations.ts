import type { Mutations } from './types'
import * as google from '../oauth/google'
import * as db from '../db'
import { generateId } from '../util/id'
import pick from 'froebel/pick'
import * as jwt from '../util/jwt'
import { PublicError } from '~/util/error'
import * as resolver from './typeResolvers'

export const mutations: Mutations = {
  async signInGoogle({ code, redirect }, context) {
    const result = await google.exchangeToken(code, redirect)

    if (result.status !== 200 || !result.data?.id_token)
      throw Error('did not receive id_token')

    const payload = await google.verifyToken(result.data.id_token)

    const signIn = await db.SigninGoogle.query()
      .findById(payload.sub)
      .withGraphJoined('user')

    let user = (signIn as any)?.user

    if (!signIn) {
      const userId = generateId(6)
      user = await db.User.query()
        .insert({ id: userId, name: payload.name })
        .returning('*')
      await db.SigninGoogle.query().insert({ googleId: payload.sub, userId })
      user = { id: userId, name: payload.name }
    }

    context.addHeader(
      'Set-Cookie',
      `auth=${jwt.sign({ id: user.id })}; Expires=${new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 180
      ).toUTCString()}; HttpOnly`
    )

    return pick(user, 'id', 'name')
  },

  signOut: (_, context) => {
    context.addHeader(
      'Set-Cookie',
      `auth=deleted; expires=${new Date(0).toUTCString()}`
    )

    return 0
  },

  createText: async (_, context) => {
    const userId = context.assertSignedIn()
    const id = generateId(16)
    const text = { id, author: userId, isDraft: true }
    console.log('create text', text)
    await db.Story.query().insert(text as any)
    return { id }
  },

  updateText: async ({ textId, updates }, context) => {
    context.assertSignedIn()

    const story = await db.Story.query().findById(textId)

    if (!story || story.author !== context.userId) {
      throw new PublicError("You don't have permission to edit this story")
    }

    const updatedLanguages = [...new Set(updates.map(v => v.language))]

    const translations = await db.Translation.query()
      .where('story', story.id)
      .whereIn('language', updatedLanguages)

    const newLanguages = updatedLanguages.filter(
      language => !translations.find(v => v.language === language)
    )

    if (newLanguages.length) {
      await db.Translation.query().insert(
        newLanguages.map(language => ({ story: story.id, language }))
      )
    }

    const updatesByLang = new Map<
      string,
      { title?: string; content?: string }
    >()

    for (const update of updates) {
      if (
        typeof update.title !== 'string' &&
        typeof update.content !== 'string'
      )
        continue

      if (!updatesByLang.has(update.language)) {
        updatesByLang.set(update.language, {})
      }

      const diff = updatesByLang.get(update.language)!

      if (typeof update.title === 'string') {
        diff.title = update.title
      }

      if (typeof update.content === 'string') {
        diff.content = update.content
      }
    }

    await Promise.all(
      [...updatesByLang].map(
        ([language, diff]) => (
          console.log({ language, diff }),
          db.Translation.query().patch(diff).findById([story.id, language])
        )
      )
    )

    if (newLanguages.length || updatesByLang.size) {
      await db.Story.query().patch({ updated: new Date() }).findById(story.id)
    }

    return new resolver.Text(textId) as any
  },
}
