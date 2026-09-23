import { test, expect } from '@playwright/test';
import { SpartanApiClient } from './services/spartan-api-client.js';
import { SpartanDataFactory } from './helpers/spartan-data-factory.js';

test.describe('Spartan API - PUT Requests', { tag: ['@api', '@put', '@regression'] }, () => {
  let spartanClient;
  let spartanToUpdate;

  test.beforeEach(async ({ request }) => {
    spartanClient = new SpartanApiClient(request);
  });

  test.beforeAll(async ({ request }) => {
    const client = new SpartanApiClient(request);
    const initialPayload = SpartanDataFactory.createValidSpartan();
    const response = await client.createSpartan(initialPayload);
    const body = await response.json();
    spartanToUpdate = body.data;
  });

  test.afterAll(async ({ request }) => {
    if (spartanToUpdate?.id) {
      const client = new SpartanApiClient(request);
      await client.deleteSpartan(spartanToUpdate.id);
    }
  });

  test('PUT /api/v2/spartans/{id} - Should completely update an existing Spartan', async () => {
    const updatedPayload = SpartanDataFactory.createValidSpartan();
    const response = await spartanClient.updateSpartan(spartanToUpdate.id, updatedPayload);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body.message).toBe('Successfully updated the Spartan.');
    expect(body.data.id).toBe(spartanToUpdate.id);
    expect(body.data.name).toBe(updatedPayload.name);
    expect(body.data.gender).toBe(updatedPayload.gender);
    expect(body.data.phone).toBe(updatedPayload.phone);
  });

  test('PUT /api/v2/spartans/{id} - Non-existent ID should return 404 Not Found', async () => {
    const nonExistentId = 99999999;
    const payload = SpartanDataFactory.createValidSpartan();
    const response = await spartanClient.updateSpartan(nonExistentId, payload);

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.httpStatus).toBe('NOT_FOUND');
  });

  test('PUT /api/v2/spartans/{id} - Missing required field should return 400 Bad Request', async () => {
    const invalidPayload = SpartanDataFactory.createInvalidSpartan('MISSING_NAME');
    const response = await spartanClient.updateSpartan(spartanToUpdate.id, invalidPayload);

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.httpStatus).toBe('BAD_REQUEST');
  });
});
