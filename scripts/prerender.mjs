import {build} from 'esbuild';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {resolve,join} from 'node:path';
import {loadEnv} from 'vite';
// Only values rendered into public markup are needed by the server renderer.
const viteEnv=loadEnv('production',process.cwd(),'VITE_');
const renderEnv={VITE_CONTACT_EMAIL:viteEnv.VITE_CONTACT_EMAIL||'',VITE_SITE_URL:viteEnv.VITE_SITE_URL||'',VITE_ENABLE_WHATSAPP:viteEnv.VITE_ENABLE_WHATSAPP||''};
await build({entryPoints:['src/entry-server.tsx'],bundle:true,platform:'node',format:'esm',outfile:'node_modules/.cache/haviss-prerender.mjs',packages:'external',loader:{'.css':'empty'},jsx:'automatic',define:{'import.meta.env':JSON.stringify(renderEnv)}});
const {render,publicRoutes,getSeo,resolveSiteOrigin}=await import(pathToFileURL(resolve('node_modules/.cache/haviss-prerender.mjs')).href);
const template=await readFile('dist/index.html','utf8');
const escape=value=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
// Vite loads .env, .env.local and .env.production for a production build.
// Use the same public setting for generated HTML and the browser bundle.
const origin=resolveSiteOrigin(process.env.VITE_SITE_URL||viteEnv.VITE_SITE_URL);
// Optional Search Console / Bing Webmaster verification codes (public values).
const verification=process.env.VITE_GOOGLE_SITE_VERIFICATION||viteEnv.VITE_GOOGLE_SITE_VERIFICATION||'';
const bingVerification=process.env.VITE_BING_SITE_VERIFICATION||viteEnv.VITE_BING_SITE_VERIFICATION||'';
const today=new Date().toISOString().slice(0,10);
const priority=route=>route==='/'?'1.0':route==='/cmm-services-chennai'||/^\/services\/|^\/products\/modular-fixtures|^\/products\/used-cmm/.test(route)?'0.9':/^\/cmm-brands/.test(route)?'0.8':/privacy|image-credits/.test(route)?'0.3':'0.7';
// Static Sites currently does not apply _headers; a meta CSP protects the built pages.
// Some headers (including X-Frame-Options and X-Content-Type-Options) cannot be expressed here.
const csp="default-src 'self'; script-src 'self' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: blob: https://*.supabase.co; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'; form-action 'self'";
for(const route of [...publicRoutes,'/admin','/404']){
 const seo=getSeo(route,origin);
 const content=route==='/admin'?'<main class="container section"><h1>Staff administration</h1><p>Loading secure staff access…</p></main>':render(route);
 let html=template.replace('<div id="root"></div>',`<div id="root">${content}</div>`).replace(/<title>.*?<\/title>/,`<title>${escape(seo.title)}</title>`).replace(/<meta name="description" content="[^"]*"\s*\/>/,`<meta name="description" content="${escape(seo.description)}"/>`).replace(/<link rel="canonical" href="[^"]*"\s*\/>/,`<link rel="canonical" href="${escape(seo.canonical)}"/>`).replace(/<meta property="og:title" content="[^"]*"\s*\/>/,`<meta property="og:title" content="${escape(seo.title)}"/>`).replace(/<meta property="og:description" content="[^"]*"\s*\/>/,`<meta property="og:description" content="${escape(seo.description)}"/>`).replace(/<meta property="og:url" content="[^"]*"\s*\/>/,`<meta property="og:url" content="${escape(seo.canonical)}"/>`).replace(/<meta property="og:image" content="[^"]*"\s*\/>/,`<meta property="og:image" content="${escape(seo.image)}"/>`).replace(/<meta name="twitter:title" content="[^"]*"\s*\/>/,`<meta name="twitter:title" content="${escape(seo.title)}"/>`).replace(/<meta name="twitter:description" content="[^"]*"\s*\/>/,`<meta name="twitter:description" content="${escape(seo.description)}"/>`).replace(/<meta name="twitter:image" content="[^"]*"\s*\/>/,`<meta name="twitter:image" content="${escape(seo.image)}"/>`).replace('</head>',`<meta http-equiv="Content-Security-Policy" content="${escape(csp)}"/><meta name="robots" content="${seo.noindex?'noindex, nofollow':'index, follow, max-image-preview:large'}"/>${verification&&route==='/'?`<meta name="google-site-verification" content="${escape(verification)}"/>`:''}${bingVerification&&route==='/'?`<meta name="msvalidate.01" content="${escape(bingVerification)}"/>`:''}<script id="structured-data" type="application/ld+json">${JSON.stringify(seo.jsonLd).replace(/</g,'\\u003c')}</script></head>`);
 const dir=route==='/'?'dist':join('dist',route.slice(1));await mkdir(dir,{recursive:true});await writeFile(join(dir,'index.html'),html);
 if(route==='/404')await writeFile('dist/404.html',html);
}
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicRoutes.map(route=>`<url><loc>${origin}${route==='/'?'/':route}</loc><lastmod>${today}</lastmod><priority>${priority(route)}</priority></url>`).join('')}</urlset>`);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /products?item=\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`Prerendered ${publicRoutes.length} public routes, staff shell, 404, sitemap and structured data.`);
