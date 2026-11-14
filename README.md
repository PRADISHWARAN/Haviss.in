# HAVISS — 3D Metrology Solutions

A complete React + TypeScript corporate website with a prerendered public site, Supabase enquiry pipeline and restricted staff workspace.

## Run locally

```sh
npm ci
npm run dev
```

The preview normally opens at `http://127.0.0.1:5173`. Run `npm run build` for the production `dist/` directory and `npm run preview` to serve that build. `npm run check` checks TypeScript; `npm test` exercises server-side enquiry validation. `node scripts/browser-check.mjs` checks the preview at desktop, tablet and mobile sizes using the installed Edge browser.

## Pages

Home; About; Services and six detailed service pages; Products and four category pages; a dynamic verified-product detail template; Training; Industries; Resources and three articles; Contact; Request a Quote; Privacy; Image Credits; Staff Administration; and a not-found page. Twenty-four public routes are prerendered with individual metadata, canonical URLs, structured data and sitemap entries.

## Editable content

Factual defaults live in `src/data/content.ts`. Supabase-published company, service and training content overrides these defaults. The database-backed catalogue begins empty; no machine, price or availability is invented. Authorized staff manage it at `/admin`. Administration is deliberately absent from public navigation and the sitemap. Authentication and authorization are enforced by Supabase, not by hiding a link.

The public frontend uses only a Supabase URL, anonymous/publishable key and Turnstile site key. The service-role and email secrets belong only to the Edge function. All `.env` files containing real configuration are ignored by Git.

## Configuration before public launch

1. Follow [backend setup](docs/BACKEND.md): provision Supabase, apply the SQL migration, create staff accounts and roles, deploy the submission function, configure Turnstile and verify the Resend sending domain. Complete the live smoke tests documented there.
2. Configure `.env.local` from `.env.example` and rebuild. Define the exact allowed production origin in the function. The default SEO origin is `https://www.haviss.com`; change `VITE_SITE_URL` for another canonical production domain. Use a private preview until ready.
3. Review [asset rights and approval notes](docs/ASSETS.md), [research notes](docs/RESEARCH.md) and [content sources](docs/CONTENT-SOURCES.md). Photographs are licensed illustrative metrology images, not a claim about Haviss facilities, employees or current inventory. Replace with approved company photographs when available.
4. Have the company approve service scope, current contact information, privacy text and its data retention policy. Confirm WhatsApp consent before setting `VITE_ENABLE_WHATSAPP=true`.
5. Map the business domain and HTTPS through the chosen host. Keep SPA fallback for `/admin` and future `/products/equipment/:slug` routes, and return HTTP 404 for genuinely unknown paths where the host supports it. Use `dist/404.html` for the error page.
6. Set CSP and security headers according to `public/_headers` on a host supporting that format, or translate them into the host configuration. Do not cache `/admin`, auth or API responses. Check the final domain in Search Console and submit `/sitemap.xml`.

## Current integration behavior

Without configuration, the website is fully browsable and forms explicitly say online submission is not yet connected. Telephone and email links work. No submission is represented as received unless the backend persists it. Email is recorded as pending/failed if notification is not delivered; staff can see that state. No external message is sent by the build or automated QA.

## Stack and deployment

React 18, TypeScript, Vite, React Router, Lucide, locally hosted Inter/Manrope fonts, Supabase Auth/PostgreSQL/Storage/Edge Functions, Cloudflare Turnstile and Resend. CSS uses shared design tokens, responsive layouts, visible focus states and reduced-motion support. No Tailwind or component framework is required to maintain the bespoke design.

The Sites identity is preserved in `.openai/hosting.json`. Generated assets and prerendered pages are in `dist/`; source and operational documentation stay in this repository. Local test screenshots under `artifacts/` are ignored and are not deployed.
