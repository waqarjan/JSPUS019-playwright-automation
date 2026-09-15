// @ts-check
import { defineConfig, devices } from '@playwright/test';

//import everything from dotenv library and call config() method to read the .env file and load the environment variables into process.env
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* retry failed tests twice in CI, and once when running locally.*/
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: 3,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    //baseURL: "process.env.BASE_URL || 'http://localhost:3000'",
    baseURL: 'https://spartan-app-new-nonsecure.onrender.com/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: {
      mode: 'on-first-retry',
      size: { width: 1920, height: 1080 },
    },

    launchOptions: {
      slowMo: 0, //slow down by given millisecoonds, useful for debugging
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium', //change to 'Google Chrome' & channel: 'chrome', or Microsoft Edge & channel: 'msedge' in the use object below
      use: {
        channel: 'chrome',
        //...devices['Desktop Chrome'],
        //viewport:null - to run the tests in maximized window set the viewport to null & add the launchOptions with args --start-maximized
        viewport: null, //null means that the viewport will be the same as the browser window size
        launchOptions: {
          args: ['--start-maximized'], //to start the browser maximized
        },
      },
    },
    // {
    //   name:'Microsoft Edge',
    //   use:{
    //     ...devices['Desktop Edge'],
    //     channel:'msedge',
    //     viewport:{width:1900, height:1080}
    //   },
    // },

    // i am commenting out the following browsers because i want to run the tests only on chrome, but you can uncomment them if you want to
    // run the tests on other browsers

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    //-------------------------------

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

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
