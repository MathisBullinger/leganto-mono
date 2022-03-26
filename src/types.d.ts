declare module '*.css' {
  const content: Record<string, string>
  export default content
}

declare module '*.scss' {
  const content: Record<string, string>
  export default content
}

declare module '*.gql' {
  import { DocumentNode } from 'graphql'
  const value: DocumentNode
  export default value
  export const string: string
}
