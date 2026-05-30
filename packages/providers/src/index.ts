export type { ProviderAdapter } from './types.js'
export { claudeProvider } from './claude.js'
export { codexProvider } from './codex.js'

import type { ProviderAdapter } from './types.js'
import { claudeProvider } from './claude.js'
import { codexProvider } from './codex.js'

const registry: Record<string, ProviderAdapter> = {
  claude: claudeProvider,
  codex: codexProvider,
}

export function getProvider(name: string): ProviderAdapter | null {
  return registry[name] ?? null
}

export function listProviders(): string[] {
  return Object.keys(registry)
}
