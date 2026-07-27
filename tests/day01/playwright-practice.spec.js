import { test } from '@playwright/test';

test('', async ({ page }) => {

    // navigate to the URL https://www.saucedemo.com/
    await page.goto('https://www.saucedemo.com/');

    // pause for 3 seconds
    await page.waitForTimeout(3000);

    

});

