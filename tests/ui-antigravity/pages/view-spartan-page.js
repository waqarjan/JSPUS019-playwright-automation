import { BasePage } from './base-page.js';

/**
 * ViewSpartanPage encapsulates the read-only details view at '/web/v2/spartans/{id}'.
 */
export class ViewSpartanPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.nameField = page.locator('#name');
    this.genderField = page.locator('#gender');
    this.phoneField = page.locator('#phone');

    this.backToListBtn = page.locator('a:has-text("Back to the List"), a.btn-primary');
    this.backToHomeBtn = page.locator('a:has-text("Back to Home"), a.btn-secondary');
  }

  /**
   * Extracts read-only values from the detail card.
   * @returns {Promise<{ name: string, gender: string, phone: string }>}
   */
  async getDetails() {
    return {
      name: await this.nameField.inputValue(),
      gender: await this.genderField.inputValue(),
      phone: await this.phoneField.inputValue(),
    };
  }

  /**
   * Clicks Back to List button.
   */
  async backToList() {
    await this.backToListBtn.click();
  }

  /**
   * Clicks Back to Home button.
   */
  async backToHome() {
    await this.backToHomeBtn.click();
  }
}
