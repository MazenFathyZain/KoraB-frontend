import { useMemo, useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { MatchCard } from '../components/MatchCard'
import { Pagination } from '../components/Pagination'
import { usePolling } from '../hooks/useLive'
import { listLeagues, listMatchResults } from '../services/sportsApi'

const PAGE_SIZE = 12

export function ResultsPage({ onOpenMatch }) {
  const [leagueId, setLeagueId] = useState('')
  const [page, setPage] = useState(1)
  const leagues = usePolling(() => listLeagues(), 0)
  const results = usePolling(() => listMatchResults({ leagueId }), 60000, [leagueId])
  const matches = useMemo(() => results.data?.data || [], [results.data])
  const visible = matches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <section className="page-section">
      <div className="page-hero">
        <p className="eyebrow light">النتائج</p>
        <h1>نتائج المباريات</h1>
        <p>كل المباريات المنتهية والنقاط التي حصل عليها كل فريق.</p>
      </div>

      <div className="toolbar">
        <label>
          الدوري
          <select value={leagueId} onChange={(event) => { setLeagueId(event.target.value); setPage(1) }}>
            <option value="">كل الدوريات</option>
            {(leagues.data?.data || []).map((league) => <option key={league.id} value={league.id}>{league.name}</option>)}
          </select>
        </label>
        <span className="toolbar-count">{matches.length} مباراة</span>
      </div>

      {results.error ? <div className="error-banner">{results.error}</div> : null}
      {results.loading && !matches.length ? <div className="matches-grid">{[1, 2, 3, 4].map((key) => <div key={key} className="skeleton-card short" />)}</div> : null}
      {!results.loading && !matches.length ? <EmptyState title="لا توجد نتائج" body="لم تنته أي مباراة بعد." /> : null}
      <div className="matches-grid">
        {visible.map((match) => <MatchCard key={match.id} match={match} onOpen={onOpenMatch} />)}
      </div>
      <Pagination currentPage={page} totalPages={Math.max(1, Math.ceil(matches.length / PAGE_SIZE))} onPageChange={setPage} />
    </section>
  )
}
