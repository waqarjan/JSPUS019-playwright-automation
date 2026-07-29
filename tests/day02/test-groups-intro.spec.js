import { test } from '@playwright/test';

// Runs once before all tests in this file
test.beforeAll(async () => {
  console.log('Before all tests are executed');
  console.log("--------------------------");
});

// Runs once after all tests in this file
test.afterAll(async () => {
  console.log('--------------------------');
  console.log('After all tests are executed');
});

// Runs before every test in this file
test.beforeEach(async () => {
  console.log('Before each test is executed');
});

// Runs after every test in this file
test.afterEach(async () => {
  console.log('After each test is executed');
});

// Groups related tests together
// test.describe('Group of tests', () => {} //doesn't have to be async, but test() may be async
test.describe('Group of tests', () => {
  test('Test Case 1', async () => {
    console.log('Test case 1 is executed');
  });

  test('Test Case 2', async () => {
    console.log('Test case 2 is executed');
  });

  test('Test Case 3', async () => {
    console.log('Test case 3 is executed');
  });
});
