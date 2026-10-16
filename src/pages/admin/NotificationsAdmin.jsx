import { useMemo, useState } from 'react'
import { Pagination } from '../../components/Pagination'
import { usePolling } from '../../hooks/useLive'
import { listNotifications, sendNotification } from '../../services/notificationsApi'
import { AdminDataRow, MessageBox } from './adminShared'
import { errorText, pageCount } from './adminUtils'

const PAGE_SIZE = 10
const EMPTY_FORM = {
  body: '',
  imageUrl: '',
  link: '',
  targetType: 'all',
  targetValue: '',
  title: '',
}

const TARGET_LABELS = {
  all: 'كل المستخدمين',
  topic: 'Topic',
  tokens: 'أجهزة محددة',
  // Older notifications sent through OneSignal.
  player_ids: 'OneSignal player ids',
  segment: 'OneSignal segment',
  subscription_ids: 'OneSignal subscription ids',
}

const TARGET_HINTS = {
  topic: 'اسم topic أو أكثر مفصولة بفاصلة، مثل: all',
  tokens: 'FCM token لجهاز أو أكثر مفصولة بفاصلة (مفيد للتجربة على جهازك)',
}

const STATUS_LABELS = {
  failed: 'فشل الإرسال',
  pending: 'قيد الإرسال',
  sent: 'تم الإرسال',
  warning: 'تم مع تحذير',
}

function formatDate(value) {
  if (!value) return 'لم يرسل بعد'
  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function NotificationsAdminPage({ token }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [message, setMessage] = useState('')
  const [page, setPage] = useState(1)
  const { data, error, loading, reload } = usePolling(
    () => listNotifications(token, { limit: PAGE_SIZE, page }),
    0,
    [token, page],
  )
  const notifications = data?.data || []
  const totalPages = useMemo(() => pageCount(data?.total, PAGE_SIZE), [data?.total])
  const targetNeedsValue = form.targetType !== 'all'

  async function submitNotification(event) {
    event.preventDefault()
    try {
      await sendNotification(
        {
          ...form,
          targetValue: targetNeedsValue ? form.targetValue : '',
        },
        token,
      )
      setMessage('تم إرسال الإشعار وتسجيله في السجل.')
      setForm(EMPTY_FORM)
      setPage(1)
      reload()
    } catch (err) {
      setMessage(errorText(err, 'تعذر إرسال الإشعار.'))
      reload()
    }
  }

  return (
    <div className="admin-content">
      <form className="admin-form notification-form" onSubmit={submitNotification}>
        <div className="section-bar compact">
          <div>
            <p className="eyebrow">إشعار جديد</p>
            <h2>إرسال إشعار للتطبيق</h2>
          </div>
        </div>

        <div className="form-grid">
          <label>
            عنوان الإشعار
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
          </label>
          <label>
            رابط صورة اختياري
            <input
              dir="ltr"
              placeholder="https://..."
              value={form.imageUrl}
              onChange={(event) => setForm({ ...form, imageUrl: event.target.value })}
            />
          </label>
          <label>
            الخبر الذي يفتح عند الضغط (اختياري)
            <input
              dir="ltr"
              placeholder="رقم الخبر على الموقع أو رابطه"
              value={form.link}
              onChange={(event) => setForm({ ...form, link: event.target.value })}
            />
            <small>مثال: 12345 أو https://news.kora-b.com/...</small>
          </label>
        </div>

        <label>
          نص الإشعار
          <textarea rows="4" value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} required />
        </label>

        <div className="form-grid">
          <label>
            الجمهور
            <select value={form.targetType} onChange={(event) => setForm({ ...form, targetType: event.target.value, targetValue: '' })}>
              <option value="all">كل المستخدمين</option>
              <option value="topic">Topic محدد</option>
              <option value="tokens">أجهزة محددة (FCM tokens)</option>
            </select>
          </label>
          {targetNeedsValue ? (
            <label>
              قيمة الجمهور
              <input
                dir="ltr"
                placeholder={TARGET_HINTS[form.targetType]}
                value={form.targetValue}
                onChange={(event) => setForm({ ...form, targetValue: event.target.value })}
                required
              />
            </label>
          ) : null}
        </div>

        <MessageBox message={message || (error ? 'تعذر تحميل سجل الإشعارات.' : '')} />
        <button className="primary-button" type="submit">إرسال الإشعار</button>
      </form>

      <section className="admin-table">
        <div className="section-bar compact">
          <div>
            <p className="eyebrow">السجل</p>
            <h2>الإشعارات</h2>
          </div>
          <span>{data?.total || 0}</span>
        </div>

        {loading && !notifications.length ? <div className="loader">جاري تحميل الإشعارات...</div> : null}
        {!loading && !notifications.length ? <div className="empty-state"><strong>لا توجد إشعارات بعد</strong><span>أول إشعار سترسله سيظهر هنا.</span></div> : null}

        {notifications.map((item) => (
          <AdminDataRow
            key={item.id}
            image={item.imageUrl}
            title={item.title}
            meta={`${STATUS_LABELS[item.status] || item.status} · ${TARGET_LABELS[item.targetType] || item.targetType} · ${formatDate(item.sentAt || item.createdAt)}`}
          >
            {item.response?.warnings?.length ? <span className="status-pill danger">{item.response.warnings.join(' · ')}</span> : null}
            {item.errorMessage ? <span className="status-pill danger">{item.errorMessage}</span> : null}
            {item.response?.sent !== undefined ? <span className="status-pill">{item.response.sent} نجح · {item.response.failed} فشل</span> : null}
          </AdminDataRow>
        ))}

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </section>
    </div>
  )
}
