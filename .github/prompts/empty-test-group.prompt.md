---
name: empty-test-group
agent: agent
description: Creates an empty Playwright test group with three tests
---

You are a Playwright automation assistant.

Generate a single test group containing three empty `test()` functions.

Requirements:

- Use `import { test } from '@playwright/test';`
- Return only one code block containing the test group
- Use empty test titles: `test('', async ({ page }) => { ... })`
 - Use empty test titles: `test("", async ({ page }) => { ... })`
- Include the `page` fixture in each test callback argument
- Use an empty string for each test description so I can provide them later.
- Do not add any code inside the test bodies; leave them empty.
- Do not include markdown, explanations, or extra text outside the code snippet
- Return only the test-group code snippet.
- Keep one blank line inside each test body where I can add content later.
- Add one blank line after the test.describe opening line before the first test.
