import { API_BASE } from '../config/appConfig'

export function cleanText(value = '') {
  return String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function wpText(value) {
  if (!value) return ''
  if (typeof value === 'string') return cleanText(value)
  return cleanText(value.rendered || '')
}

export function imageUrl(value) {
  if (!value) return ''
  if (value.startsWith('/')) return `${API_BASE}${value}`

  try {
    const url = new URL(value)
    if (url.pathname.startsWith('/wp-content/uploads/')) {
      return `${API_BASE}${url.pathname.replace('/wp-content', '')}`
    }
  } catch {
    return value
  }

  return value
}

export function formatDate(value) {
  if (!value) return 'بدون تاريخ'
  return new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium' }).format(new Date(value))
}

export function getPostId(item) {
  return item?.id || item?.ID
}

export function getPostTitle(item) {
  return wpText(item?.title) || item?.title || 'بدون عنوان'
}

export function getFeaturedImage(item) {
  return imageUrl(item?.featured_url || item?.featured_path || item?.featuredImagePath || item?.featuredImageUrl)
}

export function getClubLogo(club) {
  return imageUrl(club?.logoPath || club?.logoUrl || club?.featuredImagePath || club?.featuredImageUrl)
}
