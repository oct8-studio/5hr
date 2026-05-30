import { execSync, spawnSync } from 'child_process'
import os from 'os'
import type { WarmupSchedule } from '@5hr/core'

function toCronExpression(timeStr: string): { hour: number; minute: number } {
  const [h, m] = timeStr.split(':').map(Number)
  return { hour: h, minute: m }
}

function buildCronEntry(time: string, provider: string): string {
  const { hour, minute } = toCronExpression(time)
  return `${minute} ${hour} * * 1-5 5hr start ${provider} --warmup`
}

export function installCronJobs(
  warmupSchedule: WarmupSchedule[],
  provider: string
): void {
  const platform = os.platform()
  if (platform === 'win32') {
    installWindowsTask(warmupSchedule[0].warmupTime, provider)
    return
  }

  let existing = ''
  try {
    existing = execSync('crontab -l', { encoding: 'utf8' })
  } catch {
    existing = ''
  }

  const marker = `# 5hr:${provider}`
  const filtered = existing
    .split('\n')
    .filter((l) => !l.includes(marker))
    .join('\n')
    .trim()

  const entries = warmupSchedule
    .map((w, i) => `${buildCronEntry(w.warmupTime, provider)} ${marker}:warmup${i + 1}`)
    .join('\n')

  const newCrontab = [filtered, entries, ''].filter(Boolean).join('\n')
  execSync(`echo "${newCrontab.replace(/"/g, '\\"')}" | crontab -`)
}

export function removeCronJobs(provider: string): void {
  const platform = os.platform()
  if (platform === 'win32') {
    spawnSync('schtasks', ['/delete', '/tn', `5hr-${provider}`, '/f'])
    return
  }

  let existing = ''
  try {
    existing = execSync('crontab -l', { encoding: 'utf8' })
  } catch {
    return
  }

  const marker = `# 5hr:${provider}`
  const filtered = existing
    .split('\n')
    .filter((l) => !l.includes(marker))
    .join('\n')
    .trim()

  execSync(`echo "${filtered.replace(/"/g, '\\"')}" | crontab -`)
}

function installWindowsTask(time: string, provider: string): void {
  const { hour, minute } = toCronExpression(time)
  const startTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  spawnSync('schtasks', [
    '/create', '/tn', `5hr-${provider}`,
    '/tr', `5hr start ${provider} --warmup`,
    '/sc', 'DAILY', '/st', startTime, '/f',
  ])
}

export function checkCronAvailable(): boolean {
  const platform = os.platform()
  if (platform === 'win32') {
    return spawnSync('where', ['schtasks'], { encoding: 'utf8' }).status === 0
  }
  if (spawnSync('which', ['cron'], { encoding: 'utf8' }).status === 0) return true
  return spawnSync('which', ['crontab'], { encoding: 'utf8' }).status === 0
}
