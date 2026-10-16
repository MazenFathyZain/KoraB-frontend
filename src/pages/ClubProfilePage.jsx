import { useEffect, useMemo, useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { MatchCard } from '../components/MatchCard'
import { TeamLogo } from '../components/TeamLogo'
import { getClub, getClubNews } from '../services/contentApi'
import { listSportsMatches } from '../services/sportsApi'
import { formatDate, getPostId, wpText } from '../utils/contentFormatters'

function teamRecord(matches, clubId) {
  const record = { drawn: 0, goalsAgainst: 0, goalsFor: 0, lost: 0, played: 0, points: 0, won: 0 }

  matches.filter((match) => match.status === 'finished').forEach((match) => {
    const isHome = String(match.homeTeam?.id) === String(clubId)
    const goalsFor = isHome ? match.homeScore : match.awayScore
    const goalsAgainst = isHome ? match.awayScore : match.homeScore
    record.played += 1
    record.goalsFor += goalsFor
    record.goalsAgainst += goalsAgainst
    record.points += Number((isHome ? match.homePoints : match.awayPoints) || 0)
    if (goalsFor > goalsAgainst) record.won += 1
    else if (goalsFor === goalsAgainst) record.drawn += 1
    else record.lost += 1
  })

  return record
}

export function ClubProfilePage({ clubId, onOpenArticle, onOpenMatch }) {
  const [club, setClub] = useState(null)
  const [clubNews, setClubNews] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

    async function loadClub() {
      await Promise.resolve()
      if (alive) setLoading(true)

      try {
        const [clubData, newsData, matchesData] = await Promise.all([
          getClub(clubId),
          getClubNews(clubId),
          listSportsMatches('', { teamId: clubId, limit: 30 }).catch(() => ({ data: [] })),
        ])
        if (!alive) return
        setClub(clubData.data || clubData)
        setClubNews(newsData.data || newsData || [])
        setMatches(matchesData.data || [])
      } catch {
        if (alive) {
          setClub(null)
          setClubNews([])
          setMatches([])
        }
      } finally {
        if (alive) setLoading(false)
      }
    }

    loadClub()
    return () => {
      alive = false
    }
  }, [clubId])

  const record = useMemo(() => teamRecord(matches, clubId), [matches, clubId])

  if (loading) return <div className="loader">جاري تحميل بروفايل النادي...</div>
  if (!club) return <EmptyState title="النادي غير موجود" body="لم نستطع تحميل بيانات هذا النادي." />

  const players = (club.players || []).filter((player) => Number(player.active) === 1)

  return (
    <section className="page-section">
      <div className="profile-hero">
        <TeamLogo team={club} size="xxl" />
        <div>
          <p className="eyebrow light">بروفايل النادي</p>
          <h1>{club.name || club.title}</h1>
          <p>{players.length} لاعب في القائمة الحالية</p>
        </div>
        <div className="profile-stats">
          <span><b>{record.points}</b>نقطة</span>
          <span><b>{record.played}</b>لعب</span>
          <span><b>{record.won}</b>فوز</span>
          <span><b>{record.drawn}</b>تعادل</span>
          <span><b>{record.lost}</b>خسارة</span>
          <span><b>{record.goalsFor}:{record.goalsAgainst}</b>الأهداف</span>
        </div>
      </div>

      {matches.length ? (
        <>
          <div className="section-bar">
            <h2>مباريات النادي</h2>
            <span>{matches.length}</span>
          </div>
          <div className="matches-grid">
            {matches.slice(0, 6).map((match) => <MatchCard key={match.id} match={match} onOpen={onOpenMatch} />)}
          </div>
        </>
      ) : null}

      <div className="profile-layout">
        <section className="data-panel">
          <div className="section-bar compact">
            <h2>اللاعبين</h2>
            <span>{players.length}</span>
          </div>
          {players.length ? (
            <div className="players-list">
              {players.map((player) => (
                <article key={player.id} className="player-row">
                  <span className="shirt">{player.shirtNumber || '—'}</span>
                  <strong>{player.name || player.title}</strong>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="لا يوجد لاعبين" body="لم يتم ربط لاعبين بهذا النادي حتى الآن." />
          )}
        </section>

        <section className="data-panel">
          <div className="section-bar compact">
            <h2>أخبار النادي</h2>
            <span>{clubNews.length}</span>
          </div>
          {clubNews.length ? (
            <div className="related-news">
              {clubNews.map((post) => (
                <button type="button" key={getPostId(post)} onClick={() => onOpenArticle(getPostId(post))}>
                  <strong>{wpText(post.title) || post.title}</strong>
                  <small>{formatDate(post.date || post.publishedAt)}</small>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState title="لا توجد أخبار" body="لم نجد أخبار مرتبطة باسم هذا النادي." />
          )}
        </section>
      </div>
    </section>
  )
}
