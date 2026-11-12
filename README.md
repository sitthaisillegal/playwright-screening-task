# Playwright Automation Screening Task

End-to-end tests for [playwright.dev](https://playwright.dev) and the
[TodoMVC demo](https://demo.playwright.dev/todomvc), written with Playwright Test and TypeScript.

## Prerequisites
- Node.js 18 or newer

## Install
```bash
npm install
npx playwright install chromium
```

## Run the tests
```bash
npx playwright test                       # run everything on Chromium
npx playwright test --project=docs-site   # only the playwright.dev tests
npx playwright test --project=todomvc-app # only the TodoMVC tests
npx playwright test --headed              # watch the browser
npx playwright test --ui                  # interactive UI mode
```

## View the report and traces
```bash
npx playwright show-report
```
Traces are recorded on the first retry of a failed test and can be opened from the HTML report.

## Project structure
- `tests/docs.spec.ts`: Part 1, playwright.dev checks
- `tests/todomvc.spec.ts`: Part 2, TodoMVC behaviour, including a data-driven test
- `pages/todomvc.page.ts`: Page Object for the TodoMVC app
- `playwright.config.ts`: baseURL per site, Chromium, HTML report, trace on first retry
- `.github/workflows/playwright.yml`: runs the tests on every push

## Design notes
- Locators use `getByRole`, `getByPlaceholder` and `getByText`; no XPath or CSS selectors.
- No hard sleeps. Tests rely on auto-waiting and retrying `expect` assertions.
- Two sites need two base URLs, so there is one Chromium project per site.