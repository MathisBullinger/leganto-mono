import { VFC } from 'react'
import { RouteProps, Link } from 'itinero'
import Helmet from 'react-helmet'
import { useQuery, QueryResult } from 'api/hooks'
import Icon from 'components/Icon'
import style from './Profile.module.scss'
import type { Language } from 'api/graphql/types'

const Profile: VFC<RouteProps<{}, { id: string }>> = ({ match: { id } }) => {
  const [data, loading] = useQuery('getProfile', {
    userId: id,
    lang: 'en' as Language,
  })

  if (loading)
    return (
      <div className={style.page}>
        <Helmet>
          <title>Profile | Leganto</title>
        </Helmet>
        <Icon type="loadingDots" />
      </div>
    )

  if (!data?.user) return <MissingProfile />

  return <ProfileContent {...data.user} />
}

export default Profile

const MissingProfile: VFC = () => {
  return <p>This profile doesn&apos;t exist</p>
}

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
    {drafts.map(({ id, translations }) => (
      <li key={id}>
        <Link to={`/edit/${id}`}>
          {translations.find(v => v.language === 'en')?.title}
        </Link>
      </li>
    ))}
  </ul>
)

type User = Exclude<QueryResult<'getProfile'>['user'], undefined | null>
