import { url } from 'util/url'
import memoize from 'froebel/memoize'
import identity from 'froebel/ident'
import * as api from 'api/client'
import type { Person } from 'api/graphql/types'
import { history, location } from 'itinero'

export const googleSigninUrl = memoize(
  (redirectUrl = document.location.origin + document.location.pathname) =>
    url(
      'accounts.google.com/o/oauth2/v2/auth',
      {
        clientId: process.env.GOOGLE_CLIENT_ID,
        redirectUri: redirectUrl,
        responseType: 'code',
        scope: ['openid', 'https://www.googleapis.com/auth/userinfo.profile'],
        state: redirectUrl,
      },
      'snake'
    ),
  { key: identity }
)

export const useGoogleSignin = memoize(
  (query?: string, onSignIn?: (person: Person) => void) => {
    let code = (query?.match(/code=([^&]*)/) ?? [])[1]
    let state = (query?.match(/state=([^&]*)/) ?? [])[1]

    if (!code || !state) return false

    code = decodeURIComponent(code)
    state = decodeURIComponent(state)

    api.mutate
      .signInGoogle({ code, redirect: state })
      .then(({ signInGoogle }) => {
        if (signInGoogle) onSignIn?.(signInGoogle)
        history.push({ ...location, search: undefined })
      })

    return true
  },
  { key: identity }
)
