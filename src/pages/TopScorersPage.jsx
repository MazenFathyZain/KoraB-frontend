import { EmptyState } from '../components/EmptyState'
import { usePolling } from '../hooks/useLive'
import { listTopScorers } from '../services/sportsApi'

export function TopScorersPage({ onOpenClub }) {
  const { data, error, loading } = usePolling(listTopScorers, 60000)
  const rows = data?.data || []
  const podium = rows.slice(0, 3)

  return (
    <section className="page-section">
      <div className="page-hero">
        <p className="eyebrow light">الهدافين</p>
        <h1>ترتيب الهدافين</h1>
        <p>يتحدث تلقائياً مع كل هدف يتم تسجيله.</p>
      </div>

      {error ? <div className="error-banner">{error}</div> : null}
      {loading && !rows.length ? <div className="loader">جاري تحميل ترتيب الهدافين...</div> : null}
      {!loading && !rows.length ? <EmptyState title="لا يوجد هدافين بعد" body="سجل أهداف المباريات من لوحة التحكم." /> : null}

      {podium.length ? (
        <div className="podium">
          {podium.map((row, index) => (
            <article key={`${row.playerId}-${row.teamId}`} className={`podium-card place-${index + 1}`}>
              <span className="podium-rank">{index + 1}</span>
              <strong>{row.playerName}</strong>
              <button type="button" className="link-button" onClick={() => row.teamId && onOpenClub(row.teamId)}>
                {row.teamName || 'بدون فريق'}
              </button>
              <b>{row.goals}</b>
              <small>هدف</small>
            </article>
          ))}
        </div>
      ) : null}

      <div className="scorers-table">
        {rows.slice(3).map((row, index) => (
          <article key={`${row.playerId}-${row.teamId || 'team'}`} className="scorer-row">
            <span>{index + 4}</span>
            <div>
              <strong>{row.playerName}</strong>
              <small>{row.teamName || 'بدون فريق'}</small>
            </div>
            <b>{row.goals}</b>
          </article>
        ))}
      </div>
    </section>
  )
}
