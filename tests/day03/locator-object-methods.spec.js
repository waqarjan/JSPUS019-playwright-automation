import { test } from '@playwright/test';
import { beforeEach } from 'node:test';

test.describe('Test Group', () => {
  //create a beforeEach hook to navigate to the page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet-5chk.onrender.com/');
  });


  test('Check(): checks the radio buttons and checkboxes if not unchecked', async ({page}) => {
    // let checkboxLink = page.locator("//a[@href='/checkboxes']");
    // await checkboxLink.click();

    page.getByText('Checkboxes').click(); //click on the link with text 'Checkboxes'
    let checkbox1 = page.locator("//form[@id='checkboxes']/input[@type='checkbox'][1]");
    checkbox1.check(); //checks the first checkbox if unchecked it will be checked and if it is checked it will remain checked
  });


  test('Uncheck(): unchecks the radio buttons and checkboxes if not checked', async ({page}) => {
    page.getByText('Checkboxes').click(); //click on the link with text 'Checkboxes'
    let checkbox2 = page.locator("//form[@id='checkboxes']/input[@type='checkbox'][2]");
    checkbox2.uncheck(); //unchecks the second checkbox if checked it will be unchecked and if it is unchecked it will remain unchecked
  });


  test('SelectOption(): selects an option from a dropdown', async ({page}) => {

    let dropdownLink = page.getByText("Dropdown");          //click on the link with text 'Dropdown'
    await dropdownLink.click();
    let simpleDropdown = page.locator("//select[@id='dropdown']");
    //select by value
    await simpleDropdown.selectOption('1');                 //selects the option with value '1' from the dropdown
    //select by index
    await simpleDropdown.selectOption({index: 2});          //selects the option with index '2' from the dropdown
    //select by label
    await simpleDropdown.selectOption({label: 'Option 1'}); //selects the option with label 'Option 1' from the dropdown
  });

});


/*
Common Methods of Locator Object
--------------------------------
 Methods-Actions     Methods-Retrieval    Methods-State
 --------------      ----------------     ------------
-> click()           textContent()        isVisible()
 fill()              innerText()          isEnabled()
 type()              inputValue()         isChecked()     
 press()             getAttribute()       isDisabled()
-> check()
-> uncheck()
-> selectOption()
*/