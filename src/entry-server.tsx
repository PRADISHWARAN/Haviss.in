import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import App from './App';
import { SiteContentProvider } from './lib/content-context';
export {getSeo,publicRoutes} from './lib/seo';
export {resolveSiteOrigin} from './lib/site-origin';
export function render(path:string){return renderToString(<StaticRouter location={path}><SiteContentProvider><App/></SiteContentProvider></StaticRouter>)}
