import { useEffect, useState } from 'react'
import { query } from 'api/client'

type Query = typeof query

export const useQuery = <T extends keyof Query>(
  name: T,
  ...[variables]: Parameters<Query[T]>
) => {
  const [data, setData] = useState<QueryResult<T>>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setData(undefined)
    setLoading(true)
    ;(query[name] as any)(variables).then((data: any) => {
      setData(data)
      setLoading(false)
    })
  }, [name, JSON.stringify(variables)])

  return [data, loading] as const
}

export type QueryResult<T extends keyof Query> = ReturnType<
  Query[T]
> extends Promise<infer I>
  ? I
  : never
