# Browser QA

Status: **PASSED**

Run: 2026-11-14T15:23:47.889Z

- Local target: http://127.0.0.1:4173
- Browser: Microsoft Edge (Chromium), headless through Playwright Core
- Public routes: 24; route/viewport checks completed: 72
- Viewports: desktop 1440×1000, tablet 820×1180, mobile 390×844
- Checks: HTTP responses, one H1 per page, horizontal overflow, loaded images, alt attributes, metadata, route links and anchor targets, service FAQ toggles, quote service/product context, native required validation, honest unconfigured submission state, private admin empty state and noindex.
- Screenshots and machine-readable report: `artifacts/browser-qa/`

## Verification limits

These checks run against the local site with no backend credentials. They do not verify live Supabase authentication, SQL policies, persisted enquiries, file storage, Turnstile or email delivery. The supplied integration checklist must be executed after credentials and staff roles are configured. Browser screenshots are for visual review; no Lighthouse score is claimed.

Run again with `node scripts/browser-check.mjs` while the development server is running. Optional environment overrides: `QA_BASE_URL` and `QA_BROWSER_PATH`.
