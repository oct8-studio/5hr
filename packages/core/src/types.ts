export type ProviderName = 'claude' | 'codex'

export interface Config {
  workingHours: { start: string; end: string }
  timezone: string
  focusPeriods: Array<{ start: string; end: string }>
  primaryProvider: ProviderName
  sessionTimeoutMinutes: number
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

export interface PlanResult {
  windows: WindowRecommendation[]
  utilizationPct: number
  providerStatus: Partial<Record<ProviderName, 'active' | 'idle'>>
}
