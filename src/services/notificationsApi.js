import { apiGet, apiSend } from './apiClient'

function query(params = {}) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, value)
  })
  const text = search.toString()
  return text ? `?${text}` : ''
}

export function listNotifications(token, filters = {}) {
  return apiGet(`/api/admin/notifications${query(filters)}`, token)
}

export function sendNotification(payload, token) {
  return apiSend('/api/admin/notifications/send', 'POST', payload, token)
}
