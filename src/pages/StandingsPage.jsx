import { useState } from 'react'
import { StandingsTable } from '../components/StandingsTable'
import { usePolling } from '../hooks/useLive'
import { getStandings, listLeagues } from '../services/sportsApi'

export function StandingsPage({ onOpenClub }) {
  const [leagueId, setLeagueId] = useState('')
  const leagues = usePolling(() => listLeagues(), 0)
  const standings = usePolling(() => getStandings(leagueId), 30000, [leagueId])
  const points = standings.data?.points

  return (
    <section className="page-section">
      <div className="page-hero">
        <p className="eyebrow light">جدول الترتيب</p>
        <h1>ترتيب الفرق</h1>
        <p>
          الفوز {points?.win ?? 3} نقاط · التعادل {points?.draw ?? 1} نقطة · الخسارة {points?.loss ?? 0}
        </p>
      </div>

      <div className="toolbar">
        <label>
          الدوري
          <select value={leagueId} onChange={(event) => setLeagueId(event.target.value)}>
            <option value="">كل المباريات</option>
            {(leagues.data?.data || []).map((league) => <option key={league.id} value={league.id}>{league.name}</option>)}
          </select>
        </label>
        <span className="toolbar-count">الترتيب حسب النقاط ثم فارق الأهداف ثم الأهداف المسجلة</span>
      </div>

      {standings.error ? <div className="error-banner">{standings.error}</div> : null}
      {standings.loading && !standings.data ? <div className="loader">جاري تحميل الترتيب...</div> : null}
      {standings.data ? (
        <section className="data-panel">
          <StandingsTable rows={standings.data.data || []} onOpenClub={onOpenClub} />
        </section>
      ) : null}
    </section>
  )
}
