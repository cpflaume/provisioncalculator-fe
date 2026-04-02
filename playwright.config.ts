import { defineConfig } from '@playwright/test'

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
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        launchOptions: {
          args: ['--no-proxy-server'],
        },
      },
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
