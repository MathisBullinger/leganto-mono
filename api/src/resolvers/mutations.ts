import type { MutationResolvers } from '../graphql/types'

export const mutations: MutationResolvers = {
  signInGoogle({ code, redirect }) {
    console.log('signin', { code, redirect })
    return 0
  },
}
