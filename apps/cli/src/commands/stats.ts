import { Command } from 'commander'
import { loadSessions, hasConfig, computeAnalytics } from '@5hr/core'
import { checkAndExpireSessions } from '../utils/timeout.js'
import { bar, fmtDuration, fmtTrend } from '../utils/output.js'

export const statsCmd = new Command('stats')
  .description('Show session analytics and quota utilization')
  .action(() => {
    if (!hasConfig()) {
      console.error('  No config found. Run `5hr init` first.')
      process.exit(1)
    }

    checkAndExpireSessions()

    const sessions = loadSessions()

    if (sessions.filter((s) => s.durationMinutes !== undefined).length === 0) {
      console.log('\n  No completed sessions yet. Start one with `5hr start claude`.\n')
      return
    }

    const stats = computeAnalytics(sessions)

    const byProviderStr = Object.entries(stats.byProvider)
      .map(([p, n]) => `${p}: ${n}`)
      .join(', ')

    console.log('\n  Total Sessions   ', stats.totalSessions, `  (${byProviderStr})`)
    console.log('\n  Avg Duration     ', fmtDuration(stats.avgDurationMinutes))
    console.log(
      '\n  Utilization      ',
      `${stats.utilizationPct}%   ${bar(stats.utilizationPct)}`
    )
    console.log('\n  Wasted Time      ', fmtDuration(stats.wastedMinutes), ' (estimated)')
    console.log('\n  Trend            ', fmtTrend(stats.weekTrend))
    console.log()
  })
