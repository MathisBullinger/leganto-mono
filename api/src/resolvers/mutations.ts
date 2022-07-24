import type { Mutations } from './types'
import * as google from '../oauth/google'
import * as db from '../db'
import { generateId } from '../util/id'

export const mutations: Mutations = {
  async signInGoogle({ code, redirect }, context) {
    const result = await google.exchangeToken(code, redirect)

    if (result.status !== 200 || !result.data?.id_token)
      throw Error('did not receive id_token')

    const payload = await google.verifyToken(result.data.id_token)

    console.log(payload)

    const signIn = await db.SigninGoogle.query()
      .findById(payload.sub)
      .withGraphJoined('user')

    console.log({ signIn })

    if (!signIn) {
      const userId = generateId(6)
      await db.User.query().insert({ id: userId, name: payload.name })
      await db.SigninGoogle.query().insert({ googleId: payload.sub, userId })
    }

    return 0
  },
}
