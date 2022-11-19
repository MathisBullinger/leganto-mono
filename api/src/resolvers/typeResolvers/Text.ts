import * as db from '~/db'
import { Translation } from './Translation'
import type { TextTranslationsArgs } from '~/graphql/types'

export class Text {
  constructor(public readonly id: string) {}

  async translations({ languages }: TextTranslationsArgs) {
    let query = db.Translation.query().where('story', this.id)
    if (languages) query = query.whereIn('language', languages)
    const results = await query
    return results.map(data => new Translation(data))
  }
}
