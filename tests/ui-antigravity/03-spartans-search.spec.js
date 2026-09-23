import { test, expect } from '@playwright/test';
import { SpartansListPage } from './pages/spartans-list-page.js';
import { AddSpartanPage } from './pages/add-spartan-page.js';
import { SpartanDataFactory } from '../api-antigravity/helpers/spartan-data-factory.js';

test.describe('Spartan UI - Search & Filter', { tag: ['@ui', '@search', '@regression'] }, () => {
  let listPage;
  let testSpartan;

  test.beforeEach(async ({ page }) => {
    listPage = new SpartansListPage(page);
  });

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    const addPage = new AddSpartanPage(page);
    testSpartan = SpartanDataFactory.createFemaleSpartan({
      name: `UISearch_${Date.now()}`,
    });

    await addPage.open();
    await addPage.createSpartan(testSpartan.name, testSpartan.gender, testSpartan.phone);
    await page.close();
  });

  test('Should filter Spartans by name contains', async () => {
    await listPage.open();
    await listPage.search(testSpartan.name);

    const matchingRow = listPage.getRowByName(testSpartan.name);
    await expect(matchingRow).toBeVisible();

    const resultCount = await listPage.getFilteredResultCount();
    expect(resultCount).toBeGreaterThanOrEqual(1);
  });

  test('Should filter Spartans by gender Female', async () => {
    await listPage.open();
    await listPage.search('', 'Female');

    const resultCount = await listPage.getFilteredResultCount();
    expect(resultCount).toBeGreaterThan(0);

    const rowCount = await listPage.visibleTableRows.count();
    const sampleSize = Math.min(rowCount, 5);

    for (let i = 0; i < sampleSize; i++) {
      const genderCell = listPage.visibleTableRows.nth(i).locator('td').nth(3);
      await expect(genderCell).toHaveText(/Female/i);
    }
  });

  test('Should filter Spartans by gender Male', async () => {
    await listPage.open();
    await listPage.search('', 'Male');

    const resultCount = await listPage.getFilteredResultCount();
    expect(resultCount).toBeGreaterThan(0);

    const rowCount = await listPage.visibleTableRows.count();
    const sampleSize = Math.min(rowCount, 5);

    for (let i = 0; i < sampleSize; i++) {
      const genderCell = listPage.visibleTableRows.nth(i).locator('td').nth(3);
      await expect(genderCell).toHaveText(/Male/i);
    }
  });

  test('Should reset filters when clicking Clear', async () => {
    await listPage.open();
    await listPage.search(testSpartan.name);
    await listPage.clearFilters();

    await expect(listPage.nameFilterInput).toHaveValue('');
    const totalCount = await listPage.getTotalCount();
    expect(totalCount).toBeGreaterThan(1);
  });

  test('Should display 0 results for non-existent search keyword', async () => {
    await listPage.open();
    await listPage.search('NonExistentKeyword_99999999');

    const resultCount = await listPage.getFilteredResultCount();
    expect(resultCount).toBe(0);
    expect(await listPage.visibleTableRows.count()).toBe(0);
  });
});
