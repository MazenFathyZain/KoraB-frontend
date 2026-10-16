import { getPostTitle } from '../../utils/contentFormatters'

const SERVER_MESSAGES = {
  'Clock is not paused': 'الساعة ليست متوقفة.',
  'Clock is not running': 'الساعة لا تعمل.',
  'Goal player must belong to the scoring team': 'اللاعب يجب أن يكون في الفريق المسجل.',
  'Goal team must be one of the match teams': 'الفريق يجب أن يكون أحد فريقي المباراة.',
  'Match already finished': 'المباراة انتهت بالفعل.',
  'Match already started': 'المباراة بدأت بالفعل.',
  'Match state changed, refresh and try again': 'حالة المباراة تغيرت، حدّث الصفحة وحاول مرة أخرى.',
  'Match teams must be different': 'لا يمكن اختيار نفس الفريق مرتين.',
  'Only matches that did not start can be delayed': 'التأجيل متاح فقط قبل بداية المباراة.',
  'Penalty shootout needs a winner': 'ركلات الترجيح لازم يكون لها فائز.',
}

export function errorText(error, fallback) {
  const message = error?.message || ''
  return SERVER_MESSAGES[message] || (message ? `${fallback} (${message})` : fallback)
}

export function pageCount(total, limit) {
  return Math.max(1, Math.ceil(Number(total || 0) / Number(limit || 1)))
}

export function clubName(club) {
  return club?.name || club?.title || getPostTitle(club)
}

export function playerName(player) {
  return player?.name || player?.title || getPostTitle(player)
}

export function activeTeam(player) {
  return (player.teams || []).find((team) => Number(team.active) === 1)
}
