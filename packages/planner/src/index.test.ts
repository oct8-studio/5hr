import { describe, it, expect } from 'vitest'
import { computePlan, computeExplain } from './index.js'
import type { Config, Session, State } from '@5hr/core'

const baseConfig: Config = {
  workingHours: { start: '09:00', end: '18:00' },
  timezone: 'UTC',
  focusPeriods: [],
  primaryProvider: 'claude',
  sessionTimeoutMinutes: 30,
}

const emptyState: State = { activeSessions: {} }

function makeSession(startHour: number, durationMinutes: number): Session {
  const startedAt = `2026-01-15T${String(startHour).padStart(2, '0')}:00:00.000Z`
  const end = new Date(new Date(startedAt).getTime() + durationMinutes * 60_000)
  return {
    id: Math.random().toString(36).slice(2),
    provider: 'claude',
    startedAt,
    endedAt: end.toISOString(),
    durationMinutes,
  }
}

describe('computePlan', () => {
  it('defaults to working hours start with no history', () => {
    const plan = computePlan(baseConfig, [], emptyState)
    expect(plan.windows[0].start).toBe('09:00')
    expect(plan.windows[0].end).toBe('14:00')
  })

  it('window 1 is exactly 5 hours', () => {
    const plan = computePlan(baseConfig, [], emptyState)
    const [h1, m1] = plan.windows[0].start.split(':').map(Number)
    const [h2, m2] = plan.windows[0].end.split(':').map(Number)
    expect(h2 * 60 + m2 - (h1 * 60 + m1)).toBe(300)
  })

  it('window 2 starts 45 min after window 1 ends', () => {
    const plan = computePlan(baseConfig, [], emptyState)
    const [h1, m1] = plan.windows[1].start.split(':').map(Number)
    const [h2, m2] = plan.windows[0].end.split(':').map(Number)
    expect(h1 * 60 + m1 - (h2 * 60 + m2)).toBe(45)
  })

  it('shifts window start to median when enough history', () => {
    const sessions = Array.from({ length: 5 }, () => makeSession(11, 180))
    const plan = computePlan(baseConfig, sessions, emptyState)
    expect(plan.windows[0].start).toBe('11:00')
  })

  it('utilization is 0 with no completed sessions', () => {
    expect(computePlan(baseConfig, [], emptyState).utilizationPct).toBe(0)
  })

  it('utilization reflects avg duration', () => {
    const sessions = Array.from({ length: 5 }, () => makeSession(9, 150))
    const plan = computePlan(baseConfig, sessions, emptyState)
    expect(plan.utilizationPct).toBe(50)
  })

  it('marks active sessions in provider status', () => {
    const state: State = {
      activeSessions: {
        claude: { id: 'x', provider: 'claude', startedAt: new Date().toISOString() },
      },
    }
    const plan = computePlan(baseConfig, [], state)
    expect(plan.providerStatus.claude).toBe('active')
  })
})

describe('computeExplain', () => {
  it('returns baseline start with no history', () => {
    const result = computeExplain(baseConfig, [])
    expect(result.recommendedStart).toBe('09:00')
    expect(result.medianStart).toBeNull()
    expect(result.gainPct).toBe(0)
    expect(result.minutesSaved).toBe(0)
  })

  it('shows gain when history shifts start later', () => {
    const sessions = Array.from({ length: 5 }, () => makeSession(11, 180))
    const result = computeExplain(baseConfig, sessions)
    expect(result.recommendedStart).toBe('11:00')
    expect(result.minutesSaved).toBe(120)
    expect(result.gainPct).toBeGreaterThan(0)
  })

  it('second window fits within extended working hours', () => {
    const result = computeExplain(baseConfig, [])
    expect(result.canFitSecondWindow).toBe(true)
  })
})
