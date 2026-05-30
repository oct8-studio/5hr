import { loadState, saveState, appendSession, loadConfig } from '@5hr/core'

export function checkAndExpireSessions(): void {
  const config = loadConfig()
  if (!config) return

  const state = loadState()
  const now = Date.now()
  const timeoutMs = config.sessionTimeoutMinutes * 60 * 1000
  let changed = false

  for (const [provider, session] of Object.entries(state.activeSessions)) {
    if (!session) continue
    const elapsed = now - new Date(session.startedAt).getTime()
    if (elapsed > timeoutMs) {
      const endedAt = new Date().toISOString()
      const durationMinutes = Math.round(elapsed / 60_000)
      appendSession({ ...session, endedAt, durationMinutes })
      delete state.activeSessions[provider as keyof typeof state.activeSessions]
      changed = true
      console.log(
        `  [auto-timeout] ${provider} session expired after ${durationMinutes}m`
      )
    }
  }

  if (changed) saveState(state)
}
