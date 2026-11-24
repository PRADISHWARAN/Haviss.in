# Haviss SEO checklist — ranking in Chennai

Nobody can guarantee the #1 position on Google. What decides "CMM calibration Chennai"-type searches is roughly: **Google Business Profile** (the map results), **the website** (done — see below), **reviews**, and **other sites mentioning and linking to Haviss**. Work through the list in order.

## Already done on the website

- 40 prerendered pages, each with its own title, description, canonical URL, Open Graph/Twitter tags and share image.
- Keyword pages: 7 service pages, 13 brand pages (e.g. "Mitutoyo CMM Service, Calibration & Retrofit Chennai"), fixtures, accessories, used CMM, training, and a dedicated **CMM Services in Chennai** page (`/cmm-services-chennai`) listing Chennai industrial areas.
- Structured data (schema.org): Organization + ProfessionalService with both Chennai addresses, phone, email, logo, founder, area served (Chennai, Tamil Nadu, India), offer catalogue; Service + FAQ on every service page; FAQ on the Chennai page; breadcrumbs everywhere.
- `sitemap.xml` with last-modified dates and priorities, `robots.txt`, logo PNG (`/images/haviss/haviss-logo.png`) and share image (`/images/haviss/og-image.jpg`).
- Fast static pages, image alt text, mobile-friendly layout (checked at 390 px).

## 1. Put the site on the real domain (most important website step)

The site currently tells Google its address is the temporary `chatgpt.site` URL. Google ranks a business domain far better.

1. Connect **haviss.in** to the hosting, and redirect www.haviss.in to it.
2. `VITE_SITE_URL=https://haviss.in` is already set in `.env.production` — every canonical link, the sitemap and structured data then switch to the real domain.
3. If an old site exists on haviss.com or haviss.in, redirect its old pages to the matching new pages (301 redirects) so existing Google ranking carries over.
4. Add `https://haviss.in` (and `https://www.haviss.in`) to the `ALLOWED_ORIGINS` secret of the Supabase `submit-enquiry` and `retry-notification` functions — otherwise the online enquiry form is refused on the new domain.

## 2. Google Search Console (free)

1. Go to <https://search.google.com/search-console>, add `https://haviss.in`.
2. Choose the **HTML tag** method, copy only the `content="…"` code into `VITE_GOOGLE_SITE_VERIFICATION=` in `.env.production`, rebuild and deploy, then press Verify.
3. Submit `https://haviss.in/sitemap.xml` under **Sitemaps**.
4. Use **URL inspection → Request indexing** for the home page, `/cmm-services-chennai` and the main service pages.
5. Optional: do the same at Bing Webmaster Tools (`VITE_BING_SITE_VERIFICATION`).

## 3. Google Business Profile (decides the map results in Chennai)

1. Create/claim the profile at <https://business.google.com> for **HAVISS 3D Metrology Solutions**.
2. Primary category: something like *Calibration service* or *Industrial equipment supplier*; add secondary categories such as *Machine repair service*, *Machine shop*, *Training centre* (pick the closest Google offers).
3. Use exactly the same name, address and phone as the website (NAP consistency):
   - #1A, 1st Floor, IJ Puram, Manali New Town, Ponneri High Road, Chennai 600103
   - +91 99624 74959 · haviss14@gmail.com · website https://haviss.in
   - Consider a second profile for the Padi works / inspection centre only if customers actually visit it and it has signage.
4. Add services (CMM retrofit, CMM calibration, CMM service, CMM AMC, CMM software upgrade, CMM relocation, CMM inspection, CMM training, used CMM, CMM fixtures), business hours, service areas (Chennai, Ambattur, Sriperumbudur, Oragadam, …) and a description using the same words.
5. Upload real photos: the fixture photos, the inspection-centre CMM, the logo, team at work. Add new photos every month.
6. Post an update every couple of weeks (a retrofit completed, a calibration, a fixture delivered).

## 4. Reviews

Ask every satisfied customer for a Google review (Business Profile → "Ask for reviews" gives a short link to send on WhatsApp). Reviews that mention the service and place — "CMM calibration in Chennai", "retrofit of our Mitutoyo CMM" — help most. Reply to every review.

## 5. Listings and links (citations)

List Haviss, with the identical name/address/phone and website link, on:

- IndiaMART, TradeIndia, Justdial, Sulekha
- LinkedIn company page, Facebook page, YouTube (short videos of fixtures/retrofits)
- Industry bodies and directories the company belongs to (e.g. local manufacturers' associations, metrology/quality associations)
- Customers or partners who can mention Haviss on their sites

Add the profile URLs to the website's structured data (`sameAs`) once they exist — send the links and they can be added in `src/lib/seo.ts`.

## 6. Keep the content growing

- Add a short case study or news item each month (e.g. "Retrofit of a Brown & Sharpe Xcel CMM for a Chennai auto-component maker", with photos and customer permission).
- Add real used-CMM listings through `/admin` as machines become available.
- Keep phone, email and addresses identical everywhere.

## Things to confirm with Haviss

- The Chennai industrial areas listed on `/cmm-services-chennai` match where the company actually works.
- Business hours (needed for Google Business Profile; can then be added to the website's structured data).
- The exact map pin / coordinates of both locations (set in Google Business Profile).
