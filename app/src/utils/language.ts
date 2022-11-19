import partition from 'froebel/partition'

export const knownCodes = ['de', 'en', 'es', 'fr', 'it', 'pt', 'nl'] as const

export type LangCode = typeof knownCodes[number]

export const filterCodes = (codes: string[]) =>
  partition(codes, (code): code is LangCode => knownCodes.includes(code as any))

export const languageName = Object.fromEntries(
  knownCodes.map(code => [
    code,
    new Intl.DisplayNames(code, { type: 'language' }).of(code),
  ])
) as Record<LangCode, string>
