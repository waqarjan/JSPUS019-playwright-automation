import { BasePage } from './base-page.js';

/**
 * SpartansListPage encapsulates all actions and locators on '/web/v2/spartans'.
 */
export class SpartansListPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // Top action buttons and badges
    this.addSpartanBtn = page.locator('#add_spartan_btn');
    this.totalBadge = page.locator('#total');
    this.searchCountText = page.locator('#total_up_count, #search_count');

    // Search / Filter inputs
    this.nameFilterInput = page.locator('#name');
    this.genderFilterSelect = page.locator('#gender');
    this.searchBtn = page.locator('#search');
    this.clearBtn = page.locator('#clear');

    // Table & rows
    this.table = page.locator('table');
    this.tableRows = page.locator('tbody tr');
    this.visibleTableRows = page.locator('tbody tr:visible');
  }

  /**
   * Navigates directly to the Spartans List page.
   */
  async open() {
    await this.goto('/web/v2/spartans');
    await this.table.waitFor({ state: 'visible' });
  }

  /**
   * Clicks the Add Spartan button.
   */
  async clickAddSpartan() {
    await this.addSpartanBtn.click();
  }

  /**
   * Retrieves the integer count from the Total badge.
   * @returns {Promise<number>}
   */
  async getTotalCount() {
    const text = await this.totalBadge.innerText();
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  /**
   * Retrieves the filtered count integer from search_count element.
   * @returns {Promise<number>}
   */
  async getFilteredResultCount() {
    const text = await this.searchCountText.innerText();
    const match = text.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  /**
   * Performs search by name and/or gender.
   * @param {string} [name='']
   * @param {'Male'|'Female'|''} [gender='']
   */
  async search(name = '', gender = '') {
    if (name) {
      await this.nameFilterInput.fill(name);
    }
    if (gender) {
      const normalizedGender = gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
      await this.genderFilterSelect.selectOption(normalizedGender);
    }
    await this.searchBtn.click();
  }

  /**
   * Clears the search filters.
   */
  async clearFilters() {
    await this.clearBtn.click();
  }

  /**
   * Returns a locator for a specific Spartan row by its ID.
   * @param {number|string} id
   */
  getRowById(id) {
    return this.page.locator(`tbody tr:has(td:text-is("${id}"))`);
  }

  /**
   * Returns a locator for a specific Spartan row by its Name.
   * @param {string} name
   */
  getRowByName(name) {
    return this.page.locator(`tbody tr:has(td:text-is("${name}"))`);
  }

  /**
   * Clicks the View button for a specific Spartan row.
   * @param {number|string} id
   */
  async clickView(id) {
    await this.page.locator(`#view_spartan_${id}`).click();
  }

  /**
   * Clicks the Edit button for a specific Spartan row.
   * @param {number|string} id
   */
  async clickEdit(id) {
    await this.page.locator(`#edit_spartan_${id}`).click();
  }

  /**
   * Clicks the Delete button for a specific Spartan row.
   * @param {number|string} id
   */
  async clickDelete(id) {
    await this.page.locator(`#delete_spartan_${id}`).click();
  }

  /**
   * Extracts data from a table row by ID.
   * @param {number|string} id
   * @returns {Promise<{ id: string, name: string, phone: string, gender: string }>}
   */
  async getRowData(id) {
    const row = this.getRowById(id);
    const cells = row.locator('td');
    return {
      id: await cells.nth(0).innerText(),
      name: await cells.nth(1).innerText(),
      phone: await cells.nth(2).innerText(),
      gender: await cells.nth(3).innerText(),
    };
  }
}
