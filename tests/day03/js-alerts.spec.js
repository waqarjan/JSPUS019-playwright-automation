import { test, expect } from '@playwright/test';

test.describe("JavaScript Alerts", () => {
    
    //create a beforeEach() method
      test.beforeEach(async ({ page }) => {
        await page.goto('https://the-internet-5chk.onrender.com/');
        expect ( await page.title() ).toBe("Practice");

        await page.locator("//a[@href='/javascript_alerts']").click();
      });


    test("@jsAlertRegular - Regular alert with OK button", async ({ page }) => {
      /* 
      let clickForJSAlert = await page.locator("//button[@class='btn btn-primary' and @onclick='jsAlert()']");
      clickForJSAlert.click();

        * Note: a regular JavaScript alert in handled manually by Playwright 
      */

      // ------ to handle alert manually -----

      page.on('dialog', async (alert) => {
        console.log(`Alert Message: ${alert.message()}`);
        alert.accept();
      });
   
      let clickForJSAlertButton = await page.locator( "//button[@onclick='jsAlert()']" );
      await clickForJSAlertButton.click();

      //assertion
      let successMessage = page.locator( "//p[text()='You successfully clicked an alert']" );
      await expect(successMessage).toBeVisible();
      let actualMessage = await successMessage.innerText();
      await expect(actualMessage).toBe('You successfully clicked an alert');
      console.log(actualMessage);      
    });


    test("@jsAlertConfirm - Message with OK or Cancel buttons ", async ({ page }) => {
        page.on('dialog', async(alert)=>{
          console.log(`Alert message: ${alert.message()}`);
          await alert.dismiss();    
        });

       let clickForJSConfirmAlertButton = await page.locator( "//button[@onclick='jsConfirm()']" );
       await clickForJSConfirmAlertButton.click();
    });


    test("@jsAlertPrompt - Message with a text input, OK & Cancel buttons", async ({ page }) => {
        page.on('dialog', async (alert) => {
            console.log(`Alert message: ${alert.message()}`);
            await alert.accept("Cydeo");
        });

      let clickForPromptAlertButton = await page.locator( "//button[@onclick='jsPrompt()']" );
      await clickForPromptAlertButton.click();
    });

});