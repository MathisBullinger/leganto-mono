import type { Mutations } from './types'
import * as google from '../oauth/google'

export const mutations: Mutations = {
  async signInGoogle({ code, redirect }, context) {
    console.log('signin', { code, redirect })

    const result = await google.exchangeToken(code, redirect)

    if (result.status !== 200 || !result.data?.id_token)
      throw Error('did not receive id_token')

    const payload = await google.verifyToken(result.data.id_token)

    console.log(payload)

    return 0
  },
}
