import { useEffect, useState } from 'react'
import { usePolling } from '../../hooks/useLive'
import { getClub } from '../../services/contentApi'
import { addMatchGoal, deleteMatchGoal, getSportsMatch, listSportsMatches } from '../../services/sportsApi'
import { formatDateTime, STATUS_LABELS } from '../../utils/matchFormatters'
import { MessageBox, TeamBadge } from './adminShared'
import { errorText } from './adminUtils'

const EMPTY_FORM = { matchId: '', minute: '', playerId: '', teamId: '' }

export function GoalsAdminPage({ token }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [message, setMessage] = useState('')
  const [roster, setRoster] = useState({ players: [], teamId: '' })
  const matches = usePolling(() => listSportsMatches(token), 0, [token])
  const detail = usePolling(() => (form.matchId ? getSportsMatch(form.matchId, token) : Promise.resolve(null)), 0, [form.matchId, token])

  const allMatches = matches.data?.data || []
  const selectedMatch = detail.data && String(detail.data.id) === String(form.matchId) ? detail.data : null
  const matchTeams = selectedMatch ? [selectedMatch.homeTeam, selectedMatch.awayTeam] : []
  const players = roster.teamId === form.teamId ? roster.players : []

  useEffect(() => {
    if (!form.teamId) return undefined
    let alive = true
    getClub(form.teamId)
      .then((club) => {
        if (alive) setRoster({ players: (club.players || []).filter((player) => Number(player.active) === 1), teamId: form.teamId })
      })
      .catch(() => {
        if (alive) setRoster({ players: [], teamId: form.teamId })
      })
    return () => {
      alive = false
    }
  }, [form.teamId])

  async function submitGoal(event) {
    event.preventDefault()
    try {
      await addMatchGoal(form.matchId, { ...form, minute: form.minute === '' ? null : Number(form.minute) }, token)
      setForm({ ...form, minute: '', playerId: '' })
      setMessage('تم تسجيل الهدف وتحديث النتيجة.')
      detail.reload()
      matches.reload()
    } catch (err) {
      setMessage(errorText(err, 'تعذر تسجيل الهدف.'))
    }
  }

  async function removeGoal(goal) {
    if (!window.confirm(`حذف هدف ${goal.playerName}؟`)) return
    try {
      await deleteMatchGoal(goal.id, token)
      setMessage('تم حذف الهدف وتعديل النتيجة.')
      detail.reload()
      matches.reload()
    } catch (err) {
      setMessage(errorText(err, 'تعذر حذف الهدف.'))
    }
  }

  return (
    <div className="admin-content">
      <form className="admin-form" onSubmit={submitGoal}>
        <div className="section-bar compact">
          <h2>تسجيل هدف</h2>
        </div>
        <div className="form-grid">
          <label>
            المباراة
            <select value={form.matchId} onChange={(event) => setForm({ ...EMPTY_FORM, matchId: event.target.value })} required>
              <option value="">اختر مباراة</option>
              {allMatches.map((match) => (
                <option key={match.id} value={match.id}>
                  [{STATUS_LABELS[match.status]}] {match.homeTeam.name} ضد {match.awayTeam.name} · {formatDateTime(match.matchDate)}
                </option>
              ))}
            </select>
          </label>
          <label>
            الفريق المسجل
            <select value={form.teamId} onChange={(event) => setForm({ ...form, playerId: '', teamId: event.target.value })} required disabled={!selectedMatch}>
              <option value="">اختر فريق من المباراة</option>
              {matchTeams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
            </select>
          </label>
          <label>
            اللاعب المسجل
            <select value={form.playerId} onChange={(event) => setForm({ ...form, playerId: event.target.value })} required disabled={!form.teamId}>
              <option value="">اختر لاعب من الفريق</option>
              {players.map((player) => (
                <option key={player.id} value={player.id}>{player.shirtNumber ? `${player.shirtNumber} - ` : ''}{player.name}</option>
              ))}
            </select>
            {form.teamId && roster.teamId === form.teamId && !players.length ? <small>لا يوجد لاعبين مربوطين بهذا النادي.</small> : null}
          </label>
          <label>
            الدقيقة
            <input type="number" min="0" max="150" value={form.minute} onChange={(event) => setForm({ ...form, minute: event.target.value })} />
          </label>
        </div>
        {selectedMatch ? (
          <div className="goal-match-preview">
            <TeamBadge team={selectedMatch.homeTeam} />
            <strong>{selectedMatch.homeScore} - {selectedMatch.awayScore}</strong>
            <TeamBadge team={selectedMatch.awayTeam} />
          </div>
        ) : null}
        <MessageBox message={message} />
        <button className="primary-button" type="submit">تسجيل الهدف</button>
      </form>

      <section className="admin-table">
        <div className="section-bar compact">
          <h2>{selectedMatch ? 'أهداف المباراة' : 'اختر مباراة لعرض أهدافها'}</h2>
          <span>{selectedMatch?.goals?.length || 0}</span>
        </div>
        {(selectedMatch?.goals || []).map((goal) => (
          <article key={goal.id} className="admin-row">
            <div className="admin-row-main">
              <span className="goal-minute">{goal.minute ?? '—'}'</span>
              <div>
                <strong>⚽ {goal.playerName}</strong>
                <small>{goal.teamName}</small>
              </div>
            </div>
            <div className="row-actions">
              <button type="button" className="danger" onClick={() => removeGoal(goal)}>حذف</button>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
