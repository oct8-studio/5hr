import type { Session, ProviderName } from './types.js'

export interface AnalyticsResult {
  totalSessions: number
  byProvider: Partial<Record<ProviderName, number>>
  avgDurationMinutes: number
  utilizationPct: number
  wastedMinutes: number
  weekTrend: number | null
}

const WINDOW_MINUTES = 300

export function computeAnalytics(sessions: Session[]): AnalyticsResult {
  const completed = sessions.filter((s) => s.durationMinutes !== undefined)
  const total = completed.length

  const byProvider: Partial<Record<ProviderName, number>> = {}
  for (const s of completed) {
    byProvider[s.provider] = (byProvider[s.provider] ?? 0) + 1
  }

  const avgDuration =
    total === 0
      ? 0
      : completed.reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0) / total

  const utilizationPct = Math.min(100, Math.round((avgDuration / WINDOW_MINUTES) * 100))
  const wastedMinutes = Math.max(0, Math.round(total * (WINDOW_MINUTES - avgDuration)))

  const now = Date.now()
  const msPerDay = 86_400_000

  const last7 = completed.filter(
    (s) => now - new Date(s.startedAt).getTime() < 7 * msPerDay
  )
  const prev7 = completed.filter((s) => {
    const age = now - new Date(s.startedAt).getTime()
    return age >= 7 * msPerDay && age < 14 * msPerDay
  })

  let weekTrend: number | null = null
  if (prev7.length > 0) {
    const lastAvg =
      last7.reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0) /
      Math.max(1, last7.length)
    const prevAvg =
      prev7.reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0) / prev7.length
    weekTrend = Math.round(((lastAvg - prevAvg) / prevAvg) * 100)
  }

  return { totalSessions: total, byProvider, avgDurationMinutes: avgDuration, utilizationPct, wastedMinutes, weekTrend }
}
