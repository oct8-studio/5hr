import { spawn, spawnSync } from 'child_process'
import type { ProviderAdapter } from './types.js'

export const codexProvider: ProviderAdapter = {
  name: 'codex',
  windowHours: 5,
  getBinaryName: () => 'codex',

  // Opens the full interactive TUI — for manual use
  async launch(): Promise<void> {
    const child = spawn('codex', [], {
      detached: true,
      stdio: 'inherit',
    })
    child.unref()
  },

  // Sends a real message headlessly — starts the 5hr rolling clock without opening TUI
  // Codex CLI uses --quiet (-q) flag for non-interactive single-prompt mode
  async warmup(): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn('codex', ['-q', 'hello', '--approval-mode', 'suggest'], {
        detached: true,
        stdio: ['ignore', 'ignore', 'ignore'],
      })
      child.unref()
      child.on('error', reject)
      child.on('spawn', resolve)
    })
  },

  async detectRunning(): Promise<boolean> {
    const result = spawnSync('pgrep', ['-x', 'codex'], { encoding: 'utf8' })
    return result.status === 0
  },
}
