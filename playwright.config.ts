import { defineConfig } from '@playwright/test'

const authFile = 'e2e/.auth.json'

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:5173',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: process.env.RECORD_ALL_VIDEOS === 'true' ? 'on' : 'retain-on-failure',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        storageState: authFile,
        launchOptions: {
          args: ['--no-proxy-server'],
        },
      },
      dependencies: ['setup'],
    },
  ],
  webServer: [
    {
      command: `java -jar e2e/.backend/provisioncalculator.jar --spring.profiles.active=test --spring.config.additional-location=file:e2e/.backend/`,
      port: 8080,
      timeout: 60_000,
      reuseExistingServer: !process.env.CI,
      env: {
        JAVA_TOOL_OPTIONS: '',
      },
    },
    {
      command: 'npm run dev',
      port: 5173,
      timeout: 15_000,
      reuseExistingServer: !process.env.CI,
      env: {
        VITE_API_BASE_URL: 'http://localhost:5173',
      },
    },
  ],
})
