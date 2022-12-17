import * as db from '~/db'
import { TypeResolver, Context } from './base'
import { Text } from './text'

type Decorator<T> = (
  target: any,
  key: keyof T,
  descriptor: TypedPropertyDescriptor<any>
) => void | TypedPropertyDescriptor<any>

const access: Record<string, Decorator<Person>> = {
  private: (target, key, descriptor) => {
    const org = descriptor.value
    descriptor.value = function () {
      const self = this as Person
      console.log({ self })
      if (self['context'].userId !== self['data'].id) return null
      return org.apply(self)
    }
  },
}

export class Person extends TypeResolver<db.User> {
  static async fetch(context: Context, id: string): Promise<Person | null> {
    const data = await db.User.query().findById(id)

    console.log('fetch user', { id, data })

    if (!data) return null

    return new Person(context, data)
  }

  public id() {
    return this.data.id
  }

  public name() {
    return this.data.name
  }

  @access.private
  public async drafts() {
    const result = await db.Story.query().where({
      author: this.data.id,
      isDraft: true,
    })

    return result.map(({ id }) => new Text(id))
  }
}
