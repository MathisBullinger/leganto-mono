import { Model } from 'objection'

export class User extends Model {
  static tableName = 'user'
  static idColumn = 'id'

  id!: string
  name!: string

  static get relationMappings() {
    return {
      signIn: {
        relation: Model.HasManyRelation,
        modelClass: SigninGoogle,
        join: {
          from: 'user.id',
          to: 'signin_google.userId',
        },
      },
    }
  }
}

export class SigninGoogle extends Model {
  static tableName = 'signin_google'
  static idColumn = 'googleId'

  googleId!: string
  userId!: string

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'signin_google.userId',
        to: 'user.id',
      },
    },
  }
}
