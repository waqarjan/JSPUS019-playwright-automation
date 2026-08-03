import { test, expect } from '@playwright/test';

test.describe('1-Test Suite for Array of Elements', () => {

    //create a beforeEach hook to navigate to the page before each test
    test.beforeEach(async ({ page }) => {
      await page.goto('https://the-internet-5chk.onrender.com/');
      expect ( await page.title() ).toBe("Practice");
    });
    

    test("1-Verify that there are esxactly 50 link elements within the <ul> tag of the home page", async ({ page }) => {
    let numberOfULLink = await page.locator("//ul[@class='list-group']/li");
        expect(await numberOfULLink.count()).toBe(50);
    });


    test("2-Verify that each of the 50 link elements within the <ul> tag is visible & clickable", async ({ page }) => {
      let elements = await page.locator("//ul[@class='list-group']/li/a").all();
        
      for(let e of await elements) {
        await expect(e).toBeVisible(); //passing locator instance
        await expect(e).toBeEnabled();
        //----------
        // expect( await e.isVisible() ).toBeTruthy(); //passing boolean value
        // expect( await e.isEnabled() ).toBeTruthy();
      }
    });


    test("3-Verify that each of the 50 link elements within the <ul> tag has a href attribute", async ({ page }) => {
      let elements = await page.locator("//ul[@class='list-group']/li/a").all();
      for (let e of elements) {
        await expect(e).toHaveAttribute('href'); //passing locator instance
      }
    });


});