import { useEffect, useState } from 'react'
import logo from '../assets/kora-logo.png'
import { login } from '../services/authApi'

export function LoginPage({ navigate, setToken, token }) {
  const [email, setEmail] = useState('admin@kora-b.local')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) navigate('/admin')
  }, [navigate, token])

  async function submit(event) {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')
      const data = await login(email, password)
      setToken(data.token)
      navigate('/admin')
    } catch {
      setError('بيانات الدخول غير صحيحة أو السيرفر غير متاح.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="login-page">
      <form className="login-card" onSubmit={submit}>
        <img src={logo} alt="Kora B" />
        <p className="eyebrow">Admin Area</p>
        <h1>تسجيل دخول الأدمن</h1>
        <label>
          البريد الإلكتروني
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
        </label>
        <label>
          كلمة المرور
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
        </label>
        {error ? <div className="form-error">{error}</div> : null}
        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'جاري الدخول...' : 'Dashboard'}
        </button>
      </form>
    </section>
  )
}
