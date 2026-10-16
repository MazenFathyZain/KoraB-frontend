import { useCallback, useEffect, useState } from 'react'
import { FeaturedCarousel } from '../components/FeaturedCarousel'
import { NewsCard } from '../components/NewsCard'
import { Pagination } from '../components/Pagination'
import { StandingsTable } from '../components/StandingsTable'
import { TeamLogo } from '../components/TeamLogo'
import { useNow, usePolling } from '../hooks/useLive'
import { getCarouselPosts, getPosts } from '../services/contentApi'
import { getStandings, listLiveMatches, listTodayMatches, listUpcomingMatches } from '../services/sportsApi'
import { matchStatusText } from '../utils/matchFormatters'

async function loadMatchStrip() {
  const [live, today, upcoming] = await Promise.all([listLiveMatches(), listTodayMatches(), listUpcomingMatches(8)])
  const seen = new Set()
  return [...(live.data || []), ...(today.data || []), ...(upcoming.data || [])].filter((match) => {
    if (seen.has(match.id)) return false
    seen.add(match.id)
    return true
  }).slice(0, 12)
}

function MatchStrip({ matches, onOpenMatch }) {
  const now = useNow()
  if (!matches.length) return null

  return (
    <section className="match-strip" aria-label="المباريات">
      {matches.map((match) => (
        <button type="button" key={match.id} className={`strip-card ${match.status}`} onClick={() => onOpenMatch(match.id)}>
          <span className={`status-badge ${match.status}`}>
            {match.status === 'live' ? <i className="live-dot" /> : null}
            {matchStatusText(match, now)}
          </span>
          <span className="strip-team">
            <TeamLogo team={match.homeTeam} size="sm" />
            <span>{match.homeTeam?.name}</span>
            <b>{match.status === 'scheduled' ? '' : match.homeScore}</b>
          </span>
          <span className="strip-team">
            <TeamLogo team={match.awayTeam} size="sm" />
            <span>{match.awayTeam?.name}</span>
            <b>{match.status === 'scheduled' ? '' : match.awayScore}</b>
          </span>
        </button>
      ))}
    </section>
  )
}

export function HomePage({ navigate, onOpenArticle, onOpenClub, onOpenMatch }) {
  const [posts, setPosts] = useState([])
  const [carouselPosts, setCarouselPosts] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const strip = usePolling(loadMatchStrip, 20000)
  const standings = usePolling(() => getStandings(), 60000)

  const loadPosts = useCallback(async (nextPage) => {
    try {
      setLoading(true)
      setError('')
      const result = await getPosts(nextPage)
      setPosts(result.data)
      setPage(nextPage)
      setTotalPages(result.totalPages || 1)
      document.getElementById('latest-news')?.scrollIntoView({ behavior: 'smooth' })
    } catch {
      setError('تعذر تحميل الأخبار. تأكد أن الباك إند يعمل.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let alive = true

    async function loadInitialPosts() {
      try {
        const [postsResult, carouselResult] = await Promise.all([getPosts(1), getCarouselPosts()])
        if (!alive) return
        setPosts(postsResult.data)
        setCarouselPosts((carouselResult.data || []).length ? carouselResult.data : postsResult.data.slice(0, 5))
        setPage(1)
        setTotalPages(postsResult.totalPages || 1)
      } catch {
        if (alive) setError('تعذر تحميل الأخبار. تأكد أن الباك إند يعمل.')
      } finally {
        if (alive) setLoading(false)
      }
    }

    loadInitialPosts()
    return () => {
      alive = false
    }
  }, [])

  const standingsRows = (standings.data?.data || []).slice(0, 8)

  return (
    <section className="page-section">
      <MatchStrip matches={strip.data || []} onOpenMatch={onOpenMatch} />
      <FeaturedCarousel posts={carouselPosts} onOpenArticle={onOpenArticle} />

      <div className="home-layout">
        <div>
          <div className="section-bar" id="latest-news">
            <div>
              <p className="eyebrow">الأخبار</p>
              <h2>آخر المنشورات</h2>
            </div>
          </div>

          {error ? <div className="error-banner">{error}</div> : null}
          {loading && !posts.length ? <div className="news-grid">{[1, 2, 3, 4, 5, 6].map((key) => <div key={key} className="skeleton-card" />)}</div> : null}
          {posts.length ? (
            <div className="news-grid">
              {posts.map((post) => (
                <NewsCard key={post.id || post.ID} post={post} onOpen={onOpenArticle} />
              ))}
            </div>
          ) : null}
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={loadPosts} />
        </div>

        <aside className="home-aside">
          <section className="data-panel">
            <div className="section-bar compact">
              <h2>الترتيب</h2>
              <button type="button" className="link-button" onClick={() => navigate('/standings')}>الجدول كامل</button>
            </div>
            <StandingsTable rows={standingsRows} compact onOpenClub={onOpenClub} />
          </section>
        </aside>
      </div>
    </section>
  )
}
