import type { Config, Session, PlanResult, ProviderName, State } from '@5hr/core'

const WINDOW_HOURS = 5
const GAP_MINUTES = 45
const MIN_HISTORY = 5

function parseTime(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function medianStartMinute(sessions: Session[]): number {
  const minutes = sessions
    .map((s) => {
      const d = new Date(s.startedAt)
      return d.getUTCHours() * 60 + d.getUTCMinutes()
    })
    .sort((a, b) => a - b)
  const mid = Math.floor(minutes.length / 2)
  return minutes.length % 2 === 0
    ? Math.round((minutes[mid - 1] + minutes[mid]) / 2)
    : minutes[mid]
}

export function computePlan(
  config: Config,
  sessions: Session[],
  state: State
): PlanResult {
  const workStart = parseTime(config.workingHours.start)
  const workEnd = parseTime(config.workingHours.end)
  const windowMins = WINDOW_HOURS * 60

  let window1Start = workStart

  const recent = sessions.filter((s) => s.durationMinutes !== undefined).slice(-30)
  if (recent.length >= MIN_HISTORY) {
    const median = medianStartMinute(recent)
    if (median >= workStart && median + windowMins <= workEnd + 120) {
      window1Start = median
    }
  }

  const window1End = window1Start + windowMins
  const window2Start = window1End + GAP_MINUTES
  const window2End = window2Start + windowMins

  const windows = [
    { start: formatTime(window1Start), end: formatTime(window1End) },
    { start: formatTime(window2Start), end: formatTime(window2End) },
  ]

  const avgDuration =
    recent.length === 0
      ? 0
      : recent.reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0) / recent.length

  const utilizationPct = Math.min(100, Math.round((avgDuration / (windowMins)) * 100))

  const providerStatus: Partial<Record<ProviderName, 'active' | 'idle'>> = {}
  for (const [provider, session] of Object.entries(state.activeSessions)) {
    providerStatus[provider as ProviderName] = session ? 'active' : 'idle'
  }

  return { windows, utilizationPct, providerStatus }
}

export function computeExplain(
  config: Config,
  sessions: Session[]
): {
  recommendedStart: string
  baselineStart: string
  minutesSaved: number
  medianStart: string | null
  canFitSecondWindow: boolean
  gainPct: number
} {
  const workStart = parseTime(config.workingHours.start)
  const workEnd = parseTime(config.workingHours.end)
  const windowMins = WINDOW_HOURS * 60

  let recommendedStartMins = workStart
  let medianStart: string | null = null

  const recent = sessions.filter((s) => s.durationMinutes !== undefined).slice(-30)
  if (recent.length >= MIN_HISTORY) {
    const median = medianStartMinute(recent)
    medianStart = formatTime(median)
    if (median >= workStart && median + windowMins <= workEnd + 120) {
      recommendedStartMins = median
    }
  }

  const window1End = recommendedStartMins + windowMins
  const window2End = window1End + GAP_MINUTES + windowMins
  const canFitSecondWindow = window2End <= workEnd + 180

  const minutesSaved = Math.max(0, recommendedStartMins - workStart)
  const gainPct = minutesSaved > 0 ? Math.round((minutesSaved / windowMins) * 100) : 0

  return {
    recommendedStart: formatTime(recommendedStartMins),
    baselineStart: formatTime(workStart),
    minutesSaved,
    medianStart,
    canFitSecondWindow,
    gainPct,
  }
}
