# NEXSTACK AI — review website

A complete English NEXSTACK AI review website, built with Astro, plain CSS and design tokens. The source is the approved working draft in `../docs/marketing-copy/`, with identity and factual boundaries from `../.agents/product-marketing.md`. Product specifications, demonstrations, project evidence and legal details remain explicitly unconfirmed. The site stays `noindex` and is not approved for public release.

Latest acceptance record: [NEXSTACK AI review acceptance](../docs/nexstack-review-acceptance-2026-10-04.md).

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

Home, Products, Comparison, Solutions, Custom, Case Studies, About, Insights, Contact and FAQ are implemented. Compliance, Privacy and Terms have separate pages. All three product lines, all three solutions, three workflow project evidence slots and three full planning guides have detail pages. A custom 404 page completes the 26-page build.

The shared shell includes navigation, a mobile menu, skip link, footer, confirmed public WhatsApp deep link, canonical metadata, English `hreflang`, structured data, sitemap and robots rules. The comparison filter, FAQ disclosures and five-field inquiry form work with native browser JavaScript. There are no third-party scripts, remote fonts or tracking cookies.

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

`npm run test` submits to the actual built HTTP endpoint and verifies acceptance by a temporary local SMTP server, including the submitter's `Reply-To`. This proves the application mail path, **not** delivery to Gmail or a company mailbox. The user previously confirmed receipt in Hotmail using the existing Gmail sender. This content update preserves that configuration and reruns local SMTP acceptance; it does not repeat external delivery. Domain authentication and deployment verification remain publication work.

## Maintain

- `src/content/pages.json`: all page headings, public body blocks, SEO titles/descriptions and source-document references. Internal notes are excluded; factual gaps use English “To confirm” notices.
- `src/content/insights.json`: article listings and full `body` blocks; keep them aligned with the matching page.
- Other `src/content/*.json`: identity, form copy, related products, scenarios, workflow slots and documentation status.
- `astro.config.mjs`: five permanent redirects from the replaced case and article paths.
- `src/content.config.ts`: build-time schemas and model/SKU extension points.
- `src/styles/tokens.css`: visual decisions; `global.css`: semantic layout rules.
- `src/components/`: reusable presentation; `src/pages/`: routes and the single inquiry endpoint.
- `scripts/` and `tests/`: executable checks and integration tests.

See [REVIEW.md](REVIEW.md) for decisions, evidence and remaining publication work. The older REVIEW record is historical; use the dated acceptance record above for the current content update. Mail credentials in `.env` must not be committed or printed.
