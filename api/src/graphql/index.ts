import { buildASTSchema } from 'graphql'
import document from './schema.gql'

export const schema = buildASTSchema(document)
