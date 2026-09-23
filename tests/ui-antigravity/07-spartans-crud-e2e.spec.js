import { test, expect } from '@playwright/test';
import { SpartansListPage } from './pages/spartans-list-page.js';
import { AddSpartanPage } from './pages/add-spartan-page.js';
import { ViewSpartanPage } from './pages/view-spartan-page.js';
import { EditSpartanPage } from './pages/edit-spartan-page.js';
import { SpartanDataFactory } from '../api-antigravity/helpers/spartan-data-factory.js';

test.describe('Spartan UI - End-to-End User Journey (Full CRUD)', { tag: ['@ui', '@e2e', '@crud', '@smoke'] }, () => {
  test('Complete End-to-End lifecycle flow through Web UI', async ({ page }) => {
    const listPage = new SpartansListPage(page);
    const addPage = new AddSpartanPage(page);
    const viewPage = new ViewSpartanPage(page);
    const editPage = new EditSpartanPage(page);

    const initialData = SpartanDataFactory.createFemaleSpartan({
      name: `UI_E2E_${Date.now()}`,
    });

    // --- STEP 1: CREATE SPARTAN ---
    await listPage.open();
    await listPage.clickAddSpartan();
    await expect(page).toHaveURL(/\/web\/v2\/spartans\/add/);

    await addPage.createSpartan(initialData.name, initialData.gender, initialData.phone);
    await expect(page).toHaveURL(/\/web\/v2\/spartans$/);

    // --- STEP 2: SEARCH & LOCATE ---
    await listPage.search(initialData.name);
    const createdRow = listPage.getRowByName(initialData.name);
    await expect(createdRow).toBeVisible();
    const id = await createdRow.locator('td').nth(0).innerText();

    // --- STEP 3: VIEW DETAILS ---
    await listPage.clickView(id);
    await expect(page).toHaveURL(new RegExp(`/web/v2/spartans/${id}$`));

    const details = await viewPage.getDetails();
    expect(details.name).toBe(initialData.name);
    expect(details.phone).toBe(initialData.phone);

    await viewPage.backToList();
    await expect(page).toHaveURL(/\/web\/v2\/spartans$/);

    // --- STEP 4: EDIT SPARTAN ---
    await listPage.search(initialData.name);
    await listPage.clickEdit(id);
    await expect(page).toHaveURL(new RegExp(`/web/v2/spartans/edit/${id}`));

    const updatedName = `${initialData.name}_Renamed`;
    const updatedPhone = '99988877766';
    await editPage.updateForm(updatedName, 'Female', updatedPhone);
    await editPage.submit();
    await expect(page).toHaveURL(/\/web\/v2\/spartans$/);

    // --- STEP 5: VERIFY UPDATE ---
    await listPage.search(updatedName);
    const updatedRow = listPage.getRowByName(updatedName);
    await expect(updatedRow).toBeVisible();

    // --- STEP 6: DELETE SPARTAN ---
    await listPage.clickDelete(id);

    // --- STEP 7: VERIFY DELETION ---
    await listPage.open();
    await listPage.search(updatedName);
    const deletedRow = listPage.getRowByName(updatedName);
    await expect(deletedRow).not.toBeVisible();
  });
});
