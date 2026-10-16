import { useEffect } from 'react'
import { GoalsAdminPage } from './admin/GoalsAdmin'
import { LeaguesAdminPage } from './admin/LeaguesAdmin'
import { LiveMatchAdminPage } from './admin/LiveMatchAdmin'
import { MatchesAdminPage } from './admin/MatchesAdmin'
import { NewsAdminPage } from './admin/NewsAdmin'
import { NotificationsAdminPage } from './admin/NotificationsAdmin'
import { TeamPlayersAdminPage } from './admin/TeamPlayersAdmin'

const ADMIN_NAV = [
  { key: 'live-match', label: 'غرفة التحكم المباشر', icon: '⏱', path: '/admin/live-match' },
  { key: 'matches', label: 'المباريات', icon: '🏟', path: '/admin/matches' },
  { key: 'goals', label: 'تسجيل الأهداف', icon: '⚽', path: '/admin/goals' },
  { key: 'leagues', label: 'الدوريات', icon: '🏆', path: '/admin/leagues' },
  { key: 'team-players', label: 'ربط اللاعبين', icon: '👥', path: '/admin/team-players' },
  { key: 'news', label: 'الأخبار', icon: '📰', path: '/admin/news' },
  { key: 'notifications', label: 'الإشعارات', icon: '🔔', path: '/admin/notifications' },
]

export function AdminDashboard({ navigate, path, token }) {
  const [, , page = 'live-match', param] = path.split('/')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    if (!ADMIN_NAV.some((item) => item.key === page)) {
      navigate('/admin/live-match')
    }
  }, [navigate, page, token])

  if (!token) return null

  return (
    <section className="admin-page">
      <aside className="admin-sidebar">
        <p className="eyebrow">لوحة الإدارة</p>
        <h1>إدارة Kora B</h1>
        <nav>
          {ADMIN_NAV.map((item) => (
            <button
              type="button"
              key={item.key}
              className={item.key === page ? 'active' : ''}
              onClick={() => navigate(item.path)}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="admin-main">
        {page === 'news' ? <NewsAdminPage token={token} /> : null}
        {page === 'leagues' ? <LeaguesAdminPage token={token} /> : null}
        {page === 'matches' ? <MatchesAdminPage token={token} navigate={navigate} /> : null}
        {page === 'live-match' ? <LiveMatchAdminPage token={token} navigate={navigate} matchId={param} /> : null}
        {page === 'team-players' ? <TeamPlayersAdminPage token={token} /> : null}
        {page === 'goals' ? <GoalsAdminPage token={token} /> : null}
        {page === 'notifications' ? <NotificationsAdminPage token={token} /> : null}
      </div>
    </section>
  )
}
