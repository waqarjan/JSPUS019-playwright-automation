import { BasePage } from './base-page.js';

/**
 * EditSpartanPage encapsulates '/web/v2/spartans/edit/{id}'.
 */
export class EditSpartanPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    this.nameInput = page.locator('#name');
    this.genderSelect = page.locator('#gender, #genderSelect');
    this.phoneInput = page.locator('#phone');
    this.updateBtn = page.locator('button:has-text("Update"), button.btn-primary');
    this.cancelBtn = page.locator('a:has-text("Cancel"), a.btn-danger');
  }

  /**
   * Reads current form values.
   * @returns {Promise<{ name: string, gender: string, phone: string }>}
   */
  async getFormData() {
    return {
      name: await this.nameInput.inputValue(),
      gender: await this.genderSelect.inputValue(),
      phone: await this.phoneInput.inputValue(),
    };
  }

  /**
   * Updates form values.
   * @param {string} [name]
   * @param {'MALE'|'FEMALE'|'Male'|'Female'} [gender]
   * @param {string} [phone]
   */
  async updateForm(name, gender, phone) {
    if (name !== undefined) {
      await this.nameInput.fill('');
      await this.nameInput.fill(name);
    }
    if (gender !== undefined) {
      await this.genderSelect.selectOption(gender.toUpperCase());
    }
    if (phone !== undefined) {
      await this.phoneInput.fill('');
      await this.phoneInput.fill(phone);
    }
  }

  /**
   * Submits the update form.
   */
  async submit() {
    await this.updateBtn.click();
  }

  /**
   * Cancels editing.
   */
  async cancel() {
    await this.cancelBtn.click();
  }
}
