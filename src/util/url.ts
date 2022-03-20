import oneOf from 'facula/oneOf'
import { transformCase } from 'facula/case'
import type { StringCase } from 'facula/types'

export const url = (
  base: string,
  params?: Record<
    string,
    string | number | null | undefined | (string | number)[]
  >,
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
                    Array.isArray(v) ? v.join(' ') : v?.toString()
                  )}`
            }`
        )
        .join('&')

  if (queryString) queryString = '?' + queryString

  return base + queryString
}
