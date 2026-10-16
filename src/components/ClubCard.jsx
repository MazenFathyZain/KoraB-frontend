import { TeamLogo } from './TeamLogo'

export function ClubCard({ club, onOpen }) {
  const name = club.name || club.title
  const players = (club.players || []).filter((player) => Number(player.active) === 1).length

  return (
    <button type="button" className="club-card" onClick={() => onOpen(club.id)}>
      <TeamLogo team={club} size="xl" />
      <strong>{name}</strong>
      <small>{players ? `${players} لاعب` : 'عرض البروفايل'}</small>
    </button>
  )
}
