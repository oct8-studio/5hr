import fs from 'fs'
import path from 'path'
import os from 'os'
import type { Config, Session, State } from './types.js'

export const DIR = path.join(os.homedir(), '.5hr')
const CONFIG_PATH = path.join(DIR, 'config.json')
const STATE_PATH = path.join(DIR, 'state.json')
const SESSIONS_PATH = path.join(DIR, 'sessions.json')

function ensureDir(): void {
  if (!fs.existsSync(DIR)) {
    fs.mkdirSync(DIR, { recursive: true })
  }
}

function atomicWrite(filePath: string, data: unknown): void {
  ensureDir()
  const tmp = `${filePath}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8')
  fs.renameSync(tmp, filePath)
}

function readJson<T>(filePath: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T
  } catch {
    return fallback
  }
}

export function loadConfig(): Config | null {
  if (!fs.existsSync(CONFIG_PATH)) return null
  return readJson<Config>(CONFIG_PATH, null as unknown as Config)
}

export function saveConfig(config: Config): void {
  atomicWrite(CONFIG_PATH, config)
}

export function hasConfig(): boolean {
  return fs.existsSync(CONFIG_PATH)
}

export function loadState(): State {
  return readJson<State>(STATE_PATH, { activeSessions: {} })
}

export function saveState(state: State): void {
  atomicWrite(STATE_PATH, state)
}

export function loadSessions(): Session[] {
  return readJson<Session[]>(SESSIONS_PATH, [])
}

export function appendSession(session: Session): void {
  const sessions = loadSessions()
  const idx = sessions.findIndex((s) => s.id === session.id)
  if (idx >= 0) {
    sessions[idx] = session
  } else {
    sessions.push(session)
  }
  atomicWrite(SESSIONS_PATH, sessions)
}
