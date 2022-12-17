import type { Context } from '../context'
import type { RequireFields } from '~/util/types'

export abstract class TypeResolver<T extends { id: string }> {
  constructor(
    protected readonly context: Context,
    protected readonly data: RequireFields<T, 'id'>
  ) {}
}

export type { Context }
