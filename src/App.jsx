import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { ArticleDialog } from './components/ArticleDialog'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { MatchDialog } from './components/MatchDialog'
import { useAuthToken } from './hooks/useAuthToken'
import { useRoute } from './hooks/useRoute'
import { AdminDashboard } from './pages/AdminDashboard'
import { ClubProfilePage } from './pages/ClubProfilePage'
import { ClubsPage } from './pages/ClubsPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { ResultsPage } from './pages/ResultsPage'
import { StandingsPage } from './pages/StandingsPage'
import { TodayMatchesPage } from './pages/TodayMatchesPage'
import { TopScorersPage } from './pages/TopScorersPage'
import { EmptyState } from './components/EmptyState'
import { getPost } from './services/contentApi'

const PUBLIC_PATHS = ['/', '/clubs', '/today-matches', '/results', '/standings', '/top-scorers', '/login']

function App() {
  const { navigate, path } = useRoute()
  const { setToken, token } = useAuthToken()
  const [article, setArticle] = useState(null)
  const [articleLoading, setArticleLoading] = useState(false)
  const [matchId, setMatchId] = useState(null)

  const clubRouteMatch = path.match(/^\/clubs\/(\d+)/)
  const isAdmin = path.startsWith('/admin')
  const isKnownPath = PUBLIC_PATHS.includes(path) || clubRouteMatch || isAdmin

  const openArticle = useCallback(async (id) => {
    try {
      setArticleLoading(true)
      setArticle(null)
      setArticle(await getPost(id))
    } catch {
      setArticle(null)
    } finally {
      setArticleLoading(false)
    }
  }, [])

  useEffect(() => {
    const onUnauthorized = () => {
      setToken('')
      navigate('/login')
    }
    window.addEventListener('kora:unauthorized', onUnauthorized)
    return () => window.removeEventListener('kora:unauthorized', onUnauthorized)
  }, [navigate, setToken])

  const openClub = useCallback((id) => navigate(`/clubs/${id}`), [navigate])
  const closeMatch = useCallback(() => setMatchId(null), [])

  function logout() {
    setToken('')
    navigate('/')
  }

  return (
    <>
      <Header path={path} navigate={navigate} authed={Boolean(token)} onLogout={logout} />
      <main className={`app-shell ${isAdmin ? 'admin-shell' : ''}`}>
        {path === '/' ? <HomePage onOpenArticle={openArticle} onOpenMatch={setMatchId} onOpenClub={openClub} navigate={navigate} /> : null}
        {path === '/clubs' ? <ClubsPage navigate={navigate} /> : null}
        {path === '/today-matches' ? <TodayMatchesPage onOpenMatch={setMatchId} /> : null}
        {path === '/results' ? <ResultsPage onOpenMatch={setMatchId} /> : null}
        {path === '/standings' ? <StandingsPage onOpenClub={openClub} /> : null}
        {path === '/top-scorers' ? <TopScorersPage onOpenClub={openClub} /> : null}
        {clubRouteMatch ? <ClubProfilePage clubId={clubRouteMatch[1]} onOpenArticle={openArticle} onOpenMatch={setMatchId} /> : null}
        {path === '/login' ? <LoginPage token={token} setToken={setToken} navigate={navigate} /> : null}
        {isAdmin ? <AdminDashboard path={path} token={token} navigate={navigate} onLogout={logout} /> : null}
        {!isKnownPath ? (
          <section className="page-section">
            <EmptyState title="الصفحة غير موجودة" body="الرابط الذي فتحته غير متاح." />
          </section>
        ) : null}
      </main>
      {isAdmin ? null : <Footer navigate={navigate} />}
      <ArticleDialog article={article} loading={articleLoading} onClose={() => setArticle(null)} />
      <MatchDialog matchId={matchId} onClose={closeMatch} />
    </>
  )
}

export default App
