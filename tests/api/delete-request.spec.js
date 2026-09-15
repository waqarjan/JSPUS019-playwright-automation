import { test, expect } from '@playwright/test';

test('DELETE request', { tag: ['@deleterequest'] }, async ({ request }) => {

    let id = 1823;

    //Send DELETE request
    const response = await request.delete(`/api/v2/spartans/${id}`);
    const responseBody = await response.json();

    // Assertions
    expect(response.status()).toBe(200);
    expect(responseBody.message).toBe("Successfully deleted the Spartan.");
    expect(response.headers()['content-type']).toContain('application/json');

});
