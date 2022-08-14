import type { Mutations } from './types'
import * as google from '../oauth/google'
import * as db from '../db'
import { generateId } from '../util/id'
import pick from 'froebel/pick'
import * as jwt from '../util/jwt'

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

  signOut(_, context) {
    context.addHeader(
      'Set-Cookie',
      `auth=deleted; expires=${new Date(0).toUTCString()}`
    )

    return 0
  },
}
