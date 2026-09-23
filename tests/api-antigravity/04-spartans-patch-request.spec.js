import { test, expect } from '@playwright/test';
import { SpartanApiClient } from './services/spartan-api-client.js';
import { SpartanDataFactory } from './helpers/spartan-data-factory.js';

test.describe('Spartan API - PATCH Requests', { tag: ['@api', '@patch', '@regression'] }, () => {
  let spartanClient;
  let spartanToPatch;

  test.beforeEach(async ({ request }) => {
    spartanClient = new SpartanApiClient(request);
  });

  test.beforeAll(async ({ request }) => {
    const client = new SpartanApiClient(request);
    const initialPayload = SpartanDataFactory.createValidSpartan();
    const response = await client.createSpartan(initialPayload);
    const body = await response.json();
    spartanToPatch = body.data;
  });

  test.afterAll(async ({ request }) => {
    if (spartanToPatch?.id) {
      const client = new SpartanApiClient(request);
      await client.deleteSpartan(spartanToPatch.id);
    }
  });

  test('PATCH /api/v2/spartans/{id} - Should partially update phone number', async () => {
    const patchPayload = SpartanDataFactory.createPatchPayload();
    const response = await spartanClient.patchSpartan(spartanToPatch.id, patchPayload);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body.message).toBe('Successfully updated the Spartan.');
    expect(body.data.id).toBe(spartanToPatch.id);
    expect(body.data.phone).toBe(patchPayload.phone);
    // Name and gender should remain intact
    expect(body.data.name).toBe(spartanToPatch.name);
    expect(body.data.gender).toBe(spartanToPatch.gender);
  });

  test('PATCH /api/v2/spartans/{id} - Should partially update name', async () => {
    const patchPayload = { name: `Patched_${Date.now()}` };
    const response = await spartanClient.patchSpartan(spartanToPatch.id, patchPayload);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data.name).toBe(patchPayload.name);
  });

  test('PATCH /api/v2/spartans/{id} - Non-existent ID should return 404 Not Found', async () => {
    const nonExistentId = 99999999;
    const patchPayload = SpartanDataFactory.createPatchPayload();
    const response = await spartanClient.patchSpartan(nonExistentId, patchPayload);

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.httpStatus).toBe('NOT_FOUND');
  });

  test('PATCH /api/v2/spartans/{id} - Invalid phone length should return 400 Bad Request', async () => {
    const invalidPatch = { phone: '123' };
    const response = await spartanClient.patchSpartan(spartanToPatch.id, invalidPatch);

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.httpStatus).toBe('BAD_REQUEST');
  });
});
