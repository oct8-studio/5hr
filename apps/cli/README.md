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

| Command | Description |
|---|---|
| `5hr init` | Interactive setup wizard |
| `5hr schedule` | Install cron jobs to auto-warmup sessions |
| `5hr settings` | View and edit config interactively |
| `5hr today` | See your recommended session windows |
| `5hr explain` | Why 5hr recommends that start time |
| `5hr start <provider>` | Manually start a tracked session |
| `5hr stop [provider]` | End a session |
| `5hr stats` | Usage analytics and utilization score |
| `5hr doctor` | Check your installation |

## Providers

- `claude` — Claude Code (`claude -p` for headless warmup)
- `codex` — OpenAI Codex CLI (`codex -q` for headless warmup)

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
