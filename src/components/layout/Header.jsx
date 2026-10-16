import { useState } from 'react'
import logo from '../../assets/kora-logo.png'
import { AppLink } from '../AppLink'

const LINKS = [
  { to: '/', label: 'الرئيسية', match: (path) => path === '/' },
  { to: '/today-matches', label: 'ماتشات اليوم', match: (path) => path === '/today-matches' },
  { to: '/results', label: 'النتائج', match: (path) => path === '/results' },
  { to: '/standings', label: 'الترتيب', match: (path) => path === '/standings' },
  { to: '/top-scorers', label: 'الهدافين', match: (path) => path === '/top-scorers' },
  { to: '/clubs', label: 'الأندية', match: (path) => path.startsWith('/clubs') },
]

export function Header({ authed, onLogout, navigate, path }) {
  const [open, setOpen] = useState(false)

  function go(to) {
    setOpen(false)
    navigate(to)
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <button type="button" className="brand" onClick={() => go('/')}>
          <img src={logo} alt="" />
          <span>
            Kora B
            <small>كل الكورة في مكان واحد</small>
          </span>
        </button>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-label="القائمة"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav aria-label="التنقل الرئيسي" className={open ? 'open' : ''}>
          {LINKS.map((link) => (
            <AppLink key={link.to} to={link.to} active={link.match(path)} onNavigate={go}>
              {link.label}
            </AppLink>
          ))}
          <span className="nav-sep" />
          {authed ? (
            <>
              <AppLink to="/admin" active={path.startsWith('/admin')} onNavigate={go}>
                لوحة التحكم
              </AppLink>
              <button type="button" className="nav-action" onClick={() => { setOpen(false); onLogout() }}>
                خروج
              </button>
            </>
          ) : (
            <AppLink to="/login" active={path === '/login'} onNavigate={go}>
              دخول الأدمن
            </AppLink>
          )}
        </nav>
      </div>
    </header>
  )
}
