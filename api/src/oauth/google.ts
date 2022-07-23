import axios from 'axios'
import jwt, { JwtHeader, Algorithm, JwtPayload } from 'jsonwebtoken'
import memoize from 'froebel/memoize'
import jwkToPem from 'jwk-to-pem'

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

  return await axios.post(requestUrl)
}

type DiscoveryDocument = {
  issuer: string
  jwks_uri: string
}

const fetchDiscoveryDocument = memoize(
  (): Promise<DiscoveryDocument> =>
    axios.get(process.env.GOOGLE_DISCOVERY!).then(({ data }) => data)
)

type Certificate = {
  kty: 'RSA'
  e: string
  n: string
  kid: string
  alg: Algorithm
  pem: string
}

type CertsDocument = {
  keys: Certificate[]
}

const fetchCertsDocument = memoize(
  async (endpoint: string): Promise<CertsDocument> => {
    console.log('fetch certificate document')
    const { data } = await axios.get(endpoint)
    return data
  }
)

export const verifyToken = async (token: string) => {
  const decoded = jwt.decode(token, { complete: true }) as JwtPayload
  if (!decoded) throw Error('failed to decode token')
  const { header, payload } = decoded
  const certificate = await fetchCertificate(header)
  try {
    jwt.verify(token, certificate.pem, { algorithms: [certificate.alg] })
  } catch (error) {
    console.error(error)
    throw new Error('failed to verify token')
  }
  const discovery = await fetchDiscoveryDocument()
  if (payload.iss !== discovery.issuer) throw Error('issuer mismatch')
  if (payload.aud !== process.env.GOOGLE_CLIENT_ID) throw Error('aud mismatch')
  if (payload.exp * 1000 < Date.now()) throw Error('token expired')
  return payload
}

const certificates = new Map<string, Certificate>()
const certCacheSize = 200

const fetchCertificate = async (header: JwtHeader) => {
  if (!certificates.has(header.kid!)) {
    const discovery = await fetchDiscoveryDocument()
    const { keys } = await fetchCertsDocument(discovery.jwks_uri)

    for (const cert of keys) {
      certificates.delete(cert.kid)
      certificates.set(cert.kid, { ...cert, pem: jwkToPem(cert) })
    }
    for (const key of certificates.keys()) {
      if (certificates.size <= certCacheSize) break
      certificates.delete(key)
    }
  }

  const certificate = certificates.get(header.kid!)
  if (!certificate) throw Error(`failed to find certificate ${header.kid}`)
  if (certificate.alg !== header.alg)
    throw Error('certificate algorithm mismatch')
  return certificate
}
