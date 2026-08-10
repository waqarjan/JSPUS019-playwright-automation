import { test, expect } from '@playwright/test';
import { CommonUI } from './CommonUI';


test.describe("Review Page", () => {
    
    test.beforeEach(async ({ page }) => {
            await CommonUI.login(page);
            await CommonUI.completeStartApplicationStep(page);
            await CommonUI.completePaymentPlanStep(page);
    });

  test("Verify that Step 1 & Step 2 steppers are green and Step 3 stepper is blue", async ({ page }) => {
    let startApplicationCircle = page.locator("(//div[@class='step-circle'])[1]");
    let paymentPlanCircle = page.locator("(//div[@class='step-circle'])[2]");
    let reviewPageCircle = page.locator("(//div[@class='step-circle'])[3]");

    await expect(startApplicationCircle).toHaveCSS('background-color', 'rgb(172, 245, 138)');
    await expect(paymentPlanCircle).toHaveCSS('background-color', 'rgb(172, 245, 138)');
    await expect(reviewPageCircle).toHaveCSS('background-color', 'rgb(1, 201, 255)');
  });

  test("Verify that the payment input fields are enabled and accept card details", async ({ page }) => {
    let stripBankingIframe = page.frameLocator("//iframe[contains(@src,'js.stripe.com') and @title='Secure payment input frame']");
    let cardNumberInput = stripBankingIframe.locator("//input[@id='payment-numberInput']");
    let cardExpiryInput = stripBankingIframe.locator("//input[@id='payment-expiryInput']");
    let cardCvcInput = stripBankingIframe.locator("//input[@id='payment-cvcInput']");
    let countrySelect = stripBankingIframe.locator("//select[@id='payment-countryInput']");
    let postalCodeInput = stripBankingIframe.locator("//input[@id='payment-postalCodeInput']");
    let defaultCheckInput = page.locator("//input[@id='defaultCheck2']");

    await expect(cardNumberInput).toBeEnabled();
    await expect(cardExpiryInput).toBeEnabled();
    await expect(cardCvcInput).toBeEnabled();
    await expect(countrySelect).toBeEnabled();
    await expect(postalCodeInput).toBeEnabled();

    let cardNumber = process.env.CARD_NUMBER;
    let cardExpiry = process.env.CARD_EXPIRY;
    let cardCvc = process.env.CARD_CVC;
    let country = process.env.CARD_COUNTRY;
    let postalCode = process.env.CARD_POSTAL_CODE;

    await cardNumberInput.fill(cardNumber);
    await cardExpiryInput.fill(cardExpiry);
    await cardCvcInput.fill(cardCvc);
    await countrySelect.selectOption({ label: country });
    await postalCodeInput.fill(postalCode);

    await defaultCheckInput.check();
  });


});