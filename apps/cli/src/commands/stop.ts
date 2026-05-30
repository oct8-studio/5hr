import { Command } from 'commander'
import { loadState, saveState, appendSession, hasConfig } from '@5hr/core'
import { listProviders } from '@5hr/providers'
import { checkAndExpireSessions } from '../utils/timeout.js'
import { fmtDuration } from '../utils/output.js'

export const stopCmd = new Command('stop')
  .description('End an AI coding session')
  .argument('[provider]', 'Provider to stop (defaults to all active)')
  .action((providerName?: string) => {
    if (!hasConfig()) {
      console.error('  No config found. Run `5hr init` first.')
      process.exit(1)
    }

    checkAndExpireSessions()

    const state = loadState()
    const active = Object.entries(state.activeSessions).filter(
      ([k, v]) => v && (!providerName || k === providerName)
    )

    if (active.length === 0) {
      console.log('  No active sessions to stop.')
      return
    }

    console.log()
    for (const [provider, session] of active) {
      if (!session) continue
      const endedAt = new Date().toISOString()
      const durationMinutes = Math.round(
        (Date.now() - new Date(session.startedAt).getTime()) / 60_000
      )
      appendSession({ ...session, endedAt, durationMinutes })
      delete state.activeSessions[provider as keyof typeof state.activeSessions]
      console.log(`  ${provider}  ${fmtDuration(durationMinutes)} session ended`)
    }

    saveState(state)
    console.log()
  })
