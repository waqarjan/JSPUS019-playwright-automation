import {test} from '@playwright/test';

beforeAll(async () => {
  console.log('Before all tests are executed');
  console.log("--------------------------");
});

afterAll(async () => {
  console.log('--------------------------');
  console.log('After all tests are executed');
});