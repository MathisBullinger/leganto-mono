declare module '*.gql' {
  import { DocumentNode } from 'graphql'
  const value: DocumentNode
  export default value
}

type ResolverResult<T> = T extends Primitive
  ? T
  : MapResult<T> | (() => MapResult<T> | Promise<MapResult<T>>)

type MapResult<T> = {
  [K in keyof T]?: ResolverResult<T[K]>
}

type Primitive = string | number | boolean | symbol | null | undefined
