import oneOf from 'froebel/oneOf'
import { transformCase } from 'froebel/case'
import type { StringCase } from 'froebel/types'

export const url = (
  base: string,
  params?: Record<string, any>,
  paramCase?: StringCase
) => {
  if (!/^https?:\/\//.test(base)) base = 'https://' + base

  let queryString = !params
    ? ''
    : Object.entries(params)
        .map(
          ([k, v]) =>
            `${paramCase ? transformCase(k, paramCase) : k}${
              oneOf(v, '', undefined, null)
                ? ''
                : `=${encodeURIComponent(
                    Array.isArray(v)
                      ? v.join(' ')
                      : typeof v === 'object' && v !== null
                      ? JSON.stringify(v)
                      : v?.toString()
                  )}`
            }`
        )
        .join('&')

  if (queryString) queryString = '?' + queryString

  return base + queryString
}
