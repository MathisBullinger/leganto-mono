import * as jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

const readKey = (name: string) =>
  fs.readFileSync(path.resolve(__dirname, '..', name), 'utf-8')

const publicKey = readKey('jwtRS256.key.pub')
const privateKey = readKey('jwtRS256.key')

if (!publicKey || !privateKey) throw Error('missing jwt key')

export const sign = (payload: Record<string, unknown>) =>
  jwt.sign(payload, privateKey, { algorithm: 'RS256' })
