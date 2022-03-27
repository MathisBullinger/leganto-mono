import type { MutationResolvers } from '../graphql/types'

export const mutations: MutationResolvers = {
  signInGoogle(_, { code, redirect }) {
    console.log('signin', { code, redirect })
    return 0
  },
}
