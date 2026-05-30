import { Command } from 'commander'
import { loadConfig, loadSessions, hasConfig } from '@5hr/core'
import { computeExplain } from '@5hr/planner'
import { checkAndExpireSessions } from '../utils/timeout.js'
import { fmtDuration } from '../utils/output.js'

export const explainCmd = new Command('explain')
  .description('Explain why 5hr recommends a particular start time')
  .action(() => {
    if (!hasConfig()) {
      console.error('  No config found. Run `5hr init` first.')
      process.exit(1)
    }

    checkAndExpireSessions()

    const config = loadConfig()!
    const sessions = loadSessions()

    const result = computeExplain(config, sessions)

    console.log(`\n  Recommended start: ${result.recommendedStart}\n`)
    console.log('  Why?\n')

    if (result.medianStart) {
      console.log(`  • Most coding activity begins around ${result.medianStart}`)
    } else {
      console.log('  • Defaulting to your configured working hours start')
      console.log('    (run more sessions to get history-based recommendations)')
    }

    if (result.minutesSaved > 0) {
      console.log(
        `  • Starting at ${result.baselineStart} wastes approximately ${fmtDuration(result.minutesSaved)}`
      )
    }

    if (result.canFitSecondWindow) {
      console.log('  • Delaying allows a second usable 5hr cycle today')
    } else {
      console.log('  • A second window may not fit within your working hours')
    }

    if (result.gainPct > 0) {
      console.log(`\n  Estimated gain: +${result.gainPct}%\n`)
    } else {
      console.log()
    }
  })
