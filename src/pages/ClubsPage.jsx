import { useEffect, useState } from 'react'
import { ClubCard } from '../components/ClubCard'
import { EmptyState } from '../components/EmptyState'
import { Pagination } from '../components/Pagination'
import { usePolling } from '../hooks/useLive'
import { searchClubs } from '../services/contentApi'

const PAGE_SIZE = 24

export function ClubsPage({ navigate }) {
  const [search, setSearch] = useState('')
  const [term, setTerm] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const id = window.setTimeout(() => {
      setTerm(search.trim())
      setPage(1)
    }, 300)
    return () => window.clearTimeout(id)
  }, [search])

  const { data, error, loading } = usePolling(() => searchClubs(term, PAGE_SIZE, page), 0, [term, page])
  const clubs = data?.data || []
  const total = Number(data?.total || 0)

  return (
    <section className="page-section">
      <div className="page-hero">
        <p className="eyebrow light">الأندية</p>
        <h1>دليل الأندية</h1>
        <p>{total ? `${total} نادي` : 'ابحث عن ناديك المفضل'}</p>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ابحث عن نادي..."
          type="search"
        />
      </div>

      {error ? <div className="error-banner">{error}</div> : null}
      {loading && !clubs.length ? <div className="clubs-grid">{[1, 2, 3, 4, 5, 6, 7, 8].map((key) => <div key={key} className="skeleton-card short" />)}</div> : null}
      {!loading && !clubs.length ? <EmptyState title="لا توجد نتائج" body="جرب اسم نادي آخر." /> : null}
      <div className="clubs-grid">
        {clubs.map((club) => (
          <ClubCard key={club.id} club={club} onOpen={(clubId) => navigate(`/clubs/${clubId}`)} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={Math.max(1, Math.ceil(total / PAGE_SIZE))} onPageChange={setPage} />
    </section>
  )
}
