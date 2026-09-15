import { test, expect } from '@playwright/test';


test("Context fixture example", async ({ context }) => {
  const page1 = await context.newPage(); // Create a new page (browser tab) in the context
  const page2 = await context.newPage();
  const page3 = await context.newPage();
  const page4 = await context.newPage();

  await page1.bringToFront(); // only for view purposes, to make sure the first page is in front
  await page1.goto('https://www.facebook.com'); // Navigate to a URL in the first page

  await page2.bringToFront();
  await page2.goto('https://www.instagram.com'); 

  await page3.bringToFront();
  await page3.goto('https://www.linkedin.com'); 

  await page4.bringToFront();
  await page4.goto('https://www.youtube.com'); 
});


test("Browser fixture example", async ({ browser }) => {
  const context1 = await browser.newContext();    // Create a new browser context 
  const context2 = await browser.newContext();   

    //open 3 tabs in context1
    const page1 = await context1.newPage(); 
    const page2 = await context1.newPage();
    const page3 = await context1.newPage();

        await page1.goto('https://www.facebook.com'); // Navigate to a URL in the first page
        await page2.goto('https://www.instagram.com'); 
        await page3.goto('https://www.linkedin.com'); 

    //open 2 tabs in context2
    const page4 = await context2.newPage();
    const page5 = await context2.newPage();
    
        await page4.goto('https://www.youtube.com');
        await page5.goto('https://www.twitter.com');
});