import { test, expect } from '@playwright/test';

test.describe("Test Group", () => {

    //create beforeEach method
    
    test.beforeEach(async( {page} )=>{
      await page.goto('https://admin:admin@the-internet-5chk.onrender.com/iframe');
      expect(await page.title() ).toBe("Practice");
    })
    
    
  test("@myFrame -iframe test", async ({ page }) => {
    let myFrame =  page.frameLocator("//iframe[@id='mce_0_ifr']");
    let myFrameTextArea = myFrame.locator("//body[@id='tinymce']");  
    // await myFrameTextArea.clear(); 
    //------OR-------
    await myFrameTextArea.press("Control+A", "Backspace") //or "delete" // clearing with keyboard action
    await myFrameTextArea.fill("Hello my Frame");
    expect(myFrameTextArea).toHaveText("Hello my Frame")

  });

});