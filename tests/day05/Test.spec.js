import { expect, test } from '@playwright/test';

test.describe('SEP Application', () => {
  test.beforeEach(async ({ page }) => {
    let encodedCredentials = Buffer.from('automation-user:123abc').toString('base64');
    await page.setExtraHTTPHeaders({ Authorization: `Basic ${encodedCredentials}`});
    await page.goto('https://qa.sep.tdtm.cydeo.com/taws');
  });

  test('SEP Application Landing page', async ({ page }) => {
    expect(page).toHaveTitle('Checkout | Cydeo');

    let courseName = page.locator(
      "//p/a[contains(text(),' Test Automation with Selenium')]",
    );
    expect(courseName).toHaveAttribute('href');
    expect(courseName).toBeEnabled;

    const stepCircle = page.locator(
      '//div[@class="step-circle" and following-sibling::div[@class="step-title" and normalize-space()="Start Application"]]',
    );
    await expect(stepCircle).toHaveCSS('background-color', 'rgb(1, 201, 255)');
  });


  test('SEP Application Login', async ({ page }) => {
    let firstName = page.locator("//input[@id='mat-input-0']");
    await firstName.click();
    firstName.fill('Waqar');

    let lastName = page.locator("//input[@id='mat-input-1']");
    await lastName.click();
    lastName.fill('Jan');

    let emailAddress = page.locator(
      "//mat-label[normalize-space()='Email Address']",
    );
    await emailAddress.click();
    emailAddress.fill('testsep@qa.com');

    let phoneNumber = page.locator("//input[@formcontrolname='phoneNumber']");
    await phoneNumber.click();
    phoneNumber.fill('5154195255');

    //    let howDidYouHearDropdown = page.locator("//div[@id='mat-select-value-1']");
    //        await page.click(howDidYouHearDropdown);
    //        await page.click('mat-option[value="email"]');

    let buttonNext = page.locator("//button[@type='submit']");
    await buttonNext.scrollIntoViewIfNeeded();
    await buttonNext.click();

    const stepCircle = page.locator(
      '//div[@class="step-circle" and following-sibling::div[@class="step-title" and normalize-space()="Payment plan"]',
    );
    await expect(stepCircle).toHaveCSS('background-color', 'rgb(1, 201, 255)');
  });

  //iframe

  test('Strip card details', async({page})=>{


  let cardNoInputField = page.locator("//p[@id='payment-numberInput']");
  let cardExpirationInputField = page.locator("//p[@id='payment-expiryInput']");
  let cardCvcInputField = page.locator("//p[@id='payment-cvcInput']");
  let cardZIPInputField = page.locator("//p[@id='payment-postalCodeInput']");
  

    let cardNoInlineErrorMsg = page.locator("//p[@id='Field-numberError']");
    let expirationInlineErrorMsg = page.locator("//p[@id='Field-expiryError']");
    let cscInlineErrorMsg = page.locator("//p[@id='Field-cvcError']");
    let zipInlineErrorMsg = page.locator("//p[@id='Field-postalCodeError']");
  });

  
});