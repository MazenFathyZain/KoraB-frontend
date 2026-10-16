import { apiGet, apiSend } from './apiClient'

export function listAdminItems(resource, token, page = 1, limit = 10) {
  return apiGet(`/api/admin/${resource}?limit=${limit}&page=${page}`, token)
}

export function createAdminItem(resource, payload, token) {
  return apiSend(`/api/admin/${resource}`, 'POST', payload, token)
}

export function updateAdminItem(resource, id, payload, token) {
  return apiSend(`/api/admin/${resource}/${id}`, 'PATCH', payload, token)
}

export function deleteAdminItem(resource, id, token) {
  return apiSend(`/api/admin/${resource}/${id}`, 'DELETE', null, token)
}
