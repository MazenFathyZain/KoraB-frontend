import { getClubLogo } from '../utils/contentFormatters'

export function TeamLogo({ team, size = 'md' }) {
  const logo = getClubLogo(team)
  const name = team?.name || team?.title || ''

  return (
    <span className={`team-logo team-logo-${size}`}>
      {logo ? <img src={logo} alt="" loading="lazy" /> : <b>{name?.[0] || '?'}</b>}
    </span>
  )
}
