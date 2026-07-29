import { test } from '@playwright/test';

test('Simple google test', async ({ page }) => {
  await page.goto('https://www.google.com/');

  let searchbox = page.locator("//textarea[@id='APjFqb']");

  await page.waitForTimeout(1000);

  //await searchbox.type('Playwright');

  await searchbox.fill('CYDEO');

  await page.waitForTimeout(2000);

  searchbox.press('Enter');

  await page.waitForTimeout(3000);
});

