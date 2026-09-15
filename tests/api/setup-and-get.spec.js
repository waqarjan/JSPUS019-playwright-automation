import { base } from '@faker-js/faker';
import { test, expect } from '@playwright/test';


    
    test("GET /api/v2/spartans", async ({ request }) => {
        
        // const baseURL = "https://spartan-app-new-nonsecure.onrender.com/";
        // const endpoint = "api/v2/spartans";

        // let response = await request.get(`${baseURL}${endpoint}`);
        let response = await request.get('/api/v2/spartans');
        console.log(response);
        console.log(await response.json());

        //verify the response status code
        expect(response.status()).toBe(200);

        //verify the content type is application/json
        expect(response.headers()['content-type']).toContain('application/json');

    });



    test("GET /api/v2/spartans/{id}", async ({ request }) => {
       // const baseURL = "https://spartan-app-new-nonsecure.onrender.com/";
        let id = 1197
        const endpoint = `api/v2/spartans/${id}`;
        //let response = await request.get(`${baseURL}${endpoint}`);

        let response = await request.get(`/api/v2/spartans/${id}`);
        //verify the response status code
        expect(response.status()).toBe(200);

        //verify the content type is application/json
        expect(response.headers()['content-type']).toContain('application/json');

        let responseBody = await response.json(); //converted the json to javascript object.
        console.log(responseBody);

        //verify the response body the message is 'Successfully retrieved the Spartan.'
        expect(responseBody.message).toBe('Successfully retrieved the Spartan.');

        //verify the response body data has name Waqar, gender Male.
        expect(responseBody.data.name).toBe('Josh');
        expect(responseBody.data.gender).toBe('Male');
    });