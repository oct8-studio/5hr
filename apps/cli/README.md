# 5hr

**Never waste a 5-hour AI coding window again.**

5hr is a quota-aware scheduling and optimization tool for AI coding sessions. It tracks when you use Claude Code, Codex, and other AI tools — then recommends the optimal time to start your next session so you never leave quota on the table.

---

## Install

```bash
npm install -g @oct8/5hr
```

## Quick Start

```bash
5hr init        # one-time setup (takes ~1 min)
5hr doctor      # verify everything is working
5hr today       # see your recommended schedule
5hr start claude  # start a tracked session
5hr stop          # end the session
5hr stats         # see your usage analytics
```

---

## Commands

| Command | Description |
|---|---|
| `5hr init` | Interactive setup wizard |
| `5hr today` | Recommended session schedule for today |
| `5hr explain` | Why 5hr recommends that start time |
| `5hr start <provider>` | Start a tracked AI session |
| `5hr stop [provider]` | End a session |
| `5hr stats` | Usage analytics and utilization score |
| `5hr schedule` | Install OS-native scheduled jobs |
| `5hr doctor` | Check your installation |

## Providers

- `claude` — Claude Code
- `codex` — OpenAI Codex CLI

## How It Works

5hr stores session history locally in `~/.5hr/`. After a few sessions, it learns your natural coding rhythm and shifts window recommendations to match — so you start at the right time, not just when your working hours begin.

**No cloud. No accounts. No background services.**

---

## Data

All data lives in `~/.5hr/`:

```
~/.5hr/config.json    # your preferences
~/.5hr/state.json     # active sessions
~/.5hr/sessions.json  # session history
```

---

## License

MIT
