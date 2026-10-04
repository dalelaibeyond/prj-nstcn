# Acme Devices — review website

A complete English website for local review, built with Astro, plain CSS and design tokens. All content comes from the reference specification's Appendix A or clearly marked editorial outlines derived from it. Company identity, case studies, metrics, contacts and certification statuses are placeholders. The site stays `noindex` and is not approved for public release.

## Run locally

Requires Node.js 22.12+ and npm.

```sh
cd goal-run
npm ci
npm run build
npm run start
```

Open <http://localhost:4321>. The server listens on all interfaces for a local review environment. `npm run dev` runs the development server. `npm run start` loads `.env` if present; changing built content or the site origin requires rebuilding.

## Pages

Home, Products, Comparison, Solutions, Custom, Case Studies, About, Insights, Contact and FAQ are implemented. Compliance, Privacy and Terms have separate pages. All three product lines, all three solutions, all three illustrative cases and all three resource outlines have detail pages. A custom 404 page completes the 26-page build.

The shared shell includes navigation, a mobile menu, skip link, footer, placeholder WhatsApp deep link, canonical metadata, English `hreflang`, structured data, sitemap and robots rules. The comparison filter, FAQ disclosures and five-field inquiry form work with native browser JavaScript. There are no third-party scripts, remote fonts or tracking cookies.

## Validate

```sh
npm run build
npm run check:types
npm run test
npx playwright install chromium
npm run test:browser  # requires the local server above
npm run gate
```

Build runs semantic, token, contrast, internal-link and accessibility markup checks. Tests cover inquiry validation, spam controls, rate limits, mail errors, release-gate rejection and actual SMTP transmission to a local test server. Browser checks cover every route at desktop and mobile widths, axe WCAG AA rules, keyboard navigation, interactions, overflow, third-party requests and local performance. Screenshots and the browser report are saved under `test-results/`.

**The release gate deliberately fails on this review dataset.** `npm run build:production` enforces the same strict gate. Passing review tests confirms that the gate rejects placeholders; it does not mean the release gate passes.

## Inquiry delivery

Copy `.env.example` to `.env`, then configure SMTP or Resend, a verified `MAIL_FROM`, and `INQUIRY_TO`. The reference development recipient is supplied only as an environment-variable example; it does not appear on public pages. Empty credentials produce an honest generic error rather than a fake success. Logs exclude inquiry details. Requests are never written to a database or file, and Astro sessions are disabled.

`npm run test` submits to the actual built HTTP endpoint and verifies acceptance by a temporary local SMTP server, including the submitter's `Reply-To`. This proves the application mail path, **not** delivery to Gmail or a company mailbox. Real outbound delivery and SPF/DKIM still need valid credentials and domain configuration.

## Maintain

- `src/content/*.json`: identity, UI copy, products, solutions, cases, resources and certifications.
- `src/content.config.ts`: build-time schemas and model/SKU extension points.
- `src/styles/tokens.css`: visual decisions; `global.css`: semantic layout rules.
- `src/components/`: reusable presentation; `src/pages/`: routes and the single inquiry endpoint.
- `scripts/` and `tests/`: executable checks and integration tests.

See [REVIEW.md](REVIEW.md) for decisions, evidence and remaining publication work. `docs/` and `archive/` are not modified.
