import { spawn, spawnSync } from 'child_process'
import type { ProviderAdapter } from './types.js'

export const codexProvider: ProviderAdapter = {
  name: 'codex',
  windowHours: 5,
  getBinaryName: () => 'codex',

  async launch(): Promise<void> {
    const child = spawn('codex', [], {
      detached: true,
      stdio: 'inherit',
    })
    child.unref()
  },

  async detectRunning(): Promise<boolean> {
    const result = spawnSync('pgrep', ['-x', 'codex'], { encoding: 'utf8' })
    return result.status === 0
  },
}
