import { url } from 'util/url'
import memoize from 'facula/memoize'
import identity from 'facula/ident'
import * as api from 'api/client'

export const googleSigninUrl = memoize(
  (redirectUrl = document.location.origin + document.location.pathname) =>
    url(
      'accounts.google.com/o/oauth2/v2/auth',
      {
        clientId: process.env.GOOGLE_CLIENT_ID,
        redirectUri: redirectUrl,
        responseType: 'code',
        scope: ['openid'],
        state: redirectUrl,
      },
      'snake'
    ),
  { key: identity }
)

export const useGoogleSignin = memoize(
  (query?: string) => {
    let code = (query?.match(/code=([^&]*)/) ?? [])[1]
    let state = (query?.match(/state=([^&]*)/) ?? [])[1]
    if (!code || !state) return

    code = decodeURIComponent(code)
    state = decodeURIComponent(state)

    api.mutate.signInGoogle({ code, redirect: state })
  },
  { key: identity }
)
