import { expect, test } from '@playwright/test';

test('Window pop-up practice', async ({ page }) => {
  //creating event listener for monitoring window pop-up
  //event listener are special type i.e, it returns promise, but we donot use it (since we donot want to resolve the promise right a way).

  let promisedNewPageEvent = page.waitForEvent('popup');
  await page.goto('https://admin:admin@the-internet-5chk.onrender.com/windows');

  await page.click("text='Click Here'");              //triggers the pop-up event
  let newPage = await promisedNewPageEvent;           //await for the promise to be resolved
  await expect(newPage).toHaveTitle('New Window');    //new page title
  await expect(page).toHaveTitle('Windows');          //old page title

  await page.bringToFront();                          //to see the switch in viewport (optional)
  let firstWindowElement = await page.getByText('Opening a new window');
  expect(firstWindowElement).toBeVisible();

  await page.bringToFront();
  let secondWindowElement = await page.getByText('New Window');
  expect(secondWindowElement).toBeVisible();

});