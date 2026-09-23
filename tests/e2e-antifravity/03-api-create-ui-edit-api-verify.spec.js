import { test, expect } from '@playwright/test';
import { SpartanApiClient } from '../api-antigravity/services/spartan-api-client.js';
import { SpartanDataFactory } from '../api-antigravity/helpers/spartan-data-factory.js';
import { EditSpartanPage } from '../ui-antigravity/pages/edit-spartan-page.js';

test.describe('Hybrid E2E - API Create, UI Edit & API Verification', { tag: ['@e2e', '@hybrid', '@regression'] }, () => {
  let spartanClient;
  let editPage;
  let createdSpartan;

  test.beforeEach(async ({ page, request }) => {
    spartanClient = new SpartanApiClient(request);
    editPage = new EditSpartanPage(page);
  });

  test.afterEach(async () => {
    if (createdSpartan?.id) {
      await spartanClient.deleteSpartan(createdSpartan.id);
    }
  });

  test('Create via API -> Update via UI Form -> Assert Backend State via API', async ({ page }) => {
    // 1. API Setup: Fast Creation
    const initialPayload = SpartanDataFactory.createFemaleSpartan({
      name: `E2E_PreEdit_${Date.now()}`,
    });
    const createRes = await spartanClient.createSpartan(initialPayload);
    expect(createRes.status()).toBe(201);
    createdSpartan = (await createRes.json()).data;
    const spartanId = createdSpartan.id;

    // 2. UI Action: Navigate directly to Edit page and update fields
    await page.goto(`/web/v2/spartans/edit/${spartanId}`);

    const updatedName = `${initialPayload.name}_UI_Updated`;
    const updatedPhone = '98765432101';

    await editPage.updateForm(updatedName, 'Female', updatedPhone);
    await editPage.submit();

    await expect(page).toHaveURL(/\/web\/v2\/spartans$/);

    // 3. API Verification: Assert Database record reflects UI updates
    const getRes = await spartanClient.getSpartanById(spartanId);
    expect(getRes.status()).toBe(200);

    const backendData = (await getRes.json()).data;
    expect(backendData.id).toBe(spartanId);
    expect(backendData.name).toBe(updatedName);
    expect(backendData.phone).toBe(updatedPhone);
    expect(backendData.gender).toBe('Female');
  });
});
