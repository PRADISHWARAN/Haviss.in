import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { SiteContentProvider } from './lib/content-context';
import './fonts.css';
import './styles.css';
import './mobile.css';
import './haviss.css';

const app = <React.StrictMode><BrowserRouter><SiteContentProvider><App /></SiteContentProvider></BrowserRouter></React.StrictMode>;
ReactDOM.createRoot(document.getElementById('root')!).render(app);
