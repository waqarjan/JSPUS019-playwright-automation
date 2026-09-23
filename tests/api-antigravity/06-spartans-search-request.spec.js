import { test, expect } from '@playwright/test';
import { SpartanApiClient } from './services/spartan-api-client.js';
import { SpartanDataFactory } from './helpers/spartan-data-factory.js';

test.describe('Spartan API - SEARCH Requests', { tag: ['@api', '@search', '@regression'] }, () => {
  let spartanClient;
  let sampleFemaleSpartan;

  test.beforeEach(async ({ request }) => {
    spartanClient = new SpartanApiClient(request);
  });

  test.beforeAll(async ({ request }) => {
    const client = new SpartanApiClient(request);
    const payload = SpartanDataFactory.createFemaleSpartan({
      name: `SearchTarget_${Date.now()}`,
    });
    const response = await client.createSpartan(payload);
    sampleFemaleSpartan = (await response.json()).data;
  });

  test.afterAll(async ({ request }) => {
    if (sampleFemaleSpartan?.id) {
      const client = new SpartanApiClient(request);
      await client.deleteSpartan(sampleFemaleSpartan.id);
    }
  });

  test('SEARCH /api/v2/spartans/search - Filter by nameContains', async () => {
    const response = await spartanClient.searchSpartans({
      nameContains: sampleFemaleSpartan.name,
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body.totalElement).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(body.data)).toBeTruthy();

    const found = body.data.find((s) => s.id === sampleFemaleSpartan.id);
    expect(found).toBeDefined();
    expect(found.name).toBe(sampleFemaleSpartan.name);
  });

  test('SEARCH /api/v2/spartans/search - Filter by gender=Female', async () => {
    const response = await spartanClient.searchSpartans({
      gender: 'Female',
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.totalElement).toBeGreaterThanOrEqual(1);
    for (const spartan of body.data) {
      expect(spartan.gender).toBe('Female');
    }
  });

  test('SEARCH /api/v2/spartans/search - Filter by gender=Male', async () => {
    const response = await spartanClient.searchSpartans({
      gender: 'Male',
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.totalElement).toBeGreaterThanOrEqual(1);
    for (const spartan of body.data) {
      expect(spartan.gender).toBe('Male');
    }
  });

  test('SEARCH /api/v2/spartans/search - Combined nameContains and gender filters', async () => {
    const response = await spartanClient.searchSpartans({
      nameContains: sampleFemaleSpartan.name,
      gender: 'Female',
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.totalElement).toBe(1);
    expect(body.data[0].id).toBe(sampleFemaleSpartan.id);
    expect(body.data[0].gender).toBe('Female');
  });

  test('SEARCH /api/v2/spartans/search - Non-matching query returns empty array', async () => {
    const response = await spartanClient.searchSpartans({
      nameContains: 'UnmatchedSpartan_XYZ_999999999',
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.totalElement).toBe(0);
    expect(body.data).toEqual([]);
  });
});
