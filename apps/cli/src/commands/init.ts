import { Command } from 'commander'
import { input, select, number, confirm } from '@inquirer/prompts'
import { saveConfig, type Config } from '@5hr/core'

export const initCmd = new Command('init')
  .description('Set up 5hr with your preferences')
  .action(async () => {
    console.log('\n  5hr setup wizard\n')

    const timezone = await input({
      message: 'Your timezone (e.g. America/New_York):',
      default: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })

    const workStart = await input({
      message: 'Working hours start (HH:MM):',
      default: '09:00',
      validate: (v) => /^\d{2}:\d{2}$/.test(v) || 'Use HH:MM format',
    })

    const workEnd = await input({
      message: 'Working hours end (HH:MM):',
      default: '18:00',
      validate: (v) => /^\d{2}:\d{2}$/.test(v) || 'Use HH:MM format',
    })

    const hasFocus = await confirm({
      message: 'Do you have a regular deep-focus period?',
      default: false,
    })

    const focusPeriods: Config['focusPeriods'] = []
    if (hasFocus) {
      const fStart = await input({
        message: 'Focus period start (HH:MM):',
        default: '10:00',
        validate: (v) => /^\d{2}:\d{2}$/.test(v) || 'Use HH:MM format',
      })
      const fEnd = await input({
        message: 'Focus period end (HH:MM):',
        default: '13:00',
        validate: (v) => /^\d{2}:\d{2}$/.test(v) || 'Use HH:MM format',
      })
      focusPeriods.push({ start: fStart, end: fEnd })
    }

    const primaryProvider = await select<'claude' | 'codex'>({
      message: 'Primary AI coding provider:',
      choices: [
        { name: 'Claude Code', value: 'claude' },
        { name: 'Codex CLI', value: 'codex' },
      ],
    })

    const sessionTimeoutMinutes = await number({
      message: 'Auto-timeout inactive sessions after (minutes):',
      default: 30,
    })

    const config: Config = {
      workingHours: { start: workStart, end: workEnd },
      timezone,
      focusPeriods,
      primaryProvider,
      sessionTimeoutMinutes: sessionTimeoutMinutes ?? 30,
    }

    saveConfig(config)

    console.log('\n  Config saved to ~/.5hr/config.json')
    console.log(`\n  Working hours  ${workStart} → ${workEnd}`)
    console.log(`  Timezone       ${timezone}`)
    console.log(`  Provider       ${primaryProvider}`)
    console.log(`  Timeout        ${sessionTimeoutMinutes}m`)
    console.log('\n  Run `5hr today` to see your recommended schedule.\n')
  })
