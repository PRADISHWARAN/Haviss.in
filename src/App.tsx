import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { Header, Footer } from './components/Layout';
import Home from './pages/Home';
import {About,Services,ServiceDetail,Products,ProductCategory,ProductDetail,Training,Industries,Resources,ResourceDetail,Contact,RequestQuote,Privacy,NotFound} from './pages/InnerPages';
import {getSeo} from './lib/seo';
import {imageCredits} from './data/image-credits';
import {useSiteContent} from './lib/content-context';
const Admin=lazy(()=>import('./pages/Admin'));

function PageEffects(){
 const {pathname,hash,search}=useLocation();
 const {products}=useSiteContent();
 const query=new URLSearchParams(search);
 const queryItem=pathname.replace(/\/$/,'')==='/products'&&query.has('item') ? query.get('item')||'' : undefined;
 const product=products.find(item=>(pathname.replace(/\/$/,'')===`/products/equipment/${item.slug}`||queryItem===item.slug) && item.published);
 useEffect(()=>{
   const seo=getSeo(pathname,import.meta.env.VITE_SITE_URL,product,queryItem);
   document.title=seo.title;
   const set=(selector:string,attribute:string,value:string)=>{let node=document.head.querySelector(selector) as HTMLMetaElement|null;if(!node){node=document.createElement('meta');const name=selector.match(/\[(?:name|property)="([^"]+)"\]/);if(name)node.setAttribute(selector.includes('property=')?'property':'name',name[1]);document.head.appendChild(node);}node.setAttribute(attribute,value)};
   set('meta[name="description"]','content',seo.description);set('meta[property="og:title"]','content',seo.title);set('meta[property="og:description"]','content',seo.description);set('meta[property="og:url"]','content',seo.canonical);set('meta[property="og:image"]','content',seo.image);set('meta[name="robots"]','content',seo.noindex?'noindex, nofollow':'index, follow');
   document.querySelector('link[rel="canonical"]')?.setAttribute('href',seo.canonical);
   let script=document.getElementById('structured-data');if(!script){script=document.createElement('script');script.id='structured-data';script.setAttribute('type','application/ld+json');document.head.appendChild(script)}script.textContent=JSON.stringify(seo.jsonLd);
 },[pathname,product,queryItem]);
 useEffect(()=>{
   if(hash){const timer=setTimeout(()=>document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView(),100);return()=>clearTimeout(timer)}window.scrollTo(0,0);
 },[pathname,hash,search]);
 return null;
}
function ImageCredits(){return <><section className="page-hero"><div className="container"><div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span>Image credits</span></div><span className="eyebrow">PHOTOGRAPHY & ATTRIBUTION</span><h1>Real metrology.<br/>Clearly credited.</h1><p>Photographs illustrate coordinate metrology. They do not represent Haviss-owned equipment, facilities, inventory or employees, and do not imply manufacturer endorsement.</p></div></section><section className="section image-credits"><div className="container prose">{imageCredits.map(c=><article key={c.file}><h2>{c.title}</h2><p>By {c.author}. {c.source&&<><a href={c.source} target="_blank" rel="noreferrer">View original source</a>. </>}{c.licenseUrl?<a href={c.licenseUrl} target="_blank" rel="noreferrer">{c.license}</a>:c.license}.</p><p>{c.changes} Reused CC BY-SA images remain available under their respective licences. <a href={c.file}>View image</a>.</p></article>)}</div></section></>}
export default function App(){const {pathname}=useLocation();return <><PageEffects/>{pathname!=='/admin'&&<Header/>}<main id="main" tabIndex={-1}><Suspense fallback={<div className="container section" role="status">Loading workspace…</div>}><Routes><Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/services" element={<Services/>}/><Route path="/services/:slug" element={<ServiceDetail/>}/><Route path="/products" element={<Products/>}/><Route path="/products/equipment/:slug" element={<ProductDetail/>}/><Route path="/products/:slug" element={<ProductCategory/>}/><Route path="/training" element={<Training/>}/><Route path="/industries" element={<Industries/>}/><Route path="/resources" element={<Resources/>}/><Route path="/resources/:slug" element={<ResourceDetail/>}/><Route path="/contact" element={<Contact/>}/><Route path="/request-quote" element={<RequestQuote/>}/><Route path="/privacy" element={<Privacy/>}/><Route path="/image-credits" element={<ImageCredits/>}/><Route path="/admin" element={<Admin/>}/><Route path="*" element={<NotFound/>}/></Routes></Suspense></main>{pathname!=='/admin'&&<Footer/>}</>}
