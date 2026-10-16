import { stampMatches } from '../utils/matchFormatters'
import { apiGet, apiSend } from './apiClient'

function query(params = {}) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, value)
  })
  const text = search.toString()
  return text ? `?${text}` : ''
}

export function listLeagues(token) {
  return apiGet(token ? '/api/admin/sports/leagues' : '/api/sports/leagues', token)
}

export function createLeague(payload, token) {
  return apiSend('/api/admin/sports/leagues', 'POST', payload, token)
}

export function updateLeague(id, payload, token) {
  return apiSend(`/api/admin/sports/leagues/${id}`, 'PATCH', payload, token)
}

export function deleteLeague(id, token) {
  return apiSend(`/api/admin/sports/leagues/${id}`, 'DELETE', null, token)
}

export async function listSportsMatches(token, filters = {}) {
  const base = token ? '/api/admin/sports/matches' : '/api/sports/matches'
  return stampMatches(await apiGet(`${base}${query(filters)}`, token))
}

export async function listTodayMatches() {
  return stampMatches(await apiGet('/api/sports/matches/today'))
}

export async function listLiveMatches() {
  return stampMatches(await apiGet('/api/sports/matches/live'))
}

export async function listUpcomingMatches(limit = 6) {
  return stampMatches(await apiGet(`/api/sports/matches/upcoming${query({ limit })}`))
}

export async function listMatchResults(filters = {}) {
  return stampMatches(await apiGet(`/api/sports/matches/results${query(filters)}`))
}

export async function getSportsMatch(id, token) {
  const base = token ? '/api/admin/sports/matches' : '/api/sports/matches'
  return stampMatches(await apiGet(`${base}/${id}`, token))
}

export async function createSportsMatch(payload, token) {
  return stampMatches(await apiSend('/api/admin/sports/matches', 'POST', payload, token))
}

export async function updateSportsMatch(id, payload, token) {
  return stampMatches(await apiSend(`/api/admin/sports/matches/${id}`, 'PATCH', payload, token))
}

export async function controlSportsMatch(id, action, payload, token) {
  return stampMatches(await apiSend(`/api/admin/sports/matches/${id}/control`, 'POST', { action, ...payload }, token))
}

export function deleteSportsMatch(id, token) {
  return apiSend(`/api/admin/sports/matches/${id}`, 'DELETE', null, token)
}

export function listMatchGoals(matchId, token) {
  return apiGet(`/api${token ? '/admin/sports' : '/sports'}/matches/${matchId}/goals`, token)
}

export function addMatchGoal(matchId, payload, token) {
  return apiSend(`/api/admin/sports/matches/${matchId}/goals`, 'POST', payload, token)
}

export function deleteMatchGoal(goalId, token) {
  return apiSend(`/api/admin/sports/goals/${goalId}`, 'DELETE', null, token)
}

export function listTopScorers() {
  return apiGet('/api/sports/top-scorers')
}

export function getStandings(leagueId) {
  return apiGet(`/api/sports/standings${query({ leagueId })}`)
}

export function getSportsRules() {
  return apiGet('/api/sports/rules')
}

export function attachPlayerToClub(clubId, payload, token) {
  return apiSend(`/api/admin/sports/clubs/${clubId}/players`, 'POST', payload, token)
}
