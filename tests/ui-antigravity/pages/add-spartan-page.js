import { BasePage } from './base-page.js';

/**
 * AddSpartanPage encapsulates '/web/v2/spartans/add'.
 */
export class AddSpartanPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.nameInput = page.locator('#name');
    this.genderSelect = page.locator('#genderSelect');
    this.phoneInput = page.locator('#phone');
    this.saveBtn = page.locator('button:has-text("Save"), button.btn-success');
    this.cancelBtn = page.locator('a:has-text("Cancel"), a.btn-danger');

    // Validation feedback elements
    this.feedbackMessages = page.locator('.invalid-feedback, .alert');
  }

  /**
   * Navigates directly to the Add Spartan page.
   */
  async open() {
    await this.goto('/web/v2/spartans/add');
  }

  /**
   * Fills the add spartan form.
   * @param {string} [name]
   * @param {'MALE'|'FEMALE'|'Male'|'Female'} [gender]
   * @param {string} [phone]
   */
  async fillForm(name, gender, phone) {
    if (name !== undefined) await this.nameInput.fill(name);
    if (gender !== undefined) {
      // The select options have uppercase values/text ("MALE", "FEMALE")
      await this.genderSelect.selectOption(gender.toUpperCase());
    }
    if (phone !== undefined) await this.phoneInput.fill(phone);
  }

  /**
   * Submits the form by clicking Save.
   */
  async submit() {
    await this.saveBtn.click();
  }

  /**
   * Cancels the form by clicking Cancel.
   */
  async cancel() {
    await this.cancelBtn.click();
  }

  /**
   * Convenience method to fill and submit form in one call.
   */
  async createSpartan(name, gender, phone) {
    await this.fillForm(name, gender, phone);
    await this.submit();
  }

  /**
   * Retrieves all visible error feedback texts.
   * @returns {Promise<string[]>}
   */
  async getErrorMessages() {
    return await this.feedbackMessages.allInnerTexts();
  }
}
