const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect: { timeout: 10000 },
  retries: 0,
  use: {
    headless: true,
    viewport: { width: 1440, height: 900 },
  },
  reporter: [['list']],
});