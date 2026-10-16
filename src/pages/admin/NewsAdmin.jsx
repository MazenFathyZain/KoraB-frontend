import { useCallback, useEffect, useState } from 'react'
import { Pagination } from '../../components/Pagination'
import { createAdminItem, deleteAdminItem, listAdminItems, updateAdminItem } from '../../services/adminApi'
import { fileToDataUrl, uploadImage } from '../../services/uploadApi'
import { formatDate, getFeaturedImage, getPostTitle, wpText } from '../../utils/contentFormatters'
import { AdminDataRow, MessageBox } from './adminShared'
import { pageCount } from './adminUtils'

const EMPTY_NEWS_FORM = {
  carouselFeatured: false,
  content: '',
  imageUrl: '',
  status: 'publish',
  title: '',
}

function newsToForm(item) {
  return {
    carouselFeatured: item.meta?.carousel_featured === '1',
    content: wpText(item.content) || item.contentPreview || '',
    imageUrl: getFeaturedImage(item),
    status: item.status || 'publish',
    title: getPostTitle(item),
  }
}

function newsPayload(form) {
  return {
    content: form.content,
    excerpt: '',
    meta: form.imageUrl
      ? {
          carousel_featured: form.carouselFeatured ? '1' : '0',
          featured_image_url: form.imageUrl,
        }
      : { carousel_featured: form.carouselFeatured ? '1' : '0' },
    status: form.status,
    title: form.title,
  }
}

export function NewsAdminPage({ token }) {
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_NEWS_FORM)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10

  const loadItems = useCallback(async (nextPage = 1) => {
    try {
      setLoading(true)
      const result = await listAdminItems('posts', token, nextPage, limit)
      setItems(result.data || [])
      setTotal(result.total || 0)
      setPage(result.page || nextPage)
    } catch {
      setMessage('تعذر تحميل الأخبار.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    let alive = true

    async function loadInitialItems() {
      try {
        setLoading(true)
        const result = await listAdminItems('posts', token, 1, limit)
        if (!alive) return
        setItems(result.data || [])
        setTotal(result.total || 0)
        setPage(result.page || 1)
      } catch {
        if (alive) setMessage('تعذر تحميل الأخبار.')
      } finally {
        if (alive) setLoading(false)
      }
    }

    loadInitialItems()
    return () => {
      alive = false
    }
  }, [token])

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function resetForm() {
    setEditing(null)
    setForm(EMPTY_NEWS_FORM)
  }

  async function uploadFeaturedImage(file) {
    if (!file) return

    try {
      setMessage('جاري رفع الصورة...')
      const dataUrl = await fileToDataUrl(file)
      const uploaded = await uploadImage({ dataUrl, fileName: file.name }, token)
      updateField('imageUrl', uploaded.url)
      setMessage('تم رفع الصورة. احفظ الخبر لتثبيت الصورة.')
    } catch {
      setMessage('تعذر رفع الصورة.')
    }
  }

  async function saveItem(event) {
    event.preventDefault()

    try {
      const payload = newsPayload(form)
      if (editing) {
        await updateAdminItem('posts', editing.id, payload, token)
      } else {
        await createAdminItem('posts', payload, token)
      }
      setMessage(editing ? 'تم تعديل الخبر.' : 'تم إنشاء الخبر.')
      resetForm()
      loadItems(page)
    } catch (error) {
      setMessage(error.message || 'تعذر حفظ الخبر.')
    }
  }

  async function removeItem(item) {
    if (!window.confirm(`هل تريد حذف "${getPostTitle(item)}"؟`)) return
    try {
      await deleteAdminItem('posts', item.id, token)
      setMessage('تم حذف الخبر.')
      loadItems(page)
    } catch {
      setMessage('تعذر حذف الخبر.')
    }
  }

  return (
    <div className="admin-content">
      <form className="admin-form" onSubmit={saveItem}>
        <div className="section-bar compact">
          <div>
            <p className="eyebrow">{editing ? 'تعديل خبر' : 'خبر جديد'}</p>
            <h2>{editing ? 'تعديل الخبر' : 'إضافة خبر'}</h2>
          </div>
          {editing ? <button type="button" className="ghost-button" onClick={resetForm}>إلغاء</button> : null}
        </div>
        <div className="form-grid">
          <label>
            عنوان الخبر
            <input value={form.title} onChange={(event) => updateField('title', event.target.value)} required />
          </label>
          <label>
            الحالة
            <select value={form.status} onChange={(event) => updateField('status', event.target.value)}>
              <option value="publish">منشور</option>
              <option value="draft">مسودة</option>
            </select>
          </label>
          <label>
            صورة الخبر
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => uploadFeaturedImage(event.target.files?.[0])} />
          </label>
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={form.carouselFeatured}
              onChange={(event) => updateField('carouselFeatured', event.target.checked)}
            />
            إظهار في الكاروسيل
          </label>
        </div>
        <label>
          المحتوى
          <textarea value={form.content} onChange={(event) => updateField('content', event.target.value)} rows="7" />
        </label>
        {form.imageUrl ? <img className="admin-preview-image" src={form.imageUrl} alt="" /> : null}
        <MessageBox message={message} />
        <button type="submit" className="primary-button">{editing ? 'حفظ التعديل' : 'إضافة الخبر'}</button>
      </form>

      <section className="admin-table">
        <div className="section-bar compact">
          <h2>الأخبار</h2>
          <span>{total}</span>
        </div>
        {loading ? <div className="loader">جاري تحميل الأخبار...</div> : null}
        {items.map((item) => (
          <AdminDataRow
            key={item.id}
            image={getFeaturedImage(item)}
            meta={`${item.status === 'publish' ? 'منشور' : 'مسودة'} · ${formatDate(item.date || item.publishedAt)}`}
            onDelete={() => removeItem(item)}
            onEdit={() => {
              setEditing(item)
              setForm(newsToForm(item))
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            title={getPostTitle(item)}
          />
        ))}
        <Pagination currentPage={page} totalPages={pageCount(total, limit)} onPageChange={loadItems} />
      </section>
    </div>
  )
}
