import { test, expect } from '@playwright/test';
import { SpartansListPage } from './pages/spartans-list-page.js';
import { AddSpartanPage } from './pages/add-spartan-page.js';
import { SpartanDataFactory } from '../api-antigravity/helpers/spartan-data-factory.js';

test.describe('Spartan UI - Delete Spartan', { tag: ['@ui', '@delete', '@regression'] }, () => {
  let listPage;
  let addPage;

  test.beforeEach(async ({ page }) => {
    listPage = new SpartansListPage(page);
    addPage = new AddSpartanPage(page);
  });

  test('Should delete an existing Spartan and decrement total counter', async () => {
    // 1. Create a Spartan to delete
    await addPage.open();
    const spartan = SpartanDataFactory.createMaleSpartan({
      name: `UIDelete_${Date.now()}`,
    });
    await addPage.createSpartan(spartan.name, spartan.gender, spartan.phone);

    // 2. Locate Spartan in list
    await listPage.open();
    const initialCount = await listPage.getTotalCount();

    await listPage.search(spartan.name);
    const row = listPage.getRowByName(spartan.name);
    await expect(row).toBeVisible();
    const id = await row.locator('td').nth(0).innerText();

    // 3. Click Delete
    await listPage.clickDelete(id);

    // 4. Verify Spartan is no longer in search
    await listPage.open();
    await listPage.search(spartan.name);
    const deletedRow = listPage.getRowByName(spartan.name);
    await expect(deletedRow).not.toBeVisible();

    // 5. Verify total count decremented
    await listPage.clearFilters();
    const finalCount = await listPage.getTotalCount();
    expect(finalCount).toBe(initialCount - 1);
  });
});
