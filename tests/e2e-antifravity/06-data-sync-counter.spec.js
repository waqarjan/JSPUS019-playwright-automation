import { test, expect } from '@playwright/test';
import { SpartanApiClient } from '../api-antigravity/services/spartan-api-client.js';
import { SpartanDataFactory } from '../api-antigravity/helpers/spartan-data-factory.js';
import { SpartansListPage } from '../ui-antigravity/pages/spartans-list-page.js';

test.describe('Hybrid E2E - Cross-Layer State & Counter Synchronization', { tag: ['@e2e', '@hybrid', '@regression'] }, () => {
  let spartanClient;
  let listPage;

  test.beforeEach(async ({ page, request }) => {
    spartanClient = new SpartanApiClient(request);
    listPage = new SpartansListPage(page);
  });

  test('Cross-layer verification: API totalElement synchronizes with UI Total Badge', async ({ page }) => {
    // 1. Initial State Sync Check
    const initialApiRes = await spartanClient.getAllSpartans();
    expect(initialApiRes.status()).toBe(200);
    const initialApiCount = (await initialApiRes.json()).totalElement;

    await listPage.open();
    const initialUiCount = await listPage.getTotalCount();
    expect(initialUiCount).toBe(initialApiCount);

    // 2. Create via API -> Verify UI Counter Increment
    const payload = SpartanDataFactory.createValidSpartan({
      name: `SyncTest_${Date.now()}`,
    });
    const createRes = await spartanClient.createSpartan(payload);
    expect(createRes.status()).toBe(201);
    const spartanId = (await createRes.json()).data.id;

    await listPage.open();
    const updatedUiCount = await listPage.getTotalCount();
    expect(updatedUiCount).toBe(initialUiCount + 1);

    // 3. Delete via API -> Verify UI Counter Decrement
    const deleteRes = await spartanClient.deleteSpartan(spartanId);
    expect(deleteRes.status()).toBe(200);

    await listPage.open();
    const finalUiCount = await listPage.getTotalCount();
    expect(finalUiCount).toBe(initialUiCount);
  });
});
