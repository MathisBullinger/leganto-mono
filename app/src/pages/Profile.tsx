import { VFC } from 'react'
import type { RouteProps } from 'itinero'
import Helmet from 'react-helmet'
import { useQuery, QueryResult } from 'api/hooks'
import Icon from 'components/Icon'
import style from './Profile.module.scss'
import type { Language } from 'api/graphql/types'

const Profile: VFC<RouteProps<{}, { id: string }>> = ({ match: { id } }) => {
  const [data] = useQuery('getProfile', {
    userId: id,
    lang: 'en' as Language,
  })

  if (!data?.user)
    return (
      <div className={style.page}>
        <Helmet>
          <title>Profile | Leganto</title>
        </Helmet>
        <Icon type="loadingDots" />
      </div>
    )

  return <ProfileContent {...data.user} />
}

export default Profile

const ProfileContent: VFC<User> = ({ name, drafts }) => {
  return (
    <div className={style.page}>
      <Helmet>
        <title>{name} | Leganto</title>
      </Helmet>
      {!!drafts?.length && <Drafts drafts={drafts} />}
    </div>
  )
}

const Drafts: VFC<{ drafts: Exclude<User['drafts'], undefined | null> }> = ({
  drafts,
}) => (
  <ul>
    {drafts.map(v => (
      <li key={v.id}>{v.translations.find(v => v.language === 'en')?.title}</li>
    ))}
  </ul>
)

type User = Exclude<QueryResult<'getProfile'>['user'], undefined | null>
