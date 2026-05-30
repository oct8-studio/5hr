import { Command } from 'commander'
import { randomUUID } from 'crypto'
import { loadState, saveState, appendSession, loadConfig, hasConfig } from '@5hr/core'
import { getProvider, listProviders } from '@5hr/providers'
import { checkAndExpireSessions } from '../utils/timeout.js'

export const startCmd = new Command('start')
  .description('Start an AI coding session')
  .argument('<provider>', `Provider to launch (${listProviders().join(', ')})`)
  .action(async (providerName: string) => {
    if (!hasConfig()) {
      console.error('  No config found. Run `5hr init` first.')
      process.exit(1)
    }

    checkAndExpireSessions()

    const provider = getProvider(providerName)
    if (!provider) {
      console.error(`  Unknown provider: ${providerName}`)
      console.error(`  Available: ${listProviders().join(', ')}`)
      process.exit(1)
    }

    const state = loadState()
    if (state.activeSessions[providerName as keyof typeof state.activeSessions]) {
      console.log(`  ${providerName} session already active. Run \`5hr stop ${providerName}\` first.`)
      process.exit(1)
    }

    const session = {
      id: randomUUID(),
      provider: providerName as 'claude' | 'codex',
      startedAt: new Date().toISOString(),
    }

    state.activeSessions[providerName as keyof typeof state.activeSessions] = session
    saveState(state)
    appendSession(session)

    console.log(`\n  Starting ${providerName}...`)
    console.log(`  Session started at ${new Date().toLocaleTimeString()}`)
    console.log(`  Window ends at ${new Date(Date.now() + 5 * 60 * 60 * 1000).toLocaleTimeString()}`)
    console.log(`\n  Run \`5hr stop ${providerName}\` when done.\n`)

    await provider.launch()
  })
