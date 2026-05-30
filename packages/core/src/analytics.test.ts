import { describe, it, expect } from 'vitest'
import { computeAnalytics } from './analytics.js'
import type { Session } from './types.js'

function makeSession(durationMinutes: number, daysAgo = 1): Session {
  const start = new Date(Date.now() - daysAgo * 86_400_000)
  const end = new Date(start.getTime() + durationMinutes * 60_000)
  return {
    id: Math.random().toString(36).slice(2),
    provider: 'claude',
    startedAt: start.toISOString(),
    endedAt: end.toISOString(),
    durationMinutes,
  }
}

describe('computeAnalytics', () => {
  it('returns zeros for empty sessions', () => {
    const result = computeAnalytics([])
    expect(result.totalSessions).toBe(0)
    expect(result.avgDurationMinutes).toBe(0)
    expect(result.utilizationPct).toBe(0)
    expect(result.wastedMinutes).toBe(0)
    expect(result.weekTrend).toBeNull()
  })

  it('ignores sessions without durationMinutes', () => {
    const active: Session = { id: 'a', provider: 'claude', startedAt: new Date().toISOString() }
    const result = computeAnalytics([active])
    expect(result.totalSessions).toBe(0)
  })

  it('computes avg duration correctly', () => {
    const sessions = [makeSession(120), makeSession(180)]
    expect(computeAnalytics(sessions).avgDurationMinutes).toBe(150)
  })

  it('utilization caps at 100', () => {
    const sessions = [makeSession(300), makeSession(300)]
    expect(computeAnalytics(sessions).utilizationPct).toBe(100)
  })

  it('counts sessions by provider', () => {
    const sessions: Session[] = [
      { ...makeSession(120), provider: 'claude' },
      { ...makeSession(120), provider: 'codex' },
      { ...makeSession(120), provider: 'claude' },
    ]
    const result = computeAnalytics(sessions)
    expect(result.byProvider.claude).toBe(2)
    expect(result.byProvider.codex).toBe(1)
  })

  it('weekTrend is null when no previous week data', () => {
    const sessions = [makeSession(120, 1), makeSession(120, 2)]
    expect(computeAnalytics(sessions).weekTrend).toBeNull()
  })

  it('positive trend when recent sessions longer', () => {
    const recent = Array.from({ length: 3 }, () => makeSession(240, 2))
    const older = Array.from({ length: 3 }, () => makeSession(120, 10))
    const result = computeAnalytics([...recent, ...older])
    expect(result.weekTrend).toBeGreaterThan(0)
  })
})
