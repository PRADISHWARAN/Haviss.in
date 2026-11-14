import {build} from 'esbuild';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {resolve,join} from 'node:path';
await build({entryPoints:['src/entry-server.tsx'],bundle:true,platform:'node',format:'esm',outfile:'node_modules/.cache/haviss-prerender.mjs',packages:'external',loader:{'.css':'empty'},jsx:'automatic',define:{'import.meta.env':'{}'}});
const {render,publicRoutes,getSeo}=await import(pathToFileURL(resolve('node_modules/.cache/haviss-prerender.mjs')).href);
const template=await readFile('dist/index.html','utf8');
const escape=value=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const origin=process.env.VITE_SITE_URL||'https://www.haviss.com';
for(const route of [...publicRoutes,'/404']){
 const seo=getSeo(route,origin);
 let html=template.replace('<div id="root"></div>',`<div id="root">${render(route)}</div>`).replace(/<title>.*?<\/title>/,`<title>${escape(seo.title)}</title>`).replace(/<meta name="description" content="[^"]*"\s*\/>/,`<meta name="description" content="${escape(seo.description)}"/>`).replace(/<link rel="canonical" href="[^"]*"\s*\/>/,`<link rel="canonical" href="${escape(seo.canonical)}"/>`).replace(/<meta property="og:title" content="[^"]*"\s*\/>/,`<meta property="og:title" content="${escape(seo.title)}"/>`).replace(/<meta property="og:description" content="[^"]*"\s*\/>/,`<meta property="og:description" content="${escape(seo.description)}"/>`).replace(/<meta property="og:url" content="[^"]*"\s*\/>/,`<meta property="og:url" content="${escape(seo.canonical)}"/>`).replace('</head>',`<meta name="robots" content="${seo.noindex?'noindex, nofollow':'index, follow'}"/><script id="structured-data" type="application/ld+json">${JSON.stringify(seo.jsonLd).replace(/</g,'\\u003c')}</script></head>`);
 const dir=route==='/'?'dist':join('dist',route.slice(1));await mkdir(dir,{recursive:true});await writeFile(join(dir,'index.html'),html);
 if(route==='/404')await writeFile('dist/404.html',html);
}
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicRoutes.map(route=>`<url><loc>${origin}${route==='/'?'/':route}</loc></url>`).join('')}</urlset>`);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`Prerendered ${publicRoutes.length} public routes, 404, sitemap and structured data.`);
