import { buildASTSchema } from 'graphql'
import document from './schema.gql'

for (const foo of document.definitions) {
  console.log(foo)
}

export const schema = buildASTSchema(document)
