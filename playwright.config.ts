import fs from 'fs';
import dotenv from 'dotenv';
import { defineConfig, devices } from '@playwright/test';

// Load .env first (base configuration)
dotenv.config();

// Get mode from NODE_ENV or command line arguments
// Check if we're running in production mode
const isProd = process.env.NODE_ENV === 'production'
const mode = isProd ? 'production' : 'local';
console.log('Mode:', mode);

// Load the appropriate env file based on mode
const envFile = mode === 'production' ? '.env.production' : '.env.local';
console.log({envFile})
console.log('Loading environment file:', envFile);

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
  console.log('Environment file loaded successfully');
} else {
  console.warn(`Environment file ${envFile} not found, using base .env`);
}

// Load test environment variables if available
if (fs.existsSync('.env.test')) {
  dotenv.config({ path: '.env.test' });
  console.log('Test environment file loaded');
}

console.log('Production mode:', isProd);

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',              // folder for tests
  timeout: 2 * 60 * 1000,              // 2 minutes per test
  /* Global setup and teardown for database connection management */
  globalSetup: './tests/global-setup.ts',
  globalTeardown: './tests/global-teardown.ts',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Run your local dev server before starting the tests */
  webServer: {
    command: isProd ? 'npm run build && npm run preview' : 'npm run dev',
    port: 4321,
    reuseExistingServer: !process.env.CI,
    timeout: 5 * 60 * 1000, // 5 minutes for build + preview
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: 'http://localhost:4321',
    headless: true,                // run without UI
    viewport: { width: 1280, height: 720 },
    video: 'retain-on-failure',    // record video if test fails
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

});
