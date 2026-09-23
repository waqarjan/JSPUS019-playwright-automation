import { test, expect } from '@playwright/test';
import { SpartanApiClient } from '../api-antigravity/services/spartan-api-client.js';
import { SpartanDataFactory } from '../api-antigravity/helpers/spartan-data-factory.js';
import { SpartansListPage } from '../ui-antigravity/pages/spartans-list-page.js';

test.describe('Hybrid E2E - API Create, UI Delete & API Verification', { tag: ['@e2e', '@hybrid', '@regression'] }, () => {
  let spartanClient;
  let listPage;

  test.beforeEach(async ({ page, request }) => {
    spartanClient = new SpartanApiClient(request);
    listPage = new SpartansListPage(page);
  });

  test('Create via API -> Delete via UI Table -> Assert 404 Not Found via API', async () => {
    // 1. API Setup: Fast Creation
    const payload = SpartanDataFactory.createMaleSpartan({
      name: `E2E_PreDelete_${Date.now()}`,
    });
    const createRes = await spartanClient.createSpartan(payload);
    expect(createRes.status()).toBe(201);
    const spartanId = (await createRes.json()).data.id;

    // 2. UI Action: Search and Delete in UI table
    await listPage.open();
    await listPage.search(payload.name);

    const row = listPage.getRowById(spartanId);
    await expect(row).toBeVisible();

    await listPage.clickDelete(spartanId);

    // 3. UI Check: Row is gone
    await listPage.open();
    await listPage.search(payload.name);
    await expect(listPage.getRowById(spartanId)).not.toBeVisible();

    // 4. API Verification: Backend confirms entity deletion with 404
    const apiGetRes = await spartanClient.getSpartanById(spartanId);
    expect(apiGetRes.status()).toBe(404);

    const apiBody = await apiGetRes.json();
    expect(apiBody.httpStatus).toBe('NOT_FOUND');
  });
});
