import { useEffect } from 'react'
import { useNow, usePolling } from '../hooks/useLive'
import { getSportsMatch } from '../services/sportsApi'
import { formatDateTime, liveMinute, matchClock, PERIOD_LABELS, STATUS_LABELS, isPlaying } from '../utils/matchFormatters'
import { TeamLogo } from './TeamLogo'

function MatchDialogBody({ matchId, onClose }) {
  const now = useNow()
  const { data: match, error, loading } = usePolling(() => getSportsMatch(matchId), 15000, [matchId])

  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const goals = match?.goals || []
  const playing = isPlaying(match?.clock?.period)

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <section className="match-dialog" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="close-button" onClick={onClose} aria-label="إغلاق">×</button>
        {loading && !match ? <div className="loader">جاري تحميل المباراة...</div> : null}
        {error && !match ? <div className="error-banner">{error}</div> : null}
        {match ? (
          <>
            <div className="match-dialog-hero">
              <p className="eyebrow light">{match.leagueName || 'مباراة ودية'} · {formatDateTime(match.clock?.kickoffAt || match.matchDate)}</p>
              <div className="match-dialog-board">
                <div className="match-dialog-team">
                  <TeamLogo team={match.homeTeam} size="xl" />
                  <strong>{match.homeTeam?.name}</strong>
                </div>
                <div className="match-dialog-score">
                  {match.status === 'scheduled' ? <b>VS</b> : <b>{match.homeScore} - {match.awayScore}</b>}
                  {match.homePenalties !== null && match.homePenalties !== undefined ? (
                    <small>ركلات الترجيح {match.homePenalties} - {match.awayPenalties}</small>
                  ) : null}
                  <span className={`status-badge ${match.status}`}>
                    {match.status === 'live' ? <i className="live-dot" /> : null}
                    {playing ? `${liveMinute(match, now)} · ${PERIOD_LABELS[match.clock.period]}` : PERIOD_LABELS[match.clock?.period] || STATUS_LABELS[match.status]}
                  </span>
                  {playing ? <small className="mono">{matchClock(match, now)}</small> : null}
                </div>
                <div className="match-dialog-team">
                  <TeamLogo team={match.awayTeam} size="xl" />
                  <strong>{match.awayTeam?.name}</strong>
                </div>
              </div>
            </div>

            <div className="match-dialog-body">
              {match.status === 'finished' ? (
                <div className="points-strip">
                  <span>{match.homeTeam?.name}: <b>+{match.homePoints}</b> نقطة</span>
                  <span>{match.awayTeam?.name}: <b>+{match.awayPoints}</b> نقطة</span>
                </div>
              ) : null}

              <h3>الأهداف</h3>
              {goals.length ? (
                <ol className="goal-timeline">
                  {goals.map((goal) => (
                    <li key={goal.id} className={String(goal.teamId) === String(match.homeTeam?.id) ? 'home' : 'away'}>
                      <span className="goal-minute">{goal.minute !== null && goal.minute !== undefined ? `${goal.minute}'` : '—'}</span>
                      <span className="goal-ball">⚽</span>
                      <span>
                        <strong>{goal.playerName}</strong>
                        <small>{goal.teamName}</small>
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="muted">لا توجد أهداف مسجلة.</p>
              )}
            </div>
          </>
        ) : null}
      </section>
    </div>
  )
}

export function MatchDialog({ matchId, onClose }) {
  if (!matchId) return null
  return <MatchDialogBody key={matchId} matchId={matchId} onClose={onClose} />
}
