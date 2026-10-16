export const PERIOD_LABELS = {
  not_started: 'لم تبدأ',
  first_half: 'الشوط الأول',
  halftime: 'استراحة بين الشوطين',
  second_half: 'الشوط الثاني',
  fulltime: 'نهاية الوقت الأصلي',
  extra_first: 'الشوط الإضافي الأول',
  extra_halftime: 'استراحة الوقت الإضافي',
  extra_second: 'الشوط الإضافي الثاني',
  penalties: 'ركلات الترجيح',
  finished: 'انتهت',
}

export const STATUS_LABELS = {
  scheduled: 'لم تبدأ',
  live: 'مباشر',
  finished: 'انتهت',
}

export const PLAYING_PERIODS = ['first_half', 'second_half', 'extra_first', 'extra_second']

export function isPlaying(period) {
  return PLAYING_PERIODS.includes(period)
}

export function formatTime(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('ar-EG', { hour: 'numeric', minute: '2-digit' }).format(new Date(value))
}

export function formatDateTime(value) {
  if (!value) return 'بدون تاريخ'
  return new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

export function formatDay(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(value))
}

export function formatClock(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds || 0))
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

// Seconds played in the current period, ticked forward locally since the match was fetched.
export function periodSeconds(match, now = Date.now()) {
  const clock = match?.clock
  if (!clock) return 0
  let elapsed = Number(clock.elapsedSeconds || 0)
  if (clock.isRunning && match.fetchedAt) {
    elapsed += Math.max(0, Math.floor((now - match.fetchedAt) / 1000))
  }
  return clock.targetSeconds ? Math.min(elapsed, clock.targetSeconds) : elapsed
}

// "23'" or "45+2'" style minute for a running match.
export function liveMinute(match, now = Date.now()) {
  const clock = match?.clock
  if (!clock || !isPlaying(clock.period)) return ''
  const elapsed = periodSeconds(match, now)
  const base = clock.baseSeconds / 60
  const offset = clock.offsetSeconds / 60
  const minute = Math.min(Math.floor(elapsed / 60) + 1, base + Number(clock.addedMinutes || 0))
  return minute > base ? `${offset + base}+${minute - base}'` : `${offset + minute}'`
}

// Total match clock, e.g. 47:12 in the second half.
export function matchClock(match, now = Date.now()) {
  const clock = match?.clock
  if (!clock) return '00:00'
  return formatClock(Number(clock.offsetSeconds || 0) + periodSeconds(match, now))
}

export function secondsUntil(value, now = Date.now()) {
  if (!value) return 0
  return Math.max(0, Math.floor((new Date(value).getTime() - now) / 1000))
}

export function formatCountdown(totalSeconds) {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(safe / 3600)
  const rest = formatClock(safe % 3600)
  return hours ? `${hours}:${rest}` : rest
}

// Short status line shown on match cards.
export function matchStatusText(match, now = Date.now()) {
  const clock = match.clock || {}
  if (match.status === 'finished') {
    return match.homePenalties !== null && match.homePenalties !== undefined
      ? `انتهت · ترجيح ${match.homePenalties}-${match.awayPenalties}`
      : 'انتهت'
  }
  if (match.status === 'scheduled') {
    return clock.delayMinutes ? `مؤجلة ${clock.delayMinutes} د · ${formatTime(clock.kickoffAt)}` : formatTime(clock.kickoffAt || match.matchDate)
  }
  if (isPlaying(clock.period)) {
    return clock.isPaused ? `${liveMinute(match, now)} · متوقفة` : liveMinute(match, now)
  }
  return PERIOD_LABELS[clock.period] || STATUS_LABELS[match.status] || match.status
}

export function stampMatches(result) {
  const fetchedAt = Date.now()
  const stamp = (match) => ({ ...match, fetchedAt })
  if (Array.isArray(result?.data)) return { ...result, data: result.data.map(stamp) }
  return result ? stamp(result) : result
}

export function toDateTimeInput(value) {
  if (!value) return ''
  const date = new Date(value)
  const pad = (number) => String(number).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}
