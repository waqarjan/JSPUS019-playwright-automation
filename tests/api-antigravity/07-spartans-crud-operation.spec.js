import { test, expect } from '@playwright/test';
import { SpartanApiClient } from './services/spartan-api-client.js';
import { SpartanDataFactory } from './helpers/spartan-data-factory.js';

test.describe('Spartan API - Full CRUD Operation Flow', { tag: ['@api', '@crud', '@smoke', '@regression'] }, () => {
  let spartanClient;
  let createdSpartanId;
  const initialSpartan = SpartanDataFactory.createValidSpartan();
  const fullUpdatePayload = SpartanDataFactory.createValidSpartan();
  const patchPayload = SpartanDataFactory.createPatchPayload();

  test.beforeEach(async ({ request }) => {
    spartanClient = new SpartanApiClient(request);
  });

  // Step 1: CREATE (POST)
  test('1. CREATE - POST /api/v2/spartans should create a new Spartan', async () => {
    const response = await spartanClient.createSpartan(initialSpartan);

    expect(response.status()).toBe(201);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body.message).toBe('Successfully created the Spartan.');
    expect(body.data).toHaveProperty('id');
    expect(body.data.name).toBe(initialSpartan.name);
    expect(body.data.gender).toBe(initialSpartan.gender);
    expect(body.data.phone).toBe(initialSpartan.phone);

    createdSpartanId = body.data.id;
    expect(createdSpartanId).toBeGreaterThan(0);
  });

  // Step 2: READ (GET)
  test('2. READ - GET /api/v2/spartans/{id} should retrieve the created Spartan', async () => {
    expect(createdSpartanId, 'Spartan ID must exist from CREATE step').toBeDefined();

    const response = await spartanClient.getSpartanById(createdSpartanId);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body.message).toBe('Successfully retrieved the Spartan.');
    expect(body.data.id).toBe(createdSpartanId);
    expect(body.data.name).toBe(initialSpartan.name);
    expect(body.data.gender).toBe(initialSpartan.gender);
    expect(body.data.phone).toBe(initialSpartan.phone);
  });

  // Step 3: UPDATE (PUT)
  test('3. UPDATE (PUT) - PUT /api/v2/spartans/{id} should completely update the Spartan', async () => {
    expect(createdSpartanId, 'Spartan ID must exist from CREATE step').toBeDefined();

    const response = await spartanClient.updateSpartan(createdSpartanId, fullUpdatePayload);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body.message).toBe('Successfully updated the Spartan.');
    expect(body.data.id).toBe(createdSpartanId);
    expect(body.data.name).toBe(fullUpdatePayload.name);
    expect(body.data.gender).toBe(fullUpdatePayload.gender);
    expect(body.data.phone).toBe(fullUpdatePayload.phone);
  });

  // Step 4: PARTIAL UPDATE (PATCH)
  test('4. PARTIAL UPDATE (PATCH) - PATCH /api/v2/spartans/{id} should partially update phone', async () => {
    expect(createdSpartanId, 'Spartan ID must exist from CREATE step').toBeDefined();

    const response = await spartanClient.patchSpartan(createdSpartanId, patchPayload);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body.message).toBe('Successfully updated the Spartan.');
    expect(body.data.id).toBe(createdSpartanId);
    expect(body.data.phone).toBe(patchPayload.phone);
    // Name and gender remain from previous PUT update
    expect(body.data.name).toBe(fullUpdatePayload.name);
    expect(body.data.gender).toBe(fullUpdatePayload.gender);
  });

  // Step 5: DELETE (DELETE)
  test('5. DELETE - DELETE /api/v2/spartans/{id} should delete the Spartan', async () => {
    expect(createdSpartanId, 'Spartan ID must exist from CREATE step').toBeDefined();

    const response = await spartanClient.deleteSpartan(createdSpartanId);

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await response.json();
    expect(body.message).toBe('Successfully deleted the Spartan.');
  });

  // Step 6: VERIFY DELETION (GET -> 404)
  test('6. VERIFY DELETION - GET /api/v2/spartans/{id} should return 404 Not Found', async () => {
    expect(createdSpartanId, 'Spartan ID must exist from CREATE step').toBeDefined();

    const response = await spartanClient.getSpartanById(createdSpartanId);

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.httpStatus).toBe('NOT_FOUND');
  });

  // Atomic Single-Test Full CRUD Flow
  test('Atomic End-to-End CRUD verification in a single test flow', async () => {
    // 1. Create
    const newPayload = SpartanDataFactory.createMaleSpartan();
    const createRes = await spartanClient.createSpartan(newPayload);
    expect(createRes.status()).toBe(201);
    const id = (await createRes.json()).data.id;

    // 2. Read
    const getRes = await spartanClient.getSpartanById(id);
    expect(getRes.status()).toBe(200);
    expect((await getRes.json()).data.name).toBe(newPayload.name);

    // 3. Update (PUT)
    const updatePayload = SpartanDataFactory.createFemaleSpartan();
    const putRes = await spartanClient.updateSpartan(id, updatePayload);
    expect(putRes.status()).toBe(200);
    expect((await putRes.json()).data.gender).toBe('Female');

    // 4. Patch
    const patchPhone = SpartanDataFactory.createPatchPayload();
    const patchRes = await spartanClient.patchSpartan(id, patchPhone);
    expect(patchRes.status()).toBe(200);
    expect((await patchRes.json()).data.phone).toBe(patchPhone.phone);

    // 5. Delete
    const deleteRes = await spartanClient.deleteSpartan(id);
    expect(deleteRes.status()).toBe(200);

    // 6. Verify 404
    const verifyRes = await spartanClient.getSpartanById(id);
    expect(verifyRes.status()).toBe(404);
  });
});
