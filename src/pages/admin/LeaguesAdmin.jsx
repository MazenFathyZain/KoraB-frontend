import { useState } from 'react'
import { usePolling } from '../../hooks/useLive'
import { createLeague, deleteLeague, listLeagues, updateLeague } from '../../services/sportsApi'
import { AdminDataRow, MessageBox } from './adminShared'
import { errorText } from './adminUtils'

const EMPTY_FORM = { name: '', season: '', status: 'active' }

export function LeaguesAdminPage({ token }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [editing, setEditing] = useState(null)
  const [message, setMessage] = useState('')
  const { data, error, reload } = usePolling(() => listLeagues(token), 0, [token])
  const leagues = data?.data || []

  function reset() {
    setEditing(null)
    setForm(EMPTY_FORM)
  }

  async function submitLeague(event) {
    event.preventDefault()
    try {
      if (editing) {
        await updateLeague(editing.id, form, token)
        setMessage('تم تعديل الدوري.')
      } else {
        await createLeague(form, token)
        setMessage('تم إنشاء الدوري.')
      }
      reset()
      reload()
    } catch (err) {
      setMessage(errorText(err, 'تعذر حفظ الدوري.'))
    }
  }

  async function removeLeague(league) {
    if (!window.confirm(`حذف "${league.name}"؟ المباريات ستبقى بدون دوري.`)) return
    try {
      await deleteLeague(league.id, token)
      setMessage('تم حذف الدوري.')
      if (editing?.id === league.id) reset()
      reload()
    } catch (err) {
      setMessage(errorText(err, 'تعذر حذف الدوري.'))
    }
  }

  return (
    <div className="admin-content">
      <form className="admin-form" onSubmit={submitLeague}>
        <div className="section-bar compact">
          <div>
            <p className="eyebrow">{editing ? 'تعديل' : 'جديد'}</p>
            <h2>{editing ? 'تعديل الدوري' : 'إضافة دوري'}</h2>
          </div>
          {editing ? <button type="button" className="ghost-button" onClick={reset}>إلغاء</button> : null}
        </div>
        <div className="form-grid three">
          <label>
            اسم الدوري
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
          <label>
            الموسم
            <input value={form.season} onChange={(event) => setForm({ ...form, season: event.target.value })} placeholder="2026/2027" />
          </label>
          <label>
            الحالة
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
              <option value="active">نشط</option>
              <option value="finished">منتهي</option>
            </select>
          </label>
        </div>
        <MessageBox message={message || (error ? 'تعذر تحميل الدوريات.' : '')} />
        <button className="primary-button" type="submit">{editing ? 'حفظ التعديل' : 'حفظ الدوري'}</button>
      </form>

      <section className="admin-table">
        <div className="section-bar compact">
          <h2>الدوريات</h2>
          <span>{leagues.length}</span>
        </div>
        {leagues.map((league) => (
          <AdminDataRow
            key={league.id}
            title={league.name}
            meta={`${league.season || 'بدون موسم'} · ${league.status === 'active' ? 'نشط' : 'منتهي'}`}
            onEdit={() => {
              setEditing(league)
              setForm({ name: league.name, season: league.season || '', status: league.status || 'active' })
            }}
            onDelete={() => removeLeague(league)}
          />
        ))}
      </section>
    </div>
  )
}
