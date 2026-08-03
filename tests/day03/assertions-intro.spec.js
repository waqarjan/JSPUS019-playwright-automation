import { test, expect } from '@playwright/test';

test.describe('Test Group', () => {
  //create a beforeEach hook to navigate to the page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('https://the-internet-5chk.onrender.com/');
    expect ( await page.title() ).toBe("Practice");
  });

  test('Verify checkboxes are checked', async ({ page }) => {
    await page.getByText('Checkboxes').click();
    let checkbox1 = page.locator("//form[@id='checkboxes']/input[@type='checkbox'][1]");
    let checkbox2 = page.locator("//form[@id='checkboxes']/input[@type='checkbox'][2]" );

    //check the checkboxes
    await checkbox1.check();
    await checkbox2.check();

    //assertion
    await expect(checkbox1).toBeChecked();
    await expect(checkbox2).toBeChecked();
    //--------- or------------
    expect ( await checkbox1.isChecked() ).toBe(true);
    expect ( await checkbox2.isChecked() ).toBe(true);
  });


  test('Verify checkboxes are unchecked', async ({ page }) => {
    await page.getByText('Checkboxes').click();
    let checkbox1 = page.locator(
      "//form[@id='checkboxes']/input[@type='checkbox'][1]",
    );
    let checkbox2 = page.locator(
      "//form[@id='checkboxes']/input[@type='checkbox'][2]",
    );

    // Uncheck the checkboxes
    await checkbox1.uncheck();
    await checkbox2.uncheck();

    //assertion
    await expect(checkbox1).not.toBeChecked();
    await expect(checkbox2).not.toBeChecked();
    //--------- or------------
    expect(await checkbox1.isChecked()).toBe(false);
    expect(await checkbox2.isChecked()).toBe(false);
  });


  test('Verify visible text of the element', async ({ page }) => {

    let headerElement =  page.locator("//span[@class='h1y']");

    //assertion
    await expect(headerElement).toHaveText('Test Automation Practice');
    //--------- or------------
    let actualText = await headerElement.innerText();
    expect(actualText).toEqual('Test Automation Practice');
  });
  
});

