import {test} from '@playwright/test';

test.describe('Practice.cydeo', () => {

test.beforeEach(async ({ page }) => {
  await page.goto('https://the-internet-5chk.onrender.com/');
});

test.afterEach(async({page}) =>{
  await page.waitForTimeout(2000);
});


test('title of page', async ({ page }) => {
    console.log('Title of the page is: ' + await page.title());
});

test('url of page', async ({ page }) => {
    console.log('URL of the page is: ' + await page.url());
});





});