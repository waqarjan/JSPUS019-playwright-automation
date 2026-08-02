import { test } from '@playwright/test';

test.describe('Test Group', () => { test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet-5chk.onrender.com/');
  });


  test('innerText(): retrieves the visible text content of an element', async ({ page }) => {
    let pageHeaderElement = page.locator("//span[@class='h1y']");
    let actualHeaderText = await pageHeaderElement.innerText();
    //assertion
    await test.expect(actualHeaderText).toBe('Test Automation Practice');
    console.log(actualHeaderText);
  });


  test('inputValue(): retrieves the value of an input element', async ({ page  }) => {
    let inputElement = page.locator("//a[@href='/inputs']");
    await inputElement.click(); 
    let inputBox = page.locator("//input[@type='number']");
    inputBox.fill('123'); 
    let actualInputValue = await inputBox.inputValue();
    //assertion
    await test.expect(actualInputValue).toBe("123");
    console.log(actualInputValue);
  });


  test('getAttribute(): retrieves the value of a specified attribute of an element', async ({ page  }) => {
    let abTestingLink = page.locator("//a[normalize-space()='A/B Testing']");
    let hrefLink = await abTestingLink.getAttribute('href');
    //assertion
    await test.expect(hrefLink).toBe("/abtest");
    console.log("The value of the href attribute is: " + hrefLink); 
});

});

/*

Common Methods of Locator Object
--------------------------------
 Methods-Actions     Methods-Retrieval    Methods-State
 --------------      ----------------     ------------
 click()             textContent()        isVisible()
 -> fill()           -> innerText()       isEnabled()
 type()              -> inputValue()      isChecked()     
 press()             -> getAttribute()    isDisabled()
 check()
 uncheck()
 selectOption()
 
 */
