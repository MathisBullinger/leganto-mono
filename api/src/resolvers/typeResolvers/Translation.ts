import * as db from '~/db'

export class Translation {
  public readonly story: string
  public readonly language: string

  constructor(private readonly data: TranslationData) {
    this.story = data.story
    this.language = data.language
  }

  title() {
    return this.data.title ?? 'Untitled Text'
  }
}

type TranslationData = RequireFields<db.Translation, 'story' | 'language'>

type RequireFields<T, K extends keyof T> = Partial<Omit<T, K>> & {
  [F in K]-?: T[F]
}
