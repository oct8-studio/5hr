import { Command } from 'commander'
import { select, input, number } from '@inquirer/prompts'
import { loadConfig, saveConfig, hasConfig } from '@5hr/core'
import { computeWarmupSchedule } from '@5hr/planner'

export const settingsCmd = new Command('settings')
  .description('View and edit your 5hr configuration')
  .action(async () => {
    if (!hasConfig()) {
      console.error('  No config found. Run `5hr init` first.')
      process.exit(1)
    }

    const config = loadConfig()!
    const warmup = computeWarmupSchedule(config)
    const offset = config.warmupOffsetHours ?? 2

    console.log('\n  Current settings\n')
    console.log(`  Working hours    ${config.workingHours.start} → ${config.workingHours.end}`)
    console.log(`  Timezone         ${config.timezone}`)
    console.log(`  Provider         ${config.primaryProvider}`)
    console.log(`  Warmup offset    ${offset}h before work start`)
    console.log(`  Warmup 1 fires   ${warmup[0].warmupTime}  →  reset at ${warmup[0].resetTime}`)
    console.log(`  Warmup 2 fires   ${warmup[1].warmupTime}  →  reset at ${warmup[1].resetTime}`)
    console.log(`  Session timeout  ${config.sessionTimeoutMinutes}m`)
    console.log()

    const field = await select<string>({
      message: 'Edit a setting:',
      choices: [
        { name: `Warmup offset    (now: ${offset}h before work start)`, value: 'warmupOffset' },
        { name: `Working hours    (now: ${config.workingHours.start} → ${config.workingHours.end})`, value: 'workingHours' },
        { name: `Provider         (now: ${config.primaryProvider})`, value: 'provider' },
        { name: `Session timeout  (now: ${config.sessionTimeoutMinutes}m)`, value: 'timeout' },
        { name: 'Done — no changes', value: 'done' },
      ],
    })

    if (field === 'done') {
      console.log()
      return
    }

    if (field === 'warmupOffset') {
      const val = await number({
        message: 'Hours before work start to fire warmup:',
        default: offset,
        validate: (v) => (v !== undefined && v >= 0 && v <= 8) || 'Between 0 and 8',
      })
      config.warmupOffsetHours = val ?? offset
      const newWarmup = computeWarmupSchedule(config)
      console.log(`\n  Warmup will now fire at ${newWarmup[0].warmupTime} → reset at ${newWarmup[0].resetTime}`)
    }

    if (field === 'workingHours') {
      const start = await input({
        message: 'Working hours start (HH:MM):',
        default: config.workingHours.start,
        validate: (v) => /^\d{2}:\d{2}$/.test(v) || 'Use HH:MM format',
      })
      const end = await input({
        message: 'Working hours end (HH:MM):',
        default: config.workingHours.end,
        validate: (v) => /^\d{2}:\d{2}$/.test(v) || 'Use HH:MM format',
      })
      config.workingHours = { start, end }
    }

    if (field === 'provider') {
      const provider = await select<'claude' | 'codex'>({
        message: 'Primary provider:',
        choices: [
          { name: 'Claude Code', value: 'claude' },
          { name: 'Codex CLI', value: 'codex' },
        ],
      })
      config.primaryProvider = provider
    }

    if (field === 'timeout') {
      const val = await number({
        message: 'Auto-timeout after (minutes):',
        default: config.sessionTimeoutMinutes,
      })
      config.sessionTimeoutMinutes = val ?? config.sessionTimeoutMinutes
    }

    saveConfig(config)
    console.log('\n  Settings saved. Run `5hr schedule` to reinstall cron jobs with new times.\n')
  })
