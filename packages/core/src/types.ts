export type ProviderName = 'claude' | 'codex'

export interface Config {
  workingHours: { start: string; end: string }
  timezone: string
  focusPeriods: Array<{ start: string; end: string }>
  primaryProvider: ProviderName
  sessionTimeoutMinutes: number
  warmupOffsetHours: number  // how many hours BEFORE work start to fire warmup (default 2)
}

export interface Session {
  id: string
  provider: ProviderName
  startedAt: string
  endedAt?: string
  durationMinutes?: number
}

export interface State {
  activeSessions: Partial<Record<ProviderName, Session>>
}

export interface WindowRecommendation {
  start: string
  end: string
}

export interface WarmupSchedule {
  warmupTime: string   // when cron fires (before work start)
  resetTime: string    // when the 5hr window resets (warmupTime + 5h)
}

export interface PlanResult {
  windows: WindowRecommendation[]
  warmupSchedule: WarmupSchedule[]
  utilizationPct: number
  providerStatus: Partial<Record<ProviderName, 'active' | 'idle'>>
}
