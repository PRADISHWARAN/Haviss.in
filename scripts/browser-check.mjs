import { chromium } from 'playwright-core';
import { build } from 'esbuild';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

// Run against a local, unconfigured preview. This never sends enquiries or signs in.
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:5173';
const executablePath = process.env.QA_BROWSER_PATH || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const output = resolve('artifacts/browser-qa');
await mkdir(output, { recursive: true });
await mkdir('node_modules/.cache', { recursive: true });
await build({ entryPoints: ['src/lib/seo.ts'], outfile: 'node_modules/.cache/haviss-qa-routes.mjs', bundle: true, platform: 'node', format: 'esm', packages: 'external', define: {'import.meta.env': '{}'} });
const { publicRoutes } = await import(pathToFileURL(resolve('node_modules/.cache/haviss-qa-routes.mjs')).href);
const browser = await chromium.launch({ executablePath, headless: true });
const results = [];
const failures = [];
const notices = [];
const links = new Map();
const pageIds = new Map();
const assertion = (condition, detail) => { if (!condition) failures.push(detail); };
const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'tablet', width: 820, height: 1180 },
  { name: 'mobile', width: 390, height: 844 },
];
async function settle(page) {
  await page.locator('h1').first().waitFor({ timeout: 15000 });
  await page.evaluate(async () => {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => img.loading = 'eager');
    const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));
    await Promise.race([Promise.all(Array.from(document.images).map(img => img.decode().catch(() => {}))), timeout(3000)]);
    await Promise.race([document.fonts.ready, timeout(1500)]);
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
    const page = await context.newPage();
    let route = '/';
    page.on('pageerror', error => failures.push(`${viewport.name} ${route}: uncaught browser error: ${error.message}`));
    page.on('console', message => { if (message.type() === 'error') notices.push(`${viewport.name} ${route}: ${message.text()}`); });
    for (route of publicRoutes) {
      const response = await page.goto(new URL(route, base).href, { waitUntil: 'domcontentloaded', timeout: 20000 });
      assertion(response?.ok(), `${viewport.name} ${route}: HTTP ${response?.status()}`);
      await settle(page);
      const state = await page.evaluate(() => {
        const width = document.documentElement.clientWidth;
        return {
          h1: Array.from(document.querySelectorAll('h1')).map(el => el.textContent?.trim()),
          notFound: Boolean(document.querySelector('.not-found')),
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
          scrollWidth: document.documentElement.scrollWidth,
          width,
          brokenImages: Array.from(document.images).filter(img => !img.complete || img.naturalWidth === 0).map(img => img.currentSrc || img.src),
          missingAlt: Array.from(document.images).filter(img => !img.hasAttribute('alt')).map(img => img.src),
          links: Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href')),
          ids: Array.from(document.querySelectorAll('[id]')).map(el => el.id),
          overflowElements: Array.from(document.body.querySelectorAll('*')).filter(el => { const rect = el.getBoundingClientRect(); return rect.width > 0 && (rect.right > width + 2 || rect.left < -2); }).slice(0,8).map(el => `${el.tagName.toLowerCase()}.${String(el.className).replaceAll(' ','.')}`),
        };
      });
      assertion(state.h1.length === 1, `${viewport.name} ${route}: expected one H1, found ${state.h1.length}`);
      assertion(!state.h1.some(text => /page not found|lost your coordinate/i.test(text || '')), `${viewport.name} ${route}: route renders not-found content`);
      assertion(!state.notFound, `${viewport.name} ${route}: route renders the 404 component`);
      assertion(state.scrollWidth <= state.width + 1, `${viewport.name} ${route}: horizontal overflow (${state.scrollWidth}px > ${state.width}px): ${state.overflowElements.join(', ')}`);
      assertion(state.brokenImages.length === 0, `${viewport.name} ${route}: broken images: ${state.brokenImages.join(', ')}`);
      assertion(state.missingAlt.length === 0, `${viewport.name} ${route}: missing image alt attributes`);
      assertion(Boolean(state.title && state.description), `${viewport.name} ${route}: missing SEO title or description`);
      if (viewport.name === 'desktop') {
        links.set(route, state.links);
        pageIds.set(route, new Set(state.ids));
      }
      if (route.startsWith('/services/')) {
        const details = page.locator('.faq-list details').first();
        assertion(await details.count() > 0, `${viewport.name} ${route}: FAQ missing`);
        if (await details.count()) {
          await details.locator('summary').click();
          assertion(await details.evaluate(el => el.open), `${viewport.name} ${route}: FAQ did not open`);
          await details.locator('summary').click();
          assertion(!(await details.evaluate(el => el.open)), `${viewport.name} ${route}: FAQ did not close`);
        }
      }
      if (route === '/' && viewport.name !== 'desktop') {
        const toggle = page.getByRole('button', { name: 'Open navigation', exact: true });
        assertion(await toggle.isVisible(), `${viewport.name}: mobile navigation trigger is missing`);
        if (await toggle.isVisible()) {
          await toggle.click();
          assertion(await page.locator('.main-nav').isVisible(), `${viewport.name}: mobile navigation did not open`);
          await page.keyboard.press('Escape');
          assertion(await page.getByRole('button',{name:'Open navigation',exact:true}).getAttribute('aria-expanded') === 'false', `${viewport.name}: Escape did not close mobile navigation`);
        }
      }
      if (route === '/resources') {
        const filters = page.locator('.resource-filter button');
        const allCount = await page.locator('.resource-card').count();
        if (await filters.count() > 1) {
          await filters.nth(1).click();
          const filteredCount = await page.locator('.resource-card').count();
          assertion(filteredCount > 0 && filteredCount < allCount, `${viewport.name}: resource filter does not narrow results`);
          assertion(await filters.nth(1).getAttribute('aria-pressed') === 'true', `${viewport.name}: resource filter state is not accessible`);
          await filters.first().click();
          assertion(await page.locator('.resource-card').count() === allCount, `${viewport.name}: resource reset did not restore results`);
        }
      }
      const shouldCapture = route === '/' || (viewport.name === 'desktop' && ['/contact','/services','/products/used-cmm'].includes(route));
      if (shouldCapture) {
        await page.evaluate(() => window.scrollTo(0,0));
        const name = route === '/' ? 'home' : route.slice(1).replaceAll('/','-');
        await page.screenshot({ path: join(output, `${name}-${viewport.name}.png`), fullPage: true, animations: 'disabled' });
        if (route === '/') await page.screenshot({ path: join(output, `home-${viewport.name}-viewport.png`), animations: 'disabled' });
      }
      results.push({ viewport: viewport.name, route, h1: state.h1[0], width: state.width, scrollWidth: state.scrollWidth, imageCount: await page.locator('img').count() });
    }

    route = '/request-quote?service=CMM%20Retrofit&product=QA%20reference';
    await page.goto(new URL(route,base).href, { waitUntil: 'domcontentloaded' });
    await settle(page);
    const enquiryForm = page.locator('form.enquiry-form');
    if (await enquiryForm.count()) {
      assertion(await page.locator('select[name="service"]').inputValue() === 'CMM Retrofit', `${viewport.name}: quote service not preselected`);
      assertion(await page.locator('input[name="product"]').inputValue() === 'QA reference', `${viewport.name}: quote product not included`);
      assertion(await page.locator('.selected-product').textContent().then(text => text?.includes('QA reference')), `${viewport.name}: selected product not visible`);
      assertion(await page.locator('button[type="submit"]').isEnabled(), `${viewport.name}: email draft preparation should be available`);
      assertion(await page.locator('.form-notice').textContent().then(text => text?.includes('press Send')), `${viewport.name}: missing email draft guidance`);
      assertion(!(await enquiryForm.evaluate(form => form.checkValidity())), `${viewport.name}: empty required form unexpectedly valid`);
      await page.locator('input[name="full_name"]').fill('Test Buyer');
      await page.locator('input[name="company_name"]').fill('Test Company');
      await page.locator('input[name="email"]').fill('buyer@example.com');
      await page.locator('input[name="phone"]').fill('+91 98765 43210');
      await page.locator('input[name="city"]').fill('Chennai');
      await page.locator('textarea[name="requirement"]').fill('Please assess our coordinate measuring machine.');
      await page.locator('input[name="consent"]').check();
      await page.locator('button[type="submit"]').click();
      const mail = await page.locator('.email-draft a').getAttribute('href');
      assertion(mail?.startsWith('mailto:') && decodeURIComponent(mail).includes('QA reference'), `${viewport.name}: draft recipient or selected product is incorrect`);
      assertion(await page.locator('.email-draft').textContent().then(text => text?.includes('not been sent or saved')), `${viewport.name}: missing unsent draft explanation`);
      await page.locator('input[name="city"]').fill('Pune');
      assertion(await page.locator('.email-draft').count() === 0, `${viewport.name}: changed details left a stale draft`);
    } else {
      assertion(await page.locator('.enquiry-form a[href^="tel:"]').count() >= 1, `${viewport.name}: missing call fallback while recipient is unset`);
      assertion(await page.locator('a[href="mailto:"]').count() === 0, `${viewport.name}: an empty email address is linked`);
    }

    route = '/admin';
    await page.goto(new URL(route,base).href, { waitUntil: 'domcontentloaded' });
    await settle(page);
    assertion(await page.locator('h1').count() === 1, `${viewport.name}: admin expected one H1`);
    assertion(await page.locator('.admin-table,.admin-detail').count() === 0, `${viewport.name}: unconfigured admin exposes enquiry dashboard`);
    assertion((await page.getByText('Staff portal setup required').count()) === 1 || (await page.locator('.admin-login input[name="email"]').count()) === 1, `${viewport.name}: missing staff setup notice or login`);
    assertion((await page.locator('meta[name="robots"]').getAttribute('content'))?.includes('noindex'), `${viewport.name}: admin must be noindex`);
    await context.close();
    console.log(`Checked ${viewport.name}: ${publicRoutes.length} public routes and enquiry/admin behavior.`);
  }
  for (const [source, hrefs] of links) {
    for (const href of hrefs) {
      if (!href || /^(?:mailto:|tel:|https?:|data:)/i.test(href)) continue;
      const target = new URL(href, new URL(source,base));
      if (/\.[a-z0-9]+$/i.test(target.pathname)) continue; // Local assets and downloads are verified as assets, not app routes.
      const normalized = target.pathname.replace(/\/$/,'') || '/';
      assertion(publicRoutes.includes(normalized), `${source}: broken internal route ${href}`);
      if (target.hash && pageIds.has(normalized)) assertion(pageIds.get(normalized).has(decodeURIComponent(target.hash.slice(1))), `${source}: missing anchor target ${href}`);
    }
  }
} catch (error) {
  failures.push(`Browser QA interrupted: ${error.stack || error.message}`);
} finally {
  await browser.close();
}
const uniqueFailures = [...new Set(failures)];
const report = { checkedAt: new Date().toISOString(), base, browser: executablePath, routeCount: publicRoutes.length, routeViewportChecks: results.length, failures: uniqueFailures, consoleNotices: [...new Set(notices)], results };
await writeFile(join(output,'report.json'),JSON.stringify(report,null,2));
const status = uniqueFailures.length ? `FAILED — ${uniqueFailures.length} issue(s)` : 'PASSED';
const markdown = `# Browser QA\n\nStatus: **${status}**\n\nRun: ${report.checkedAt}\n\n- Local target: ${base}\n- Browser: Microsoft Edge (Chromium), headless through Playwright Core\n- Public routes: ${publicRoutes.length}; route/viewport checks completed: ${results.length}\n- Viewports: desktop 1440×1000, tablet 820×1180, mobile 390×844\n- Checks: HTTP responses, one H1 per page, horizontal overflow, loaded images, alt attributes, metadata, route links and anchor targets, service FAQ toggles, quote service/product context, native required validation, honest unconfigured submission state, private admin empty state and noindex.\n- Screenshots and machine-readable report: \`artifacts/browser-qa/\`\n\n${uniqueFailures.length ? `## Failures\n\n${uniqueFailures.map(value => `- ${value}`).join('\n')}\n\n` : ''}## Verification limits\n\nThese checks run against the local site with no backend credentials. They do not verify live Supabase authentication, SQL policies, persisted enquiries, file storage, Turnstile or email delivery. The supplied integration checklist must be executed after credentials and staff roles are configured. Browser screenshots are for visual review; no Lighthouse score is claimed.\n\nRun again with \`node scripts/browser-check.mjs\` while the development server is running. Optional environment overrides: \`QA_BASE_URL\` and \`QA_BROWSER_PATH\`.\n`;
await writeFile('docs/QA.md',markdown);
console.log(`${status}. Report: ${join(output,'report.json')}`);
if (uniqueFailures.length) { console.error(uniqueFailures.join('\n')); process.exitCode = 1; }
