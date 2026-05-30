# 5hr

## Product Requirements Document (PRD)

Version: v0.1

---

# Vision

5hr helps developers maximize usage of AI coding assistants that operate under rolling usage windows.

Instead of manually managing when to start Claude Code, Codex, or other AI coding agents, developers use 5hr to intelligently plan, schedule, and optimize sessions based on their working habits.

The goal is simple:

**Never waste a 5-hour window again.**

---

# Problem

Modern AI coding tools often have:

* Rolling usage windows
* Message caps
* Soft throttling
* Daily productivity constraints

Developers frequently:

* Start sessions too early
* Waste active windows while idle
* Miss opportunities for additional usage cycles
* Have no visibility into actual quota efficiency

Today, all of this is managed manually.

5hr becomes the planning and scheduling layer above AI coding tools.

---

# Product Positioning

5hr is not:

* Another AI assistant
* A Claude wrapper
* A terminal multiplexer
* A process manager

5hr is:

**A quota-aware scheduling and optimization tool for AI coding sessions.**

---

# Goals

## Primary Goals

* Maximize productive AI usage time
* Minimize wasted rolling-window time
* Automatically recommend optimal session start times
* Support multiple AI coding providers
* Remain lightweight and local-first

---

## Secondary Goals

* Provide usage analytics
* Improve recommendations over time
* Support automation through native OS schedulers
* Build an extensible provider ecosystem

---

# Non-Goals (v0.1)

The following are intentionally excluded:

* Cloud sync
* SaaS accounts
* Telemetry
* Provider API integrations
* Web dashboards
* GUI applications
* LLM-powered recommendations

---

# Target Users

## Primary

* Claude Code users
* Codex CLI users
* Developers paying for AI subscriptions
* Terminal-first engineers

## Secondary

* Open source contributors
* AI-heavy development teams
* Productivity-focused developers

---

# Core User Stories

## Session Planning

As a developer,

I want to know the best time to start an AI coding session,

so I can maximize usable quota.

---

## Schedule Optimization

As a developer,

I want recommendations based on my working habits,

so I don't have to manually calculate windows.

---

## Lightweight Automation

As a developer,

I want automation without background services,

so my machine stays fast.

---

## Multi-Provider Support

As a developer,

I want to use multiple AI coding tools,

so I can switch providers without changing workflows.

---

# Functional Requirements

## Initialization

Command:

```bash
5hr init
```

Setup wizard should collect:

* Working hours
* Preferred focus periods
* Primary provider
* Timezone

---

## Daily Planning

Command:

```bash
5hr today
```

Example:

```text
Recommended schedule

Window 1
10:30 → 15:30

Window 2
16:15 → 21:15

Estimated utilization
89%
```

---

## Explain Recommendations

Command:

```bash
5hr explain
```

Example:

```text
Recommended start: 10:42

Why?

• Most coding activity begins around 10:50
• Starting at 09:00 wastes approximately 1h 35m
• Delaying allows a second usable cycle

Estimated gain: +17%
```

---

## Launch Providers

Command:

```bash
5hr start claude
```

or

```bash
5hr start codex
```

Responsibilities:

* Launch executable
* Track session start
* Record usage metadata

---

## Scheduling

Command:

```bash
5hr schedule
```

Responsibilities:

* Install OS-native scheduled jobs
* Avoid long-running daemons
* Support future automation

---

## Analytics

Command:

```bash
5hr stats
```

Example:

```text
Total Sessions: 48

Average Duration:
2h 17m

Estimated Utilization:
82%

Estimated Wasted Time:
11h 32m
```

---

# Design Principles

## Lightweight

No persistent daemon required.

Use native schedulers whenever possible.

---

## Local First

All data stays on the user's machine.

No accounts.

No telemetry.

No cloud services.

---

## Fast

Startup target:

Less than 150ms

---

## Portable

Must support:

* Linux
* macOS
* Windows

---

# Technical Architecture

## Runtime

* Node.js
* TypeScript

---

## CLI Framework

* Commander.js

---

## Build System

* tsup

---

## Binary Packaging

* pkg

---

## Storage

JSON-based storage initially.

No database required.

---

# System Architecture

```text
┌──────────────────────┐
│      5hr CLI         │
├──────────────────────┤
│ Config Manager       │
│ Planner Engine       │
│ Scheduler Layer      │
│ Provider Registry    │
│ Analytics Engine     │
└──────────────────────┘
```

---

# Storage Layout

Configuration:

```text
~/.5hr/config.json
```

State:

```text
~/.5hr/state.json
```

Sessions:

```text
~/.5hr/sessions.json
```

---

# Provider Architecture

Provider Interface:

```ts
interface ProviderAdapter {
  name: string

  launch(): Promise<void>

  detectRunning(): Promise<boolean>
}
```

Initial providers:

* Claude Code
* Codex CLI

Future providers:

* Gemini CLI
* Aider
* OpenCode

---

# Scheduler Architecture

Linux:

* cron

macOS:

* cron
* launchd (future)

Windows:

* schtasks

The application should never require a permanent background service.

---

# Initial Command Set

```bash
5hr init

5hr today

5hr explain

5hr start claude

5hr start codex

5hr schedule

5hr stats

5hr doctor
```

---

# Analytics

Metrics:

* Total sessions
* Average session duration
* Utilization score
* Wasted quota estimate
* Daily productivity trends

---

# Security

Requirements:

* No arbitrary code execution
* No telemetry
* No cloud communication
* No elevated privileges

---

# Success Metrics

Technical:

* Under 20MB packaged size
* Under 150ms startup
* Zero CPU usage while idle

Product:

* Daily active usage
* Repeat usage after setup
* Positive developer feedback
* OSS contributor growth

---

# Long-Term Vision

Become the standard orchestration layer for AI coding tools.

Today:

Claude Code and Codex.

Tomorrow:

Any AI agent with quotas, rolling windows, or usage constraints.

5hr should be the first thing developers install after installing an AI coding assistant.
