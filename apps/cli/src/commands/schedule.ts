import { Command } from 'commander'
import { confirm } from '@inquirer/prompts'
import { loadConfig, loadSessions, loadState, hasConfig } from '@5hr/core'
import { computePlan } from '@5hr/planner'
import { installCronJobs, checkCronAvailable } from '@5hr/scheduler'
import { checkAndExpireSessions } from '../utils/timeout.js'

export const scheduleCmd = new Command('schedule')
  .description('Install OS-native cron jobs to warmup AI sessions automatically')
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
    const offset = config.warmupOffsetHours ?? 2

    console.log(`\n  Auto-warmup schedule for ${provider} (Mon–Fri)\n`)
    console.log(`  Offset: ${offset}h before your ${config.workingHours.start} work start\n`)

    plan.warmupSchedule.forEach((w, i) => {
      console.log(`  Warmup ${i + 1}   fires ${w.warmupTime}  →  reset at ${w.resetTime}`)
    })

    console.log(`\n  When you sit down at ${config.workingHours.start}, window ${plan.warmupSchedule[0].resetTime} reset`)
    console.log(`  is already counting down. You get maximum quota during your productive hours.\n`)

    const ok = await confirm({ message: 'Install these cron jobs?', default: true })
    if (!ok) {
      console.log('  Cancelled.\n')
      return
    }

    installCronJobs(plan.warmupSchedule, provider)

    console.log(`\n  Done. ${provider} will warmup silently at ${plan.warmupSchedule.map(w => w.warmupTime).join(' and ')}.`)
    console.log(`  To remove: crontab -e → delete lines containing # 5hr:${provider}\n`)
  })
