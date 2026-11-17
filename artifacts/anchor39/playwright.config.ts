import { defineConfig } from '@playwright/test'
import { execFileSync } from 'node:child_process'

// Use the Nix-managed browser on Replit; other environments use Playwright's.
const executablePath = process.env.REPL_ID
  ? execFileSync('which', ['chromium'], { encoding: 'utf8' }).trim()
  : undefined

export default defineConfig({
  testDir: './tests',
  globalSetup: './tests/wait-for-app.ts',
  outputDir: '../../generated-artifacts/anchor39-tests',
  reporter: 'list',
  use: {
    // Replit's shared proxy forwards "/" to the artifact's managed port.
    // All checks intentionally use this verified endpoint, not a service port.
    baseURL: 'http://localhost:80',
    browserName: 'chromium',
    headless: true,
    launchOptions: { executablePath },
    screenshot: 'only-on-failure',
  },
})
