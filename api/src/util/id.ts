import crypto from 'crypto'

export const generateId = (bytes: number) =>
  crypto.randomBytes(bytes).toString('base64url')
