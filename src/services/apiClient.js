import { API_BASE } from '../config/appConfig'

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function parseResponse(response) {
  if (response.status === 401 && response.url.includes('/api/admin')) {
    window.dispatchEvent(new Event('kora:unauthorized'))
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `Request failed: ${response.status}`)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export async function apiGet(path, token) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: authHeaders(token),
  })

  return parseResponse(response)
}

export async function apiGetWithMeta(path, token) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: authHeaders(token),
  })
  const data = await parseResponse(response)

  return {
    data,
    total: Number(response.headers.get('X-WP-Total') || 0),
    totalPages: Number(response.headers.get('X-WP-TotalPages') || 0),
  }
}

export async function apiSend(path, method, body, token) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  return parseResponse(response)
}
