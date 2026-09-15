import { test, expect } from '@playwright/test';

test('PUT request', { tag: ['@putrequest'] }, async ({ request }) => {

    let id = 1824;

    const updatedSpartan = {
        "name": "Waqar Jutt",
        "gender": "Male",
        "phone": "6552564123"
    };

    //Send PUT request
    const response = await request.put(`/api/v2/spartans/${id}`, { data: updatedSpartan });
    const responseBody = await response.json();

    // Assertions
    expect(response.status()).toBe(200);
    expect(responseBody.message).toBe("Successfully updated the Spartan.");
    expect(response.headers()['content-type']).toContain('application/json');
    expect(responseBody.data).toHaveProperty('name', "Waqar Jutt");
    expect(responseBody.data).toHaveProperty('gender', "Male");
    expect(responseBody.data).toHaveProperty('phone', "6552564123");
});


test('PATCH request', { tag: ['@patchrequest'] }, async ({ request }) => {

    let id = 1824;
    const patchSpartan = {
        "phone": "0123456789"
    };

    //Send PATCH request
    const response = await request.patch(`/api/v2/spartans/${id}`, { data: patchSpartan });
    const responseBody = await response.json();

    // Assertions
    expect(response.status()).toBe(200);
    expect(responseBody.message).toBe("Successfully updated the Spartan.");
    expect(response.headers()['content-type']).toContain('application/json');
    expect(responseBody.data).toHaveProperty('phone', "0123456789");
});
