import { EmptyState } from '../components/EmptyState'
import { MatchCard } from '../components/MatchCard'
import { useNow, usePolling } from '../hooks/useLive'
import { listTodayMatches } from '../services/sportsApi'
import { formatDay } from '../utils/matchFormatters'

const GROUPS = [
  { key: 'live', title: 'مباشر الآن' },
  { key: 'scheduled', title: 'لم تبدأ بعد' },
  { key: 'finished', title: 'انتهت' },
]

export function TodayMatchesPage({ onOpenMatch }) {
  const now = useNow(60000)
  const { data, error, loading } = usePolling(listTodayMatches, 15000)
  const matches = data?.data || []

  return (
    <section className="page-section">
      <div className="page-hero">
        <p className="eyebrow light">المباريات</p>
        <h1>ماتشات اليوم</h1>
        <p>{formatDay(now)} · تتحدث النتائج تلقائياً</p>
      </div>

      {error ? <div className="error-banner">{error}</div> : null}
      {loading && !matches.length ? <div className="matches-grid">{[1, 2, 3, 4].map((key) => <div key={key} className="skeleton-card short" />)}</div> : null}
      {!loading && !matches.length ? <EmptyState title="لا توجد مباريات اليوم" body="تابع صفحة النتائج أو عد لاحقاً." /> : null}

      {GROUPS.map((group) => {
        const items = matches.filter((match) => match.status === group.key)
        if (!items.length) return null
        return (
          <div key={group.key} className="match-group">
            <div className="section-bar compact">
              <h2>{group.key === 'live' ? <i className="live-dot" /> : null} {group.title}</h2>
              <span>{items.length}</span>
            </div>
            <div className="matches-grid">
              {items.map((match) => <MatchCard key={match.id} match={match} onOpen={onOpenMatch} />)}
            </div>
          </div>
        )
      })}
    </section>
  )
}
