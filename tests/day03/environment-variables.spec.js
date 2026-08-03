import { test } from '@playwright/test';

test('@envVarForPlayExt - Testing evnironment variable', async ({ page }) => {
    console.log(`Username is: ${process.env.PRACTICE_USERNAME}`);
    console.log(`Password is: ${process.env.PRACTICE_PASSWORD}`);
});



/* 

TO SET THE ENVIRONMENT VARIABLES:
1. Go to ">Preferences: Open User Settings (JSON)" to open settings of VSCode to set Environment variables
2. Set the environment variables for the 'Playbutton extension' & for running test in 'Terminal'

    "playwright.env"{
    "variable_name": "value"
    }

    "ternminal.integrated.env.windows"{
    "variable_name": "value"
    }

    *mac user => ternminal.integrated.env.osx

TO CALL THE ENVIRONMENT VARIABLE:
1. Use the keyword 'process.env' then 'evironment variable name'

*/


test('@envVarFromVSCdoeJSON- Bypass Authentication by enconding credentials base64 format & pass Credentials from User Settings JSON file', async ({ page }) => {
    let encodedCredentials = Buffer.from( `${process.env.PRACTICE_USERNAME}:${process.env.PRACTICE_PASSWORD}`).toString('base64');

    await page.setExtraHTTPHeaders({
    Authorization: `Basic ${encodedCredentials}`,
    });

    await page.goto('https://the-internet-5chk.onrender.com/basic_auth');
});