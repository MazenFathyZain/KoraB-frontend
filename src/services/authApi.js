import { apiGet, apiSend } from './apiClient'

export function login(email, password) {
  return apiSend('/api/auth/login', 'POST', { email, password })
}

export function getCurrentUser(token) {
  return apiGet('/api/auth/me', token)
}
