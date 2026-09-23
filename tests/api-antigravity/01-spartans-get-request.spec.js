import { test, expect } from '@playwright/test';
import { SpartanApiClient } from './services/spartan-api-client.js';
import { SpartanDataFactory } from './helpers/spartan-data-factory.js';

test.describe('Spartan API - GET Requests', { tag: ['@api', '@get', '@smoke', '@regression'] }, () => {
  let spartanClient;
  let testSpartan;

  test.beforeEach(async ({ request }) => {
    spartanClient = new SpartanApiClient(request);
  });

  test.beforeAll(async ({ request }) => {
    const client = new SpartanApiClient(request);
    const payload = SpartanDataFactory.createValidSpartan();
    const response = await client.createSpartan(payload);
    const body = await response.json();
    testSpartan = body.data;
  });

  test.afterAll(async ({ request }) => {
    if (testSpartan?.id) {
      const client = new SpartanApiClient(request);
      await client.deleteSpartan(testSpartan.id);
    }
  });

  test('GET /api/v2/hello - Health check should return 200 OK and text message', async () => {
    const response = await spartanClient.getHello();

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('text/plain');

    const text = await response.text();
    expect(text).toBe('Hello World!');
  });

  test('GET /api/v2/spartans - Should return all Spartans with valid structure and headers', async () => {
    const response = await spartanClient.getAllSpartans();

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body).toHaveProperty('message');
    expect(body).toHaveProperty('totalElement');
    expect(body).toHaveProperty('data');

    expect(typeof body.totalElement).toBe('number');
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBe(body.totalElement);

    if (body.data.length > 0) {
      const first = body.data[0];
      expect(typeof first.id).toBe('number');
      expect(typeof first.name).toBe('string');
      expect(['Male', 'Female']).toContain(first.gender);
      expect(typeof first.phone).toBe('string');
      expect(first.phone).toMatch(/^\d{10,13}$/);
    }
  });

  test('GET /api/v2/spartans/{id} - Should return existing Spartan by ID', async () => {
    const response = await spartanClient.getSpartanById(testSpartan.id);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body.message).toBe('Successfully retrieved the Spartan.');
    expect(body.data.id).toBe(testSpartan.id);
    expect(body.data.name).toBe(testSpartan.name);
    expect(body.data.gender).toBe(testSpartan.gender);
    expect(body.data.phone).toBe(testSpartan.phone);
  });

  test('GET /api/v2/spartans/{id} - Non-existent ID should return 404 Not Found', async () => {
    const nonExistentId = 99999999;
    const response = await spartanClient.getSpartanById(nonExistentId);

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.httpStatus).toBe('NOT_FOUND');
  });
});
