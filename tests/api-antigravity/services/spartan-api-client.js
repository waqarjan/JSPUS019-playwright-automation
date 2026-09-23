/**
 * SpartanApiClient encapsulates all HTTP operations for the Spartan REST API.
 * Provides dedicated methods for GET, POST, PUT, PATCH, DELETE, and SEARCH endpoints.
 */
export class SpartanApiClient {
  /**
   * @param {import('@playwright/test').APIRequestContext} request - Playwright APIRequestContext fixture
   */
  constructor(request) {
    this.request = request;
    this.spartansEndpoint = '/api/v2/spartans';
    this.helloEndpoint = '/api/v2/hello';
  }

  // ==========================================
  // GET Operations
  // ==========================================

  /**
   * Ping / Health check endpoint.
   * @returns {Promise<import('@playwright/test').APIResponse>}
   */
  async getHello() {
    return await this.request.get(this.helloEndpoint);
  }

  /**
   * Retrieves all Spartans from the database.
   * @returns {Promise<import('@playwright/test').APIResponse>}
   */
  async getAllSpartans() {
    return await this.request.get(this.spartansEndpoint);
  }

  /**
   * Retrieves a single Spartan by its unique ID.
   * @param {number|string} id - The Spartan ID
   * @returns {Promise<import('@playwright/test').APIResponse>}
   */
  async getSpartanById(id) {
    return await this.request.get(`${this.spartansEndpoint}/${id}`);
  }

  // ==========================================
  // POST Operations
  // ==========================================

  /**
   * Creates a new Spartan.
   * @param {Object} payload - Spartan payload object ({ name, gender, phone })
   * @returns {Promise<import('@playwright/test').APIResponse>}
   */
  async createSpartan(payload) {
    return await this.request.post(this.spartansEndpoint, {
      data: payload,
    });
  }

  // ==========================================
  // PUT Operations
  // ==========================================

  /**
   * Completely updates an existing Spartan.
   * @param {number|string} id - The Spartan ID to update
   * @param {Object} payload - Complete updated Spartan payload ({ name, gender, phone })
   * @returns {Promise<import('@playwright/test').APIResponse>}
   */
  async updateSpartan(id, payload) {
    return await this.request.put(`${this.spartansEndpoint}/${id}`, {
      data: payload,
    });
  }

  // ==========================================
  // PATCH Operations
  // ==========================================

  /**
   * Partially updates an existing Spartan (e.g. phone, name, gender).
   * @param {number|string} id - The Spartan ID to patch
   * @param {Object} payload - Partial payload properties
   * @returns {Promise<import('@playwright/test').APIResponse>}
   */
  async patchSpartan(id, payload) {
    return await this.request.patch(`${this.spartansEndpoint}/${id}`, {
      data: payload,
    });
  }

  // ==========================================
  // DELETE Operations
  // ==========================================

  /**
   * Deletes a Spartan by ID.
   * @param {number|string} id - The Spartan ID to delete
   * @returns {Promise<import('@playwright/test').APIResponse>}
   */
  async deleteSpartan(id) {
    return await this.request.delete(`${this.spartansEndpoint}/${id}`);
  }

  // ==========================================
  // SEARCH Operations
  // ==========================================

  /**
   * Searches Spartans by query parameters.
   * @param {Object} [params={}] - Search criteria (e.g. { nameContains: 'John', gender: 'Male' })
   * @returns {Promise<import('@playwright/test').APIResponse>}
   */
  async searchSpartans(params = {}) {
    return await this.request.get(`${this.spartansEndpoint}/search`, {
      params,
    });
  }
}
