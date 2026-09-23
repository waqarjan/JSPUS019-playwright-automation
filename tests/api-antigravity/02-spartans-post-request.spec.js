import { test, expect } from '@playwright/test';
import { SpartanApiClient } from './services/spartan-api-client.js';
import { SpartanDataFactory } from './helpers/spartan-data-factory.js';

test.describe('Spartan API - POST Requests', { tag: ['@api', '@post', '@smoke', '@regression'] }, () => {
  let spartanClient;
  const createdIds = [];

  test.beforeEach(async ({ request }) => {
    spartanClient = new SpartanApiClient(request);
  });

  test.afterAll(async ({ request }) => {
    const client = new SpartanApiClient(request);
    for (const id of createdIds) {
      await client.deleteSpartan(id);
    }
  });

  test('POST /api/v2/spartans - Should successfully create a Male Spartan', async () => {
    const maleSpartan = SpartanDataFactory.createMaleSpartan();
    const response = await spartanClient.createSpartan(maleSpartan);

    expect(response.status()).toBe(201);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body.message).toBe('Successfully created the Spartan.');
    expect(body.data.name).toBe(maleSpartan.name);
    expect(body.data.gender).toBe('Male');
    expect(body.data.phone).toBe(maleSpartan.phone);
    expect(body.data.id).toBeGreaterThan(0);

    createdIds.push(body.data.id);
  });

  test('POST /api/v2/spartans - Should successfully create a Female Spartan', async () => {
    const femaleSpartan = SpartanDataFactory.createFemaleSpartan();
    const response = await spartanClient.createSpartan(femaleSpartan);

    expect(response.status()).toBe(201);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body.message).toBe('Successfully created the Spartan.');
    expect(body.data.name).toBe(femaleSpartan.name);
    expect(body.data.gender).toBe('Female');
    expect(body.data.phone).toBe(femaleSpartan.phone);
    expect(body.data.id).toBeGreaterThan(0);

    createdIds.push(body.data.id);
  });

  test('POST /api/v2/spartans - Empty body should return 400 Bad Request', async () => {
    const emptyPayload = SpartanDataFactory.createInvalidSpartan('EMPTY');
    const response = await spartanClient.createSpartan(emptyPayload);

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.httpStatus).toBe('BAD_REQUEST');
    expect(body.validationExceptions.length).toBeGreaterThanOrEqual(1);
  });

  test('POST /api/v2/spartans - Missing name should return 400 Bad Request', async () => {
    const invalidPayload = SpartanDataFactory.createInvalidSpartan('MISSING_NAME');
    const response = await spartanClient.createSpartan(invalidPayload);

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.httpStatus).toBe('BAD_REQUEST');

    const error = body.validationExceptions?.find((e) => e.errorField === 'name');
    expect(error).toBeDefined();
  });

  test('POST /api/v2/spartans - Missing gender should return 400 Bad Request', async () => {
    const invalidPayload = SpartanDataFactory.createInvalidSpartan('MISSING_GENDER');
    const response = await spartanClient.createSpartan(invalidPayload);

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.httpStatus).toBe('BAD_REQUEST');

    const error = body.validationExceptions?.find((e) => e.errorField === 'gender');
    expect(error).toBeDefined();
  });

  test('POST /api/v2/spartans - Phone shorter than 10 digits should return 400 Bad Request', async () => {
    const invalidPayload = SpartanDataFactory.createInvalidSpartan('SHORT_PHONE');
    const response = await spartanClient.createSpartan(invalidPayload);

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.httpStatus).toBe('BAD_REQUEST');

    const error = body.validationExceptions?.find((e) => e.errorField === 'phone');
    expect(error).toBeDefined();
  });

  test('POST /api/v2/spartans - Non-numeric phone should return 400 Bad Request', async () => {
    const invalidPayload = SpartanDataFactory.createInvalidSpartan('ALPHA_PHONE');
    const response = await spartanClient.createSpartan(invalidPayload);

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.httpStatus).toBe('BAD_REQUEST');
  });
});
