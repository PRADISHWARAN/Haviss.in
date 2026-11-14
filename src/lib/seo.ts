import { company, services, resources, type Product } from '../data/content';
import {DEFAULT_SITE_ORIGIN, resolveSiteOrigin} from './site-origin';
export const publicRoutes = ['/', '/about', '/services', ...services.map(s=>`/services/${s.slug}`), '/products', '/products/used-cmm', '/products/modular-fixtures', '/products/accessories', '/products/consultation', '/training', '/industries', '/resources', ...resources.map(r=>`/resources/${r.slug}`), '/contact', '/request-quote', '/privacy', '/image-credits'];
const metadata:Record<string,[string,string]>={
 '/':['CMM & 3D Metrology Solutions, Chennai','Complete CMM lifecycle support in Chennai. Explore Haviss CMM retrofits, calibration, repair, inspection, used equipment and operator training.'],
 '/about':['About Haviss | Coordinate Metrology Since 2014','Meet Haviss 3D Metrology Solutions, founded in 2014 in Chennai. Practical engineering expertise across CMM maintenance, modernization and measurement.'],
 '/services':['CMM Services Chennai | Calibration, Retrofit & Repair','Explore CMM servicing, retrofit, calibration, software upgrades, dimensional inspection and annual maintenance support from Haviss in Chennai.'],
 '/products':['CMM Machines, Fixtures & Accessories India','Discuss used CMM machines, modular fixturing and compatible measurement accessories with Haviss. Contact our team for current equipment availability.'],
 '/products/used-cmm':['Used CMM Machines India | Availability Enquiries','Find a suitable used coordinate measuring machine with Haviss. Discuss equipment requirements, machine condition and current availability.'],
 '/products/modular-fixtures':['Modular CMM Fixtures | Measurement Setups','Explore modular CMM fixturing for repeatable part positioning. Discuss fixture compatibility and application requirements with Haviss.'],
 '/products/accessories':['CMM Accessories | Probes, Styli & Compatibility','Discuss probe heads, styli and measurement accessories with Haviss. Compatibility and availability are confirmed for your machine and application.'],
 '/products/consultation':['CMM Equipment Selection Consultation','Plan a CMM equipment decision around component geometry, measurement volume, probing and practical inspection requirements.'],
 '/training':['CMM Training Chennai | Operator Learning','CMM operator training from Haviss. Learn coordinate systems, probe calibration, part alignment, GD&T, dimensional inspection and reporting.'],
 '/industries':['Dimensional Metrology Applications | Industries','Explore coordinate metrology applications in automotive, aerospace, precision manufacturing, tooling, medical components and engineering education.'],
 '/resources':['CMM Knowledge Centre | Practical Metrology Guides','Read practical guidance on preparing for CMM service, planning inspection and assessing retrofit or equipment requirements.'],
 '/contact':['Contact Haviss | CMM Services Chennai','Contact Haviss 3D Metrology Solutions in Chennai. Call +91 99624 74959 to discuss your measurement requirements.'],
 '/request-quote':['Request a CMM Service Quote | Haviss Chennai','Tell Haviss about your CMM service, equipment, inspection or training requirements. Include machine details and supporting drawings for a useful discussion.'],
 '/privacy':['Privacy Policy','How Haviss handles enquiry details, drawings and staff accounts. Contact our team about your personal information.'],
 '/image-credits':['Photography & Image Credits','Sources, authors and licences for the illustrative CMM photographs used on the Haviss website.'],
 '/admin':['Staff Administration','Restricted workspace for authorized Haviss staff.']
};
export function getSeo(pathname:string, requestedOrigin=DEFAULT_SITE_ORIGIN, product?: Product, queryItem?: string) {
 const origin=resolveSiteOrigin(requestedOrigin);
 const path=pathname.replace(/\/$/,'')||'/';
 const service=services.find(s=>path===`/services/${s.slug}`);
 const resource=resources.find(r=>path===`/resources/${r.slug}`);
 const isProductQuery=path==='/products' && queryItem!==undefined;
 const verifiedProduct=product?.published && (path===`/products/equipment/${product.slug}`||(isProductQuery && product.slug===queryItem)) ? product : undefined;
 const [title,description]=verifiedProduct?[`${verifiedProduct.name} | CMM Equipment`,verifiedProduct.description.trim().slice(0,160)||`Enquire about ${verifiedProduct.name} from Haviss.`]:isProductQuery?['Equipment Enquiry','Contact Haviss to confirm current equipment details and availability.']:service?[`${service.title} Chennai | CMM Services`,service.summary]:resource?[resource.title,resource.summary]:metadata[path]||['Page Not Found','The page you are looking for could not be found. Explore Haviss CMM services and equipment.'];
 const canonical=origin.replace(/\/$/,'')+(path==='/'?'/':path);
 // Product query links are reloadable on static hosting, but require server support
 // before they can safely claim unique crawlable URLs and indexed metadata.
 const noindex=path==='/admin'||isProductQuery||!publicRoutes.includes(path);
 const organization={ '@type':['Organization','LocalBusiness'], '@id':`${origin}/#organization`,name:company.name,url:origin,telephone:company.phone,...(company.email?{email:company.email}:{}),foundingDate:'2014',description:'Complete solutions for coordinate measuring machines.',address:{'@type':'PostalAddress',streetAddress:'#1A, 1st Floor, IJ Puram, Manali New Town, Ponneri High Road',addressLocality:'Chennai',addressRegion:'Tamil Nadu',postalCode:'600103',addressCountry:'IN'}};
 const graph:object[]=[organization];
 if(path!=='/')graph.push({'@type':'BreadcrumbList',itemListElement:verifiedProduct&&!isProductQuery?[{'@type':'ListItem',position:1,name:'Home',item:origin},{'@type':'ListItem',position:2,name:'Products',item:`${origin}/products`},{'@type':'ListItem',position:3,name:verifiedProduct.name,item:canonical}]:[{'@type':'ListItem',position:1,name:'Home',item:origin},{'@type':'ListItem',position:2,name:isProductQuery?'Products':service?.title||resource?.title||title.split('|')[0].trim(),item:canonical}]});
 if(service)graph.push({'@type':'Service',name:service.title,serviceType:service.title,description:service.summary,url:canonical,provider:{'@id':`${origin}/#organization`},areaServed:{'@type':'City',name:'Chennai'}});
 if(verifiedProduct&&!isProductQuery)graph.push({'@type':'Product',name:verifiedProduct.name,description,url:canonical,...(verifiedProduct.manufacturer?{manufacturer:{'@type':'Organization',name:verifiedProduct.manufacturer}}:{}),...(verifiedProduct.image_url?{image:verifiedProduct.image_url}:{})});
 const image=verifiedProduct?.image_url||`${origin}/images/cmm-hero.webp`;
 return {title:`${title} | HAVISS`,description,canonical,image,noindex,jsonLd:{'@context':'https://schema.org','@graph':graph}};
}
