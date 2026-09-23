import { test, expect } from '@playwright/test';
import { SpartansListPage } from './pages/spartans-list-page.js';
import { AddSpartanPage } from './pages/add-spartan-page.js';
import { ViewSpartanPage } from './pages/view-spartan-page.js';
import { SpartanDataFactory } from '../api-antigravity/helpers/spartan-data-factory.js';

test.describe('Spartan UI - View Spartan Details', { tag: ['@ui', '@view', '@regression'] }, () => {
  let listPage;
  let viewPage;
  let testSpartan;

  test.beforeEach(async ({ page }) => {
    listPage = new SpartansListPage(page);
    viewPage = new ViewSpartanPage(page);
  });

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    const addPage = new AddSpartanPage(page);
    testSpartan = SpartanDataFactory.createMaleSpartan({
      name: `UIView_${Date.now()}`,
    });

    await addPage.open();
    await addPage.createSpartan(testSpartan.name, testSpartan.gender, testSpartan.phone);
    await page.close();
  });

  test('Should navigate to details page and verify read-only Spartan attributes', async ({ page }) => {
    await listPage.open();
    await listPage.search(testSpartan.name);

    const row = listPage.getRowByName(testSpartan.name);
    await expect(row).toBeVisible();

    const id = await row.locator('td').nth(0).innerText();

    // Click View
    await listPage.clickView(id);

    // Verify URL
    await expect(page).toHaveURL(new RegExp(`/web/v2/spartans/${id}$`));

    // Verify Read-Only Details
    const details = await viewPage.getDetails();
    expect(details.name).toBe(testSpartan.name);
    expect(details.gender.toLowerCase()).toBe(testSpartan.gender.toLowerCase());
    expect(details.phone).toBe(testSpartan.phone);

    // Click Back to List
    await viewPage.backToList();
    await expect(page).toHaveURL(/\/web\/v2\/spartans$/);
  });
});
