import { test } from '@playwright/test';

test('Google test', async ({ page }) => {
  // navigate to the URL https://www.saucedemo.com/
  await page.goto('https://www.saucedemo.com/');

  // pause for 3 seconds
  await page.waitForTimeout(3000);
});

test('Youtube test', async ({ page }) => {
  // navigate to the URL https://www.youtube.com/
  await page.goto('https://www.youtube.com/');

  // pause for 3 seconds
  await page.waitForTimeout(3000);
});
