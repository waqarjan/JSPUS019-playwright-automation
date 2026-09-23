/**
 * BasePage provides shared page utilities, navigation, and common header locators.
 */
export class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.navbarBrand = page.locator('.navbar-brand');
    this.backToHomeBtn = page.locator('#back_to_home_btn');
  }

  /**
   * Navigates to a specific path.
   * @param {string} path
   */
  async goto(path = '/web/v2/spartans') {
    await this.page.goto(path);
  }

  /**
   * Retrieves the current page title.
   * @returns {Promise<string>}
   */
  async getTitle() {
    return await this.page.title();
  }
}
