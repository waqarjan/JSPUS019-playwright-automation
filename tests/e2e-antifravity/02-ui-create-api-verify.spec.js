import { test, expect } from '@playwright/test';
import { SpartanApiClient } from '../api-antigravity/services/spartan-api-client.js';
import { SpartanDataFactory } from '../api-antigravity/helpers/spartan-data-factory.js';
import { SpartansListPage } from '../ui-antigravity/pages/spartans-list-page.js';
import { AddSpartanPage } from '../ui-antigravity/pages/add-spartan-page.js';

test.describe('Hybrid E2E - UI Action & API Verification', { tag: ['@e2e', '@hybrid', '@smoke'] }, () => {
  let spartanClient;
  let listPage;
  let addPage;
  let createdSpartanId;

  test.beforeEach(async ({ page, request }) => {
    spartanClient = new SpartanApiClient(request);
    listPage = new SpartansListPage(page);
    addPage = new AddSpartanPage(page);
  });

  test.afterEach(async () => {
    if (createdSpartanId) {
      await spartanClient.deleteSpartan(createdSpartanId);
    }
  });

  test('Create Spartan in UI -> Verify Backend Database State via REST API', async ({ page }) => {
    const payload = SpartanDataFactory.createMaleSpartan({
      name: `E2E_UI_Create_${Date.now()}`,
    });

    // 1. UI Action: Create Spartan via Add Page Form
    await addPage.open();
    await addPage.createSpartan(payload.name, payload.gender, payload.phone);

    await expect(page).toHaveURL(/\/web\/v2\/spartans$/);

    // 2. UI Action: Search and extract Spartan ID from table
    await listPage.search(payload.name);
    const row = listPage.getRowByName(payload.name);
    await expect(row).toBeVisible();

    const idText = await row.locator('td').nth(0).innerText();
    createdSpartanId = parseInt(idText, 10);
    expect(createdSpartanId).toBeGreaterThan(0);

    // 3. API Verification: Query database directly via REST API endpoint
    const apiResponse = await spartanClient.getSpartanById(createdSpartanId);
    expect(apiResponse.status()).toBe(200);

    const apiBody = await apiResponse.json();
    expect(apiBody.message).toBe('Successfully retrieved the Spartan.');
    expect(apiBody.data.id).toBe(createdSpartanId);
    expect(apiBody.data.name).toBe(payload.name);
    expect(apiBody.data.gender).toBe(payload.gender);
    expect(apiBody.data.phone).toBe(payload.phone);
  });
});
