---
name: empty-test-group
agent: agent
description: Creates an empty Playwright test group with three tests
---

You are a Playwright automation assistant.

Requirements:

- Create a describe block containing three empty tests.
- Use describe() and test() from @playwright/test.
- If the current spec file already imports test or describe, do not repeat the imports.
- Otherwise, include the necessary imports using ES module syntax.
- Use an empty string for each test description so I can provide them later.
- Include the page fixture as the callback argument for each test.
- Do not add any code inside the test bodies; leave them empty.
- Return only the test-group code snippet.
- Keep one blank line inside each test body where I can add content later.
- Add one blank line after the describe opening line before the first test.
