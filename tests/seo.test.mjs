import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';

const output=await build({entryPoints:['src/lib/seo.ts'],bundle:true,platform:'node',format:'esm',write:false,define:{'import.meta.env':'{}'}});
const {getSeo,publicRoutes}=await import(`data:text/javascript;base64,${Buffer.from(output.outputFiles[0].contents).toString('base64')}`);
const product={id:'test',slug:'example-cmm',name:'Example CMM',manufacturer:'Example manufacturer',model:'Example',machine_type:'Bridge',specifications:{},condition:'Verified used',availability:'Contact us',image_url:'',description:'Verified example description.',category:'used-cmm',published:true};

test('staff and unknown pages are excluded from indexing and sitemap',()=>{
 assert.equal(getSeo('/admin').noindex,true);
 assert.equal(publicRoutes.includes('/admin'),false);
 assert.equal(getSeo('/nonexistent').noindex,true);
});
test('organization schema omits contact email until explicitly configured',()=>{
 const organization=getSeo('/').jsonLd['@graph'].find(item=>Array.isArray(item['@type'])&&item['@type'].includes('Organization'));
 assert.equal(Object.hasOwn(organization,'email'),false);
 assert.doesNotMatch(getSeo('/contact').description,/sathish@haviss\.com/i);
});
test('default and configured canonical origins follow the deployed site',()=>{
 assert.equal(getSeo('/').canonical,'https://haviss-metrology.woodsydog32768.chatgpt.site/');
 const seo=getSeo('/about','https://www.haviss.com/');
 assert.equal(seo.canonical,'https://www.haviss.com/about');
 assert.equal(seo.image,'https://www.haviss.com/images/cmm-hero.webp');
 assert.equal(getSeo('/about','not a url').canonical,'https://haviss-metrology.woodsydog32768.chatgpt.site/about');
});
test('only a matching published product receives its metadata',()=>{
 const seo=getSeo('/products/equipment/example-cmm','https://www.haviss.com',product);
 assert.equal(seo.noindex,true);
 assert.match(seo.title,/Example CMM/);
 assert.equal(seo.description,'Verified example description.');
 assert.equal(seo.jsonLd['@graph'].some(item=>item['@type']==='Product' && item.name===product.name),true);
 assert.equal(getSeo('/products/equipment/example-cmm',undefined,{...product,published:false}).noindex,true);
 assert.equal(getSeo('/products/equipment/another',undefined,product).noindex,true);
});
test('static-host product query has useful metadata but stays noindex and canonicalizes to category',()=>{
 const seo=getSeo('/products',undefined,product,'example-cmm');
 assert.equal(seo.noindex,true);
 assert.equal(seo.canonical,'https://haviss-metrology.woodsydog32768.chatgpt.site/products');
 assert.match(seo.title,/Example CMM/);
 assert.equal(getSeo('/products',undefined,undefined,'missing').noindex,true);
 assert.equal(getSeo('/products').noindex,false);
});
