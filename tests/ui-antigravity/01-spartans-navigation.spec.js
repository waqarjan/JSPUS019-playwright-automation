import { test, expect } from '@playwright/test';
import { SpartansListPage } from './pages/spartans-list-page.js';

test.describe('Spartan UI - Navigation & Layout', { tag: ['@ui', '@navigation', '@smoke'] }, () => {
  let listPage;

  test.beforeEach(async ({ page }) => {
    listPage = new SpartansListPage(page);
    await listPage.open();
  });

  test('Should load Spartans list page with correct title and branding', async ({ page }) => {
    const title = await listPage.getTitle();
    expect(title).toBe('All Spartan');

    expect(page.url()).toContain('/web/v2/spartans');

    await expect(listPage.totalBadge).toBeVisible();
    const count = await listPage.getTotalCount();
    expect(count).toBeGreaterThan(0);
  });

  test('Should navigate to Add Spartan page when clicking Add button', async ({ page }) => {
    await listPage.clickAddSpartan();
    await expect(page).toHaveURL(/\/web\/v2\/spartans\/add/);
    await expect(page.locator('button:has-text("Save"), button.btn-success')).toBeVisible();
  });

  test('Should have visible search filter controls', async () => {
    await expect(listPage.nameFilterInput).toBeVisible();
    await expect(listPage.genderFilterSelect).toBeVisible();
    await expect(listPage.searchBtn).toBeVisible();
    await expect(listPage.clearBtn).toBeVisible();
  });

  test('Should navigate to home page when clicking Back to Home', async ({ page }) => {
    await listPage.backToHomeBtn.click();
    await expect(page).toHaveURL(/\/web\/v2\/home/);
    await expect(page).toHaveTitle('Spartan App');
  });
});
