import { spawn, spawnSync } from 'child_process'
import type { ProviderAdapter } from './types.js'

export const claudeProvider: ProviderAdapter = {
  name: 'claude',
  windowHours: 5,
  getBinaryName: () => 'claude',

  async launch(): Promise<void> {
    const child = spawn('claude', [], {
      detached: true,
      stdio: 'inherit',
    })
    child.unref()
  },

  async detectRunning(): Promise<boolean> {
    const result = spawnSync('pgrep', ['-x', 'claude'], { encoding: 'utf8' })
    return result.status === 0
  },
}
