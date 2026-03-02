# SauceDemo Cucumber Automation Framework

End-to-end test automation for [SauceDemo](https://www.saucedemo.com/) using **Playwright** and **Cucumber.js**.

---

## Tech Stack

| Layer          | Technology                      |
| -------------- | ------------------------------- |
| Language       | JavaScript (Node.js)            |
| Browser Engine | Playwright (Chromium)           |
| BDD Framework  | Cucumber.js                     |
| Assertions     | Playwright built-in `expect`    |
| Reporting      | multiple-cucumber-html-reporter |
| Environment    | dotenv                          |

---

## Project Structure

```
saucedemo-cucumber/
├── .env                        # Environment variables (ENV, HEADED)
├── .env.example                # Template for .env
├── cucumber.js                 # Cucumber configuration
├── generate-report.js          # HTML report generator
├── package.json
│
├── data/                       # Test data per environment
│   ├── staging.json
│   └── production.json
│
├── features/                   # Gherkin feature files
│   ├── login.feature           # Login scenarios (Scenario Outline)
│   ├── products.feature        # Product sort (Scenario Outline)
│   ├── cart.feature            # Cart management
│   ├── checkout.feature        # Checkout flow (Scenario Outline)
│   ├── step_definitions/       # Step implementation
│   │   ├── loginSteps.js
│   │   ├── productsSteps.js
│   │   ├── cartSteps.js
│   │   └── checkoutSteps.js
│   └── support/
│       └── hooks.js            # Before/After hooks (browser, tracing, video)
│
├── pages/                      # Page Object Model
│   ├── LoginPage.js
│   ├── ProductsPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
│
├── utils/
│   ├── assert.js               # Playwright assertion wrapper
│   ├── envConfig.js            # Environment config loader
│   └── logger.js               # Console logger
│
└── reports/                    # Generated after test run
    ├── html/                   # HTML report (index.html)
    ├── screenshots/            # Failure screenshots (.png)
    ├── traces/                 # Failure traces (.zip)
    └── videos/                 # Failure videos (.webm)
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm

### Install

```bash
npm install
npx playwright install chromium
```

### Configure Environment

Copy `.env.example` to `.env` and edit:

```bash
# Choose environment: staging | production
ENV=staging

# Run headed (visible browser): true | false
HEADED=false
```

Each environment reads its data from `data/<ENV>.json`.

---

## Running Tests

```bash
# Run all tests + generate HTML report
npm test

# Run only @smoke scenarios
npm run test:smoke

# Run only @negative scenarios
npm run test:negative

# Run the intentional failure demo
npm run test:failure-demo

# Dry run (validate step definitions without executing)
npm run test:dry

# Generate HTML report from last run
npm run report
```

### Switch Environment

```bash
# Windows PowerShell
$env:ENV="production"; npm test

# Linux / macOS
ENV=production npm test
```

### Run Headed (visible browser)

```bash
# Windows PowerShell
$env:HEADED="true"; npm test

# Linux / macOS
HEADED=true npm test
```

---

## Multi-Environment Support

| File                   | Purpose                          |
| ---------------------- | -------------------------------- |
| `.env`                 | Active environment + settings    |
| `data/staging.json`    | URLs & credentials for staging   |
| `data/production.json` | URLs & credentials for prod      |
| `utils/envConfig.js`   | Reads `.env`, loads correct data |

The `envConfig` module is used by hooks, page objects, and steps — so changing `ENV` in `.env` switches the entire test suite to a different environment.

---

## Reporting

After each test run, a **JSON report** is saved to `reports/cucumber-report.json`. The `generate-report.js` script uses `multiple-cucumber-html-reporter` to produce an interactive HTML report at `reports/html/index.html`.

### On Failure, These Artifacts Are Captured

| Artifact   | Location               | Format  |
| ---------- | ---------------------- | ------- |
| Screenshot | `reports/screenshots/` | `.png`  |
| Trace      | `reports/traces/`      | `.zip`  |
| Video      | `reports/videos/`      | `.webm` |

- **Screenshots** are also embedded in the HTML report.
- **Traces** can be viewed with: `npx playwright show-trace reports/traces/<file>.zip`

---

## Parallel Execution

Tests run in parallel by default. The worker count is set to **half the CPU cores** in `cucumber.js`.

| Command               | Description                                 |
| --------------------- | ------------------------------------------- |
| `npm test`            | Run all tests in parallel (default workers) |
| `npm run test:serial` | Run all tests sequentially (1 worker)       |

Override workers from the command line:

```bash
# Run with 4 parallel workers
npx cucumber-js --parallel 4 && node generate-report.js
```

Parallel execution is safe because each scenario launches its own browser instance in the `Before` hook — there is no shared state between workers.

---

## Tags

| Tag             | Purpose                             |
| --------------- | ----------------------------------- |
| `@smoke`        | Happy-path / critical scenarios     |
| `@negative`     | Validation & error scenarios        |
| `@demo-failure` | Intentionally failing test for demo |

---

## Key Design Decisions

1. **Playwright `expect` over Chai** — Auto-waiting, auto-retry, better error messages.
2. **Page Object Model** — Fixed locators in constructor, dynamic locators as methods.
3. **Scenario Outline** — Used for data-driven negative tests (login, checkout, sorting).
4. **`utils/assert.js`** — Thin wrapper for consistent logging; delegates to Playwright expect.
5. **Environment-driven** — `.env` + per-env JSON data files; no hardcoded URLs or credentials.
6. **Failure artifacts** — Screenshot, Playwright trace, and video captured automatically.
