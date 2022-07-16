import axios from 'axios'

export const exchangeToken = async (code: string, redirect: string) => {
  const query = {
    code,
    redirect_uri: redirect,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    grant_type: 'authorization_code',
  }

  const requestUrl = `${process.env.GOOGLE_TOKEN_ENDPOINT}?${Object.entries(
    query
  )
    .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
    .join('&')}`

  // const res = await fetch(requestUrl, { method: 'POST' })

  return await axios.post(requestUrl)
}
