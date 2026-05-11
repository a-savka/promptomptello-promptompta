import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './src/test/e2e',
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
  use: {
    baseURL: 'http://localhost:9000',
    headless: true,
  },
  webServer: {
    command: 'PORT=9000 npx quasar dev -p 9000',
    port: 9000,
    timeout: 30000,
    reuseExistingServer: !process.env.CI,
  },
})
