import { Command } from 'commander'
import { loadConfig, loadSessions, loadState, hasConfig } from '@5hr/core'
import { computePlan } from '@5hr/planner'
import { checkAndExpireSessions } from '../utils/timeout.js'
import { bar } from '../utils/output.js'

export const todayCmd = new Command('today')
  .description('Show recommended AI session schedule for today')
  .action(() => {
    if (!hasConfig()) {
      console.error('  No config found. Run `5hr init` first.')
      process.exit(1)
    }

    checkAndExpireSessions()

    const config = loadConfig()!
    const sessions = loadSessions()
    const state = loadState()

    const plan = computePlan(config, sessions, state)

    console.log('\n  Recommended schedule\n')
    plan.windows.forEach((w, i) => {
      console.log(`  Window ${i + 1}    ${w.start} → ${w.end}`)
    })

    console.log(`\n  Estimated utilization   ${plan.utilizationPct}%`)

    if (Object.keys(plan.providerStatus).length > 0) {
      console.log('\n  Providers')
      const allProviders = ['claude', 'codex'] as const
      for (const p of allProviders) {
        const status = plan.providerStatus[p] ?? 'idle'
        console.log(`  ${p.padEnd(8)} ${bar(status === 'active' ? 80 : 0)}  ${status}`)
      }
    }

    console.log()
  })
