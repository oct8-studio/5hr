# 5hr Implementation Plan

## Phase 0 — Foundation (Day 1)

### Objectives

Create a production-ready repository structure.

### Deliverables

* Monorepo setup
* TypeScript configuration
* Linting
* Formatting
* CI pipeline
* npm publishing workflow

### Stack

* pnpm
* TypeScript
* tsup
* eslint
* prettier
* vitest

---

# Phase 1 — Core CLI (Days 2–3)

### Objectives

Build a usable command-line application.

### Tasks

* Commander.js setup
* Command registration
* Config management
* JSON persistence
* User onboarding

### Commands

```bash
5hr init
5hr today
5hr doctor
```

### Deliverables

User can:

* Configure preferences
* Generate recommendations
* Validate installation

---

# Phase 2 — Provider Support (Days 4–5)

### Objectives

Launch AI coding tools.

### Tasks

Provider abstraction:

```ts
interface ProviderAdapter {
  launch(): Promise<void>
  detectRunning(): Promise<boolean>
}
```

Implement:

* Claude provider
* Codex provider

### Deliverables

```bash
5hr start claude

5hr start codex
```

---

# Phase 3 — Session Tracking (Days 6–7)

### Objectives

Track usage behavior.

### Tasks

* Session logging
* Start timestamps
* End timestamps
* Rolling statistics

### Deliverables

Session history available locally.

---

# Phase 4 — Planning Engine (Week 2)

### Objectives

Build recommendation engine.

### Inputs

* Working hours
* Focus periods
* Session history

### Outputs

* Recommended start times
* Window recommendations
* Utilization estimates

### Commands

```bash
5hr today

5hr explain
```

### Deliverables

Meaningful scheduling recommendations.

---

# Phase 5 — Native Scheduling (Week 2)

### Objectives

Automate launches.

### Linux

* cron support

### macOS

* cron support

### Windows

* schtasks support

### Commands

```bash
5hr schedule
```

### Deliverables

Cross-platform automation.

---

# Phase 6 — Analytics (Week 3)

### Objectives

Show value to users.

### Commands

```bash
5hr stats
```

### Metrics

* Utilization score
* Session count
* Average duration
* Estimated wasted time

### Deliverables

Useful productivity insights.

---

# Phase 7 — Packaging (Week 3)

### Objectives

Distribute easily.

### Deliverables

npm package:

```bash
npm install -g @5hr/cli
```

Standalone binaries:

```text
5hr-linux
5hr-macos
5hr-win.exe
```

---

# Phase 8 — Public Alpha (Week 4)

### Objectives

Gather real-world feedback.

### Deliverables

* GitHub repository
* Documentation
* Installation guide
* Screenshots
* Issue templates
* Roadmap

### Initial Marketing

* Hacker News
* Reddit
* X/Twitter
* Claude Code communities

---

# MVP Scope

Required:

* 5hr init
* 5hr today
* 5hr explain
* 5hr start
* 5hr schedule
* 5hr stats

Excluded:

* Cloud sync
* GUI
* AI recommendations
* Provider APIs
* Team features

---

# Repository Structure

```text
5hr/
├── apps/
│   └── cli/
│
├── packages/
│   ├── core/
│   ├── scheduler/
│   ├── planner/
│   └── providers/
│
├── docs/
│
└── .github/
```

---

# Release Targets

## v0.1.0-alpha

Features:

* Claude support
* Codex support
* Planning engine
* Native scheduling
* Local analytics

Goal:

Daily-driver capable.

---

# Future Versions

## v0.2

* Idle detection
* Better heuristics
* More analytics

## v0.3

* Plugin ecosystem
* Additional providers

## v0.5

* Team workflows
* Shared schedules

## v1.0

* Mature provider ecosystem
* Best-in-class quota optimization

---

# Success Definition

A developer installs 5hr, runs:

```bash
5hr init
```

and within five minutes can see:

* when they should start AI sessions
* how much quota they waste
* how to improve utilization

without creating accounts, installing services, or leaving the terminal.
