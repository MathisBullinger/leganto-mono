import partition from 'facula/partition'

export const knownCodes = ['de', 'en', 'es'] as const
export type LangCode = typeof knownCodes[number]

export const filterCodes = (codes: string[]) =>
  partition(codes, (code): code is LangCode => knownCodes.includes(code as any))

export const languageName = Object.fromEntries(
  knownCodes.map(code => [
    code,
    new Intl.DisplayNames(code, { type: 'language' }).of(code),
  ])
) as Record<LangCode, string>
