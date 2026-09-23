import { test, expect } from '@playwright/test';
import { SpartansListPage } from './pages/spartans-list-page.js';
import { AddSpartanPage } from './pages/add-spartan-page.js';
import { SpartanDataFactory } from '../api-antigravity/helpers/spartan-data-factory.js';

test.describe('Spartan UI - Add Spartan & Form Validations', { tag: ['@ui', '@add', '@regression'] }, () => {
  let listPage;
  let addPage;

  test.beforeEach(async ({ page }) => {
    listPage = new SpartansListPage(page);
    addPage = new AddSpartanPage(page);
  });

  test('Should successfully create a new Spartan via UI form', async ({ page }) => {
    await listPage.open();
    const initialCount = await listPage.getTotalCount();

    // Navigate to Add Spartan
    await listPage.clickAddSpartan();
    await expect(page).toHaveURL(/\/web\/v2\/spartans\/add/);

    // Generate test data
    const spartan = SpartanDataFactory.createFemaleSpartan();

    // Fill form and submit
    await addPage.createSpartan(spartan.name, spartan.gender, spartan.phone);

    // Verify redirected back to list page
    await expect(page).toHaveURL(/\/web\/v2\/spartans$/);

    // Verify total count incremented
    const updatedCount = await listPage.getTotalCount();
    expect(updatedCount).toBe(initialCount + 1);

    // Verify Spartan row is found via search
    await listPage.search(spartan.name);
    const row = listPage.getRowByName(spartan.name);
    await expect(row).toBeVisible();
  });

  test('Should show validation errors when submitting an empty form', async () => {
    await addPage.open();
    await addPage.submit();

    const errors = await addPage.getErrorMessages();
    const joinedErrors = errors.join(' ');

    expect(joinedErrors).toContain('The name is required.');
    expect(joinedErrors).toContain('The phone number is required.');
  });

  test('Should show validation error for invalid phone number length (< 10 digits)', async () => {
    await addPage.open();

    await addPage.fillForm('TestUserShortPhone', 'MALE', '12345');
    await addPage.submit();

    const errors = await addPage.getErrorMessages();
    const joinedErrors = errors.join(' ');
    expect(joinedErrors).toContain('The phone number should be 10 to 13 characters long, and can only include digits.');
  });

  test('Should show validation error for non-numeric phone number', async () => {
    await addPage.open();

    await addPage.fillForm('TestUserAlphaPhone', 'FEMALE', '12345ABCDE');
    await addPage.submit();

    const errors = await addPage.getErrorMessages();
    const joinedErrors = errors.join(' ');
    expect(joinedErrors).toContain('The phone number should be 10 to 13 characters long, and can only include digits.');
  });

  test('Cancel button should navigate back to list without creating', async ({ page }) => {
    await addPage.open();
    await addPage.fillForm('CancelSpartan', 'MALE', '1234567890');
    await addPage.cancel();

    await expect(page).toHaveURL(/\/web\/v2\/spartans$/);
  });
});
