export interface ProviderAdapter {
  name: string
  windowHours: 5
  launch(): Promise<void>
  warmup(): Promise<void>   // headless: sends a real message to start the rolling clock
  detectRunning(): Promise<boolean>
  getBinaryName(): string
}
