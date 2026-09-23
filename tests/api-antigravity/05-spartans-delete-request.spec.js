import { test, expect } from '@playwright/test';
import { SpartanApiClient } from './services/spartan-api-client.js';
import { SpartanDataFactory } from './helpers/spartan-data-factory.js';

test.describe('Spartan API - DELETE Requests', { tag: ['@api', '@delete', '@regression'] }, () => {
  let spartanClient;

  test.beforeEach(async ({ request }) => {
    spartanClient = new SpartanApiClient(request);
  });

  test('DELETE /api/v2/spartans/{id} - Should successfully delete an existing Spartan', async () => {
    // 1. Create a Spartan to delete
    const payload = SpartanDataFactory.createValidSpartan();
    const createResponse = await spartanClient.createSpartan(payload);
    expect(createResponse.status()).toBe(201);
    const createdData = (await createResponse.json()).data;

    // 2. Delete the Spartan
    const deleteResponse = await spartanClient.deleteSpartan(createdData.id);
    expect(deleteResponse.status()).toBe(200);
    expect(deleteResponse.headers()['content-type']).toContain('application/json');

    const deleteBody = await deleteResponse.json();
    expect(deleteBody.message).toBe('Successfully deleted the Spartan.');

    // 3. Verify Spartan no longer exists
    const verifyResponse = await spartanClient.getSpartanById(createdData.id);
    expect(verifyResponse.status()).toBe(404);
  });

  test('DELETE /api/v2/spartans/{id} - Non-existent ID should return 404 Not Found', async () => {
    const nonExistentId = 99999999;
    const response = await spartanClient.deleteSpartan(nonExistentId);

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.httpStatus).toBe('NOT_FOUND');
  });
});
