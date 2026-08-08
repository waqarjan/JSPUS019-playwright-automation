import { test, expect } from '@playwright/test';

test('Verify that all links under the ul tag are displayed and enabled', async ({ page }) => {
  // Step 1: Open Chrome browser
  // Step 2: Navigate to "https://the-internet-5chk.onrender.com/"
  await page.goto('https://the-internet-5chk.onrender.com/');
  // Step 3: Verify the url should contain "onrender.com"
  await expect(page).toHaveURL(/onrender\.com/);
  // Step 4: The title should be "Practice"
  await expect(page).toHaveTitle('Practice');

  // Step 5: All the links under the ul HTML tag are visible and clickable.
  const links = page.locator("//ul[@class='list-group']//a");
  const count = await links.count();

  for (let i = 0; i < count; i++) {
    const link = links.nth(i);
    await expect(link).toBeVisible();
    await expect(link).toBeEnabled();
  }
});