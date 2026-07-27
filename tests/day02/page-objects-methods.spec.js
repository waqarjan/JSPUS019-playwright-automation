import { test } from '@playwright/test';

test('Getting the page title', async ({ page }) => {

  // navigate to the URL https://the-internet-5chk.onrender.com/
  await page.goto('https://the-internet-5chk.onrender.com/');

  // get the page title
  const title = await page.title();
  console.log(title);

});


test('Getting the URL of the page', async ({ page }) => {
  // navigate to the URL https://the-internet-5chk.onrender.com/
  await page.goto('https://the-internet-5chk.onrender.com/');

  // ge the url of the page
  const url = await page.url();
  console.log(url);

});


test('Set the Window Size', async ({ page }) => {

  // navigate to the URL https://the-internet-5chk.onrender.com/
  await page.goto('https://the-internet-5chk.onrender.com/');

  // set the window size
  // await page.setViewportSize({ width: 1850, height: 1080 });
});

