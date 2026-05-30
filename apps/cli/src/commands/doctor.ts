import { Command } from 'commander'
import { spawnSync } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { loadConfig, DIR } from '@5hr/core'
import { checkCronAvailable } from '@5hr/scheduler'

function check(label: string, ok: boolean, detail?: string): void {
  const icon = ok ? '✓' : '✗'
  const line = `  ${icon}  ${label}`
  console.log(ok ? line : `${line}  ${detail ?? ''}`)
}

function binaryExists(bin: string): boolean {
  const result = spawnSync('which', [bin], { encoding: 'utf8' })
  if (result.status === 0) return true
  const result2 = spawnSync('where', [bin], { encoding: 'utf8' })
  return result2.status === 0
}

function validateConfig(): { ok: boolean; reason?: string } {
  const config = loadConfig()
  if (!config) return { ok: false, reason: 'not found — run `5hr init`' }
  if (!config.workingHours?.start || !config.workingHours?.end)
    return { ok: false, reason: 'missing workingHours' }
  if (!config.timezone) return { ok: false, reason: 'missing timezone' }
  if (!config.primaryProvider) return { ok: false, reason: 'missing primaryProvider' }
  return { ok: true }
}

function checkStorage(): { ok: boolean; reason?: string } {
  if (!fs.existsSync(DIR)) return { ok: false, reason: `${DIR} does not exist` }
  try {
    const testFile = path.join(DIR, '.write-test')
    fs.writeFileSync(testFile, 'ok')
    fs.unlinkSync(testFile)
    return { ok: true }
  } catch {
    return { ok: false, reason: `${DIR} not writable` }
  }
}

export const doctorCmd = new Command('doctor')
  .description('Check that 5hr is configured correctly')
  .action(() => {
    console.log('\n  5hr doctor\n')

    const claudeOk = binaryExists('claude')
    const codexOk = binaryExists('codex')
    check('claude binary in PATH', claudeOk, 'install claude: https://claude.ai/download')
    check('codex binary in PATH', codexOk, 'install codex: npm install -g @openai/codex')

    const cfgResult = validateConfig()
    check('config valid', cfgResult.ok, cfgResult.reason)

    const cronOk = checkCronAvailable()
    check(
      `OS scheduler available (${os.platform() === 'win32' ? 'schtasks' : 'cron'})`,
      cronOk,
      'scheduling unavailable on this system'
    )

    const storageResult = checkStorage()
    check('storage dir readable/writable', storageResult.ok, storageResult.reason)

    const allOk = claudeOk && cfgResult.ok && cronOk && storageResult.ok
    console.log(allOk ? '\n  All checks passed.\n' : '\n  Some checks failed. Fix issues above.\n')
  })
