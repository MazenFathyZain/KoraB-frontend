import { PAGE_SIZE } from '../config/appConfig'
import { apiGet, apiGetWithMeta } from './apiClient'

export function getPosts(page = 1) {
  return apiGetWithMeta(`/wp-json/wp/v2/posts?per_page=${PAGE_SIZE}&page=${page}`)
}

export function getCarouselPosts() {
  return apiGetWithMeta('/wp-json/wp/v2/posts?per_page=6&page=1&carousel=1')
}

export function getPost(id) {
  return apiGet(`/wp-json/wp/v2/posts/${id}`)
}

export function getClubs(limit = 20, page = 1) {
  return apiGet(`/api/clubs?limit=${limit}&page=${page}`)
}

export function searchClubs(search = '', limit = 24, page = 1) {
  const params = new URLSearchParams({ limit, page })
  if (search) params.set('search', search)
  return apiGet(`/api/clubs?${params}`)
}

export function getPlayers(limit = 100, page = 1) {
  return apiGet(`/api/players?limit=${limit}&page=${page}`)
}

export async function getAllClubs() {
  return getAllPages((page) => apiGet(`/api/clubs?limit=100&page=${page}`))
}

export async function getAllPlayers() {
  return getAllPages((page) => getPlayers(100, page))
}

export function getClub(id) {
  return apiGet(`/api/clubs/${id}`)
}

export function getClubNews(id, limit = 12) {
  return apiGet(`/api/clubs/${id}/news?limit=${limit}&page=1`)
}

async function getAllPages(fetchPage) {
  const firstPage = await fetchPage(1)
  const total = Number(firstPage.total || 0)
  const limit = Number(firstPage.limit || 100)
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const data = [...(firstPage.data || [])]

  for (let page = 2; page <= totalPages; page += 1) {
    const result = await fetchPage(page)
    data.push(...(result.data || []))
  }

  return { data, limit, page: 1, total }
}
