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

export class Story extends Model {
  static tableName = 'story'
  static idColumn = 'id'

  public id!: string
  public author?: string
  public isDraft!: string
  public revises?: string
  public created!: Date
  public updated!: Date

  static get relationMappings() {
    return {
      author_: {
        relation: Model.HasOneRelation,
        modelClass: User,
        join: {
          from: 'story.author',
          to: 'user.id',
        },
      },
      revises_: {
        relation: Model.HasOneRelation,
        modelClass: Story,
        join: {
          from: 'story.revises',
          to: 'story.id',
        },
      },
      translations_: {
        relation: Model.HasManyRelation,
        modelClass: Translation,
        join: {
          from: 'story.id',
          to: 'translation.story',
        },
      },
    }
  }
}

export class Translation extends Model {
  static tableName = 'translation'
  static idColumn = ['story', 'language']

  public story!: string
  public language!: string
  public title?: string
  public content?: string

  static get relationMappings() {
    return {
      story_: {
        relation: Model.HasOneRelation,
        modelClass: Story,
        join: {
          from: 'translation.story',
          to: 'story.id',
        },
      },
    }
  }
}
