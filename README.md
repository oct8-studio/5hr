# 5hr

**Maximize your AI coding quota. Automatically.**

Claude Code and Codex run on 5-hour rolling usage windows. Most developers waste them by starting sessions at the wrong time — burning quota while idle, then hitting rate limits mid-flow.

5hr fixes this by firing a silent warmup message before you wake up, so the rolling clock starts early. By the time you sit down, your first reset is already counting down — and you get maximum quota exactly when you need it.

---

## How it works

```
08:00  cron fires → sends a silent message to Claude Code
10:00  you sit down → only 2hrs burned, reset coming at 13:00
13:00  RESET → fresh 5-hour window right when you're in flow
13:05  warmup 2 fires automatically
18:05  RESET → another full window for the evening
```

No wasted quota. No manual timing. No rate limit surprises mid-session.

---

## Install

```bash
npm install -g @oct8/5hr
```

## Quick Start

```bash
5hr init        # one-time setup (~1 min)
5hr schedule    # installs cron jobs — done, runs itself from here
```

That's it. Cron handles the rest every morning.

---

## Commands

### `5hr init`
Interactive setup wizard. Asks for your working hours, timezone, provider, and how early to fire the warmup before you start work. Run once, then `5hr schedule`.

### `5hr schedule`
Installs OS-native cron jobs (Linux/macOS) or scheduled tasks (Windows) that fire a silent warmup at the right time every weekday. Shows you exactly when warmups fire and when your resets land before confirming.

```
Warmup 1   fires 08:00  →  reset at 13:00
Warmup 2   fires 13:05  →  reset at 18:05
```

Re-run after changing settings to reinstall with new times.

### `5hr settings`
View your current config and edit any field interactively — warmup offset, working hours, provider, session timeout. No config file editing needed.

### `5hr today`
Shows your recommended session windows for today based on your working hours and past session history. After enough sessions, recommendations shift to match your actual coding rhythm.

```
Window 1    08:00 → 13:00
Window 2    13:45 → 18:45

Estimated utilization   82%
```

### `5hr explain`
Shows the reasoning behind today's recommendation — median historical start time, minutes saved vs starting at work hours, whether a second window fits, and estimated quota gain.

```
Recommended start: 10:30

Why?
• Most coding activity begins around 10:45
• Starting at 09:00 wastes approximately 1h 30m
• Delaying allows a second usable 5hr cycle today

Estimated gain: +17%
```

### `5hr start <provider>`
Manually start a tracked session and launch the provider TUI. Use `--warmup` flag for headless mode (cron uses this automatically).

```bash
5hr start claude   # opens Claude Code + starts tracking
5hr start codex    # opens Codex CLI + starts tracking
```

### `5hr stop [provider]`
End a session and record its duration. Omit provider to stop all active sessions.

```bash
5hr stop           # stops all active sessions
5hr stop claude    # stops claude only
```

### `5hr stats`
Usage analytics computed from your local session history.

```
Total Sessions    48   (claude: 32, codex: 16)

Avg Duration      2h 17m

Utilization       82%   ████████░░

Wasted Time       11h 32m  (estimated)

Trend             ↑ +8% vs last week
```

### `5hr doctor`
Health check for your installation. Verifies provider binaries, config validity, OS scheduler availability, and storage permissions.

```
✓  claude binary in PATH
✓  codex binary in PATH
✓  config valid
✓  OS scheduler available (cron)
✓  storage dir readable/writable
```

---

## Providers

| Provider | Binary | Warmup flag |
|---|---|---|
| Claude Code | `claude` | `claude -p "hello"` |
| Codex CLI | `codex` | `codex -q "hello"` |

---

## Configuration

Set during `5hr init`, editable anytime with `5hr settings`:

| Setting | Default | Description |
|---|---|---|
| Working hours | `09:00–18:00` | Your typical working day |
| Warmup offset | `2h` | How early before work start to fire warmup |
| Provider | `claude` | Primary AI coding tool |
| Session timeout | `60m` | Auto-close inactive sessions |

**Example with 10:00 start and 2h offset:**
```
Warmup 1 fires  08:00  →  reset at 13:00
Warmup 2 fires  13:05  →  reset at 18:05
```

Change offset to 3h → resets at 12:00 and 17:05. Run `5hr schedule` after any change to reinstall cron.

---

## Data

All data stays local in `~/.5hr/`:

```
~/.5hr/config.json    # preferences
~/.5hr/state.json     # active sessions
~/.5hr/sessions.json  # history (used to refine recommendations)
```

No cloud. No accounts. No background services.

---

## License

MIT — [@oct8](https://github.com/oct8-studio)
