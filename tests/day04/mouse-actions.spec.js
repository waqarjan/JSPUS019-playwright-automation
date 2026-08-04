import { test } from '@playwright/test';

test.describe("Test Group", () => {

    test.beforeEach(async ({ page }) => {
       await page.goto('https://admin:admin@the-internet-5chk.onrender.com/');
    });


    test.afterEach(async ({ page }) => {
       await page.waitForTimeout(2000);
    });


    test("@leftClick -Left Click", async ({ page }) => {
      await page.click("text='A/B Testing'"); //by default performs left click
    });


    test("@rightClick -Right Click", async ({ page }) => {
      await page.click("text='A/B Testing'", { button: 'right' }); 
    });


    test('@hover -Moue hover overg', async ({ page }) => {      
     await page.click("text=Hovers");
     // await page.hover("//img[@alt='User Avatar']"); //for one single elements
     let elements =  await page.locator("//img[@alt='User Avatar']").all();
     for(let each of elements){
        await each.hover();
     }

    });

    test("@mouseWheelScroll -Moue wheel scrolling", async ({ page }) => {
        await page.mouse.wheel(0, 3000);
    });


    test('@scrolToSpecificElement -Srolling to specific element', async ({ page }) => {
       let inputsLink = await page.getByText("Inputs");
       await inputsLink.scrollIntoViewIfNeeded();
       await inputsLink.click();
    });


    test('@dragAndDrop -Drag & drop', async ({ page }) => {
        await page.click("text='Drag and Drop'");
       // await page.dragAndDrop( "//div[@id='column-a']", "//div[@id='column-b']");
       //-----or-----
       let squareA = page.locator("//div[@id='column-a']");
       let squareB = page.locator("//div[@id='column-b']");
       await squareA.dragTo(squareB);        
    });
});