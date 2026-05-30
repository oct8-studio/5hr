export interface ProviderAdapter {
  name: string
  windowHours: 5
  launch(): Promise<void>
  detectRunning(): Promise<boolean>
  getBinaryName(): string
}
