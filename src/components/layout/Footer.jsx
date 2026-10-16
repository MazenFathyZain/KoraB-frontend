import logo from '../../assets/kora-logo.png'

export function Footer({ navigate }) {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          <img src={logo} alt="" />
          <div>
            <strong>Kora B</strong>
            <small>أخبار، نتائج مباشرة، ترتيب الفرق والهدافين.</small>
          </div>
        </div>
        <nav aria-label="روابط سريعة">
          <button type="button" onClick={() => navigate('/today-matches')}>ماتشات اليوم</button>
          <button type="button" onClick={() => navigate('/standings')}>الترتيب</button>
          <button type="button" onClick={() => navigate('/top-scorers')}>الهدافين</button>
          <button type="button" onClick={() => navigate('/clubs')}>الأندية</button>
        </nav>
        <small className="footer-copy">© {new Date().getFullYear()} Kora B</small>
      </div>
    </footer>
  )
}
