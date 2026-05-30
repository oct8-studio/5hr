export function bar(pct: number, width = 10): string {
  const filled = Math.round((pct / 100) * width)
  return '█'.repeat(filled) + '░'.repeat(width - filled)
}

export function fmtDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function fmtTrend(pct: number | null): string {
  if (pct === null) return 'not enough data'
  const sign = pct >= 0 ? '↑ +' : '↓ '
  return `${sign}${Math.abs(pct)}% vs last week`
}
