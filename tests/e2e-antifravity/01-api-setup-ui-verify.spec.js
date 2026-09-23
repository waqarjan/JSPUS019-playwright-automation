import { test, expect } from '@playwright/test';
import { SpartanApiClient } from '../api-antigravity/services/spartan-api-client.js';
import { SpartanDataFactory } from '../api-antigravity/helpers/spartan-data-factory.js';
import { SpartansListPage } from '../ui-antigravity/pages/spartans-list-page.js';
import { ViewSpartanPage } from '../ui-antigravity/pages/view-spartan-page.js';

test.describe('Hybrid E2E - API Setup & UI Verification', { tag: ['@e2e', '@hybrid', '@smoke'] }, () => {
  let spartanClient;
  let listPage;
  let viewPage;
  let createdSpartan;

  test.beforeEach(async ({ page, request }) => {
    spartanClient = new SpartanApiClient(request);
    listPage = new SpartansListPage(page);
    viewPage = new ViewSpartanPage(page);
  });

  test.afterEach(async () => {
    if (createdSpartan?.id) {
      await spartanClient.deleteSpartan(createdSpartan.id);
    }
  });

  test('Create Spartan via API -> Verify presence in UI table and Detail View', async ({ page }) => {
    // 1. Setup: Create Spartan fast via API
    const payload = SpartanDataFactory.createFemaleSpartan({
      name: `E2E_API_Setup_${Date.now()}`,
    });
    const apiResponse = await spartanClient.createSpartan(payload);
    expect(apiResponse.status()).toBe(201);

    const apiBody = await apiResponse.json();
    createdSpartan = apiBody.data;
    const spartanId = createdSpartan.id;

    // 2. UI Verification: Open Spartan list page and search by name
    await listPage.open();
    await listPage.search(createdSpartan.name);

    // Assert row exists in UI table
    const tableRow = listPage.getRowById(spartanId);
    await expect(tableRow).toBeVisible();

    const rowData = await listPage.getRowData(spartanId);
    expect(rowData.name).toBe(createdSpartan.name);
    expect(rowData.gender).toBe(createdSpartan.gender);
    expect(rowData.phone).toBe(createdSpartan.phone);

    // 3. UI Verification: Click View and assert details match API record
    await listPage.clickView(spartanId);
    await expect(page).toHaveURL(new RegExp(`/web/v2/spartans/${spartanId}$`));

    const details = await viewPage.getDetails();
    expect(details.name).toBe(createdSpartan.name);
    expect(details.gender.toLowerCase()).toBe(createdSpartan.gender.toLowerCase());
    expect(details.phone).toBe(createdSpartan.phone);
  });
});
