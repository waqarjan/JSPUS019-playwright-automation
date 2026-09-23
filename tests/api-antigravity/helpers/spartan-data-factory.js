import { faker } from '@faker-js/faker';

/**
 * Data factory helper for generating valid and invalid Spartan payloads for API testing.
 */
export class SpartanDataFactory {
  /**
   * Generates a valid Spartan payload.
   * @param {Object} [overrides={}] - Optional property overrides.
   * @returns {{ name: string, gender: string, phone: string }}
   */
  static createValidSpartan(overrides = {}) {
    const gender = overrides.gender || faker.helpers.arrayElement(['Male', 'Female']);
    const firstName = gender === 'Male' ? faker.person.firstName('male') : faker.person.firstName('female');

    return {
      name: `${firstName}_${faker.string.alphanumeric(4)}`,
      gender: gender,
      phone: faker.string.numeric({ length: 11 }),
      ...overrides,
    };
  }

  /**
   * Generates a valid Male Spartan payload.
   * @param {Object} [overrides={}]
   * @returns {{ name: string, gender: 'Male', phone: string }}
   */
  static createMaleSpartan(overrides = {}) {
    return this.createValidSpartan({ gender: 'Male', ...overrides });
  }

  /**
   * Generates a valid Female Spartan payload.
   * @param {Object} [overrides={}]
   * @returns {{ name: string, gender: 'Female', phone: string }}
   */
  static createFemaleSpartan(overrides = {}) {
    return this.createValidSpartan({ gender: 'Female', ...overrides });
  }

  /**
   * Generates a partial update payload for PATCH operations.
   * @param {Object} [overrides={}]
   * @returns {Object}
   */
  static createPatchPayload(overrides = {}) {
    return {
      phone: faker.string.numeric({ length: 10 }),
      ...overrides,
    };
  }

  /**
   * Generates invalid payloads for negative testing.
   * @param {'EMPTY'|'MISSING_NAME'|'MISSING_GENDER'|'SHORT_PHONE'|'ALPHA_PHONE'} type
   * @returns {Object}
   */
  static createInvalidSpartan(type) {
    switch (type) {
      case 'EMPTY':
        return {};
      case 'MISSING_NAME':
        return { gender: 'Male', phone: faker.string.numeric({ length: 10 }) };
      case 'MISSING_GENDER':
        return { name: `Spartan_${faker.string.alphanumeric(4)}`, phone: faker.string.numeric({ length: 10 }) };
      case 'SHORT_PHONE':
        return { name: `Spartan_${faker.string.alphanumeric(4)}`, gender: 'Female', phone: '12345' };
      case 'ALPHA_PHONE':
        return { name: `Spartan_${faker.string.alphanumeric(4)}`, gender: 'Male', phone: '12345ABCDE' };
      default:
        return {};
    }
  }
}
