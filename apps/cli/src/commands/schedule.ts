import { Command } from 'commander'
import { confirm } from '@inquirer/prompts'
import { loadConfig, loadSessions, loadState, hasConfig } from '@5hr/core'
import { computePlan } from '@5hr/planner'
import { installCronJobs, checkCronAvailable } from '@5hr/scheduler'
import { checkAndExpireSessions } from '../utils/timeout.js'

export const scheduleCmd = new Command('schedule')
  .description('Install OS-native scheduled jobs for AI sessions')
  .action(async () => {
    if (!hasConfig()) {
      console.error('  No config found. Run `5hr init` first.')
      process.exit(1)
    }

    if (!checkCronAvailable()) {
      console.error('  No supported OS scheduler found (cron/schtasks).')
      process.exit(1)
    }

    checkAndExpireSessions()

    const config = loadConfig()!
    const sessions = loadSessions()
    const state = loadState()

    const plan = computePlan(config, sessions, state)
    const provider = config.primaryProvider

    console.log(`\n  Will auto-warmup ${provider} (Mon–Fri):\n`)
    plan.windows.forEach((w, i) => {
      console.log(`  Window ${i + 1}  ${w.start}  →  sends a real message to start your rolling 5hr clock`)
    })
    console.log(`\n  By the time you sit down, your reset is already counting down.`)
    console.log(`  You keep the full productive window. No wasted quota.\n`)

    const ok = await confirm({ message: 'Install these scheduled jobs?', default: true })
    if (!ok) {
      console.log('  Cancelled.\n')
      return
    }

    installCronJobs(plan.windows, provider)

    console.log(`\n  Done. Cron will warmup ${provider} silently at those times.`)
    console.log(`  To remove: crontab -e and delete lines containing # 5hr:${provider}\n`)
  })
