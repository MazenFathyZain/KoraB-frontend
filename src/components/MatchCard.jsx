import { useNow } from '../hooks/useLive'
import { formatDay, matchStatusText } from '../utils/matchFormatters'
import { TeamLogo } from './TeamLogo'

function TeamBlock({ team, winner }) {
  return (
    <div className={`match-team ${winner ? 'winner' : ''}`}>
      <TeamLogo team={team} size="lg" />
      <strong>{team?.name || 'فريق غير محدد'}</strong>
    </div>
  )
}

export function MatchCard({ match, onOpen }) {
  const now = useNow()
  const isLive = match.status === 'live'
  const showScore = match.status !== 'scheduled'
  const hasPenalties = match.homePenalties !== null && match.homePenalties !== undefined
  const winnerId = match.winnerTeamId ? String(match.winnerTeamId) : ''

  return (
    <button type="button" className={`match-card ${match.status}`} onClick={() => onOpen?.(match.id)}>
      <div className="match-meta">
        <span className="match-league">{match.leagueName || 'مباراة ودية'}</span>
        <time>{formatDay(match.clock?.kickoffAt || match.matchDate)}</time>
      </div>
      <div className="match-score-row">
        <TeamBlock team={match.homeTeam} winner={winnerId && winnerId === String(match.homeTeam?.id)} />
        <div className="match-center">
          {showScore ? (
            <div className="match-score">
              <strong>{match.homeScore}</strong>
              <span>:</span>
              <strong>{match.awayScore}</strong>
            </div>
          ) : (
            <div className="match-vs">VS</div>
          )}
          {hasPenalties ? <small className="match-pens">({match.homePenalties} - {match.awayPenalties})</small> : null}
          <span className={`status-badge ${match.status}`}>
            {isLive ? <i className="live-dot" /> : null}
            {matchStatusText(match, now)}
          </span>
        </div>
        <TeamBlock team={match.awayTeam} winner={winnerId && winnerId === String(match.awayTeam?.id)} />
      </div>
    </button>
  )
}
