import { test, expect } from '@playwright/test';

test('POST request', { tag: ['@postrequest'] }, async ({ request }) => {

    const newSpartan = {
        "name": "Waqar",
        "gender": "Male",
        "phone": "1234567890"
    };

    // Send POST Request
    const response = await request.post("/api/v2/spartans", { data: newSpartan });

    // Assert response status code
    expect(response.status()).toBe(201);

    // verify status text
    expect(response.statusText()).toBe('Created');

    // Assert content type header
    expect(response.headers()['content-type']).toContain('application/json');

    // Assert response body
    const responseBody = await response.json();
    console.log(responseBody);

    expect(responseBody.message).toBe('Successfully created the Spartan.');
    expect(responseBody.data).toHaveProperty('name', 'Waqar');
    expect(responseBody.data).toHaveProperty('gender', 'Male');
    expect(responseBody.data).toHaveProperty('phone', "1234567890");
    expect(responseBody.data).toHaveProperty('id');
});
