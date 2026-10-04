# Review delivery

The user authorised a complete review version and clarified that `docs/spec.md` is reference material rather than an absolute rule. The implementation preserves its useful content, architecture and safeguards without treating missing publication assets as a reason to stop development.

## Implementation decisions

| Adjustment | Reason |
| --- | --- |
| Shorter hero headline; original value proposition retained beneath it | Makes the product and custom-development positioning easier to scan. |
| Lightweight original SVG concept diagrams in clearly labelled image slots | Enables visual review without fabricating product photos or using stock assets. |
| 25 content pages plus a 404 page | Covers the ten core modules, legal/compliance shell pages and all Appendix A detail paths. |
| Local Node standalone adapter | Provides a runnable review server and one HTTP inquiry endpoint without requiring a cloud account. Cloud deployment adapter selection remains a deployment task. |
| SMTP and Resend transport options | Allows standard company SMTP or an email API; local SMTP makes the application mail path testable without credentials. |
| Disabled Astro sessions and analytics | Avoids unnecessary storage, cookies and third-party scripts. |
| Native FAQ disclosures, mobile menu and comparison filter | Keeps the interaction code small and keyboard accessible. |
| First-party map placeholder | Avoids implying a verified address or loading third-party map components during review. |
| Resource outlines and clearly marked legal skeletons | Appendix A supplies topics rather than finished articles or policies. No unsupported technical or legal claims are added. |
| Separate review build and strict release gate | Supports review with honest placeholder labels while continuing to reject them for publication. No forbidden release patterns have been removed from the verifier. |

## Verification evidence

Verified on 2026-10-03 using Node.js 24.14.0:

| Check | Actual result |
| --- | --- |
| `npm run build` | Pass: 26 generated HTML pages and all static checks; 14 foreground/background contrast pairs meet 4.5:1. |
| `npm run check:types` | Pass: 33 files, zero errors, warnings or hints. |
| `npm run test` | Pass: 13 tests, including the built-server HTTP-to-SMTP inquiry loop and `Reply-To` verification. |
| `npm run test:browser` | Pass: 50 route/viewport checks; zero axe WCAG AA violations, page overflow, runtime exceptions or third-party requests. |
| Additional 320px reflow inspection | Pass on all 13 core and legal/compliance routes. |
| Local performance observations | Maximum LCP 124ms, CLS 0.0000 and first-party client JavaScript 2,133 bytes, counting inline modules as well as fetched scripts. Unthrottled local lab results; not field CWV or INP. |
| `npm run gate` | Expected failure: 87 file/pattern matches in the placeholder data and rendered review output. Publication is blocked. |

Use the commands in README to reproduce the checks. The build verifies every generated HTML page; browser checks visit all content routes at 1440px and 390px widths. Results and screenshots are in `test-results/` after `npm run test:browser`.

The local SMTP integration test launches the built server, submits an inquiry and receives its email through an actual SMTP connection. It verifies `Reply-To: reviewer@localhost.test` and the Appendix A development recipient in the SMTP envelope. No external mailbox delivery is claimed. Browser form-state tests use mocked responses separately from this integration test.

## Before publication

Replace the placeholder identity, domain, registration number, address, telephone, WhatsApp account and public emails. Supply verified model specifications, datasheets, real device demonstrations and authorised team/manufacturing media. Confirm certificate statuses and holders; only obtained certificates render with badge treatment. Provide authorised customer evidence or remove the case slots, metrics and logo slots. Review technical articles with a certification specialist and legal pages with counsel.

Replace all placeholder UI copy as well as data, then run the strict gate. Configure a genuine sender and company recipient, verify SPF/DKIM and actual mailbox receipt, and deliberately enable indexing only after release checks pass. The noindex guard stays on when any content collection still contains placeholders.

## Operational limits

The IP rate limiter is in memory and applies to one running instance. A production deployment with multiple replicas or serverless instances needs a trusted ingress rate limit; do not trust arbitrary client-supplied forwarding headers. Local browser timings are lab observations and do not prove field Core Web Vitals or INP. Automated axe checks supplement, rather than replace, a human accessibility review.

The dependency audit retains a high advisory for Astro's transitive `http-cache-semantics`, with no compatible fix offered by npm. The installed Astro, Node adapter and Nodemailer versions were upgraded to patched versions rather than accepting npm's proposed downgrade to Astro 2. This website does not use remote-image caching or shared-user response caching. Reassess that advisory before deployment.

## Next-session handoff

Work is paused at the user's request. The local review server was stopped and confirmed no longer responding on port 4321. No deployment has occurred. All source, lockfile, built output and review screenshots remain in `goal-run/`; the reference specification is unchanged.

The latest agreed deliverable is a website version for review. The user explicitly clarified that the specification is reference material, not an absolute rule, and authorised sensible implementation decisions without repeated questions. Do not interpret missing publication content as a reason to discard or stop developing the review site. Preserve clear placeholder labels and honest certification/case-study treatment.

The next step is to review the website together and align the next changes before resuming implementation. In a new session, read this file and README, inspect the current files, and incorporate the user's review feedback. Start the existing build with `cd goal-run && npm run start`; open `http://localhost:4321`. Rebuild after source changes. Do not assume an old process is still running or that previous test results prove new changes.

Last verified state: 26 pages; build and static checks passed; type check passed with zero diagnostics; 13 tests passed including local SMTP acceptance and submitter Reply-To; 50 desktop/mobile route checks passed. The strict publication gate has 87 placeholder file/pattern matches. Real mailbox delivery has not been verified, and no SMTP/Resend sender configuration was available. Local performance results and remaining publication work are listed above.
