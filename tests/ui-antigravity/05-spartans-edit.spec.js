import { test, expect } from '@playwright/test';
import { SpartansListPage } from './pages/spartans-list-page.js';
import { AddSpartanPage } from './pages/add-spartan-page.js';
import { EditSpartanPage } from './pages/edit-spartan-page.js';
import { SpartanDataFactory } from '../api-antigravity/helpers/spartan-data-factory.js';

test.describe('Spartan UI - Edit Spartan', { tag: ['@ui', '@edit', '@regression'] }, () => {
  let listPage;
  let editPage;
  let testSpartan;

  test.beforeEach(async ({ page }) => {
    listPage = new SpartansListPage(page);
    editPage = new EditSpartanPage(page);
  });

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    const addPage = new AddSpartanPage(page);
    testSpartan = SpartanDataFactory.createFemaleSpartan({
      name: `UIEdit_${Date.now()}`,
    });

    await addPage.open();
    await addPage.createSpartan(testSpartan.name, testSpartan.gender, testSpartan.phone);
    await page.close();
  });

  test('Should edit existing Spartan name and phone number successfully', async ({ page }) => {
    await listPage.open();
    await listPage.search(testSpartan.name);

    const row = listPage.getRowByName(testSpartan.name);
    await expect(row).toBeVisible();
    const id = await row.locator('td').nth(0).innerText();

    // Click Edit button
    await listPage.clickEdit(id);
    await expect(page).toHaveURL(new RegExp(`/web/v2/spartans/edit/${id}`));

    // Verify pre-populated values
    const currentData = await editPage.getFormData();
    expect(currentData.name).toBe(testSpartan.name);

    // Update with new values
    const updatedName = `${testSpartan.name}_Updated`;
    const updatedPhone = '98765432100';

    await editPage.updateForm(updatedName, 'Female', updatedPhone);
    await editPage.submit();

    // Verify redirected back to list page
    await expect(page).toHaveURL(/\/web\/v2\/spartans$/);

    // Search for updated Spartan and verify
    await listPage.search(updatedName);
    const updatedRow = listPage.getRowByName(updatedName);
    await expect(updatedRow).toBeVisible();

    const rowData = await listPage.getRowData(id);
    expect(rowData.name).toBe(updatedName);
    expect(rowData.phone).toBe(updatedPhone);
  });
});
