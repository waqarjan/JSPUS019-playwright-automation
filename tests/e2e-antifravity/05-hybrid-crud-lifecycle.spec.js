import { test, expect } from '@playwright/test';
import { SpartanApiClient } from '../api-antigravity/services/spartan-api-client.js';
import { SpartanDataFactory } from '../api-antigravity/helpers/spartan-data-factory.js';
import { SpartansListPage } from '../ui-antigravity/pages/spartans-list-page.js';
import { ViewSpartanPage } from '../ui-antigravity/pages/view-spartan-page.js';
import { EditSpartanPage } from '../ui-antigravity/pages/edit-spartan-page.js';

test.describe('Hybrid E2E - Full CRUD Roundtrip Lifecycle', { tag: ['@e2e', '@hybrid', '@crud', '@smoke'] }, () => {
  test('Complete Hybrid User Lifecycle across API and UI layers', async ({ page, request }) => {
    const spartanClient = new SpartanApiClient(request);
    const listPage = new SpartansListPage(page);
    const viewPage = new ViewSpartanPage(page);
    const editPage = new EditSpartanPage(page);

    const initialData = SpartanDataFactory.createFemaleSpartan({
      name: `Hybrid_E2E_${Date.now()}`,
    });

    // ==========================================
    // STEP 1: CREATE via API
    // ==========================================
    const createRes = await spartanClient.createSpartan(initialData);
    expect(createRes.status()).toBe(201);
    const createdData = (await createRes.json()).data;
    const spartanId = createdData.id;
    expect(spartanId).toBeGreaterThan(0);

    // ==========================================
    // STEP 2: READ & VERIFY via UI
    // ==========================================
    await listPage.open();
    await listPage.search(initialData.name);

    const row = listPage.getRowById(spartanId);
    await expect(row).toBeVisible();

    await listPage.clickView(spartanId);
    await expect(page).toHaveURL(new RegExp(`/web/v2/spartans/${spartanId}$`));

    const details = await viewPage.getDetails();
    expect(details.name).toBe(initialData.name);
    expect(details.phone).toBe(initialData.phone);
    expect(details.gender.toLowerCase()).toBe('female');

    await viewPage.backToList();
    await expect(page).toHaveURL(/\/web\/v2\/spartans$/);

    // ==========================================
    // STEP 3: UPDATE via UI
    // ==========================================
    await listPage.search(initialData.name);
    await listPage.clickEdit(spartanId);
    await expect(page).toHaveURL(new RegExp(`/web/v2/spartans/edit/${spartanId}$`));

    const updatedName = `${initialData.name}_Renamed`;
    const updatedPhone = '99988877766';
    await editPage.updateForm(updatedName, 'Female', updatedPhone);
    await editPage.submit();
    await expect(page).toHaveURL(/\/web\/v2\/spartans$/);

    // ==========================================
    // STEP 4: VERIFY UPDATE via API (Backend Database Check)
    // ==========================================
    const apiVerifyRes = await spartanClient.getSpartanById(spartanId);
    expect(apiVerifyRes.status()).toBe(200);

    const backendRecord = (await apiVerifyRes.json()).data;
    expect(backendRecord.name).toBe(updatedName);
    expect(backendRecord.phone).toBe(updatedPhone);

    // ==========================================
    // STEP 5: DELETE via UI
    // ==========================================
    await listPage.search(updatedName);
    await listPage.clickDelete(spartanId);

    // ==========================================
    // STEP 6: VERIFY 404 via API
    // ==========================================
    const finalApiCheck = await spartanClient.getSpartanById(spartanId);
    expect(finalApiCheck.status()).toBe(404);
  });
});
