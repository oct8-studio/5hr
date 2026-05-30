import { spawn, spawnSync } from 'child_process'
import type { ProviderAdapter } from './types.js'

export const claudeProvider: ProviderAdapter = {
  name: 'claude',
  windowHours: 5,
  getBinaryName: () => 'claude',

  // Opens the full interactive TUI — for manual use
  async launch(): Promise<void> {
    const child = spawn('claude', [], {
      detached: true,
      stdio: 'inherit',
    })
    child.unref()
  },

  // Sends a real message headlessly — starts the 5hr rolling clock without opening TUI
  // Used by cron so the reset happens before you sit down at your desk
  async warmup(): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn('claude', ['-p', 'hello'], {
        detached: true,
        stdio: ['ignore', 'ignore', 'ignore'],
      })
      child.unref()
      child.on('error', reject)
      child.on('spawn', resolve)
    })
  },

  async detectRunning(): Promise<boolean> {
    const result = spawnSync('pgrep', ['-x', 'claude'], { encoding: 'utf8' })
    return result.status === 0
  },
}
