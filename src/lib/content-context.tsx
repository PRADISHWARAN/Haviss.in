import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { company as defaultCompany, services as defaultServices, trainingTopics as defaultTrainingTopics, products as defaultProducts, type Product } from '../data/content';
import { backendConfigured, loadProducts, loadPublishedContent } from './supabase';

type SiteContent = {
  company: typeof defaultCompany;
  services: typeof defaultServices;
  trainingTopics: string[];
  trainingDescription: string;
  products: Product[];
  loading: boolean;
  error: string | null;
};
const defaults: SiteContent = {
  company: defaultCompany, services: defaultServices, trainingTopics: defaultTrainingTopics,
  trainingDescription: 'Machined parts are becoming increasingly complex, with more measurement features and tighter tolerances. Higher productivity with high standards of precision demands high inspection throughput. CMMs have replaced traditional inspection with gauges and fixtures, drastically reducing inspection time and manpower — the most dramatic advantage of the CMM is its efficiency compared with surface-plate and hand-tool techniques. Haviss provides complete training for CMM users in the topics below.',
  products: defaultProducts, loading: backendConfigured, error: null,
};
const SiteContentContext = createContext<SiteContent>(defaults);
const safeText = (value: unknown, fallback: string) => typeof value === 'string' && value.trim() ? value : fallback;

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaults);
  useEffect(() => {
    if (!backendConfigured) return;
    let active = true;
    Promise.allSettled([loadPublishedContent(), loadProducts()]).then(([publishedResult, productsResult]) => {
      if (!active) return;
      const published = publishedResult.status === 'fulfilled' ? publishedResult.value : {};
      const companyOverride = published.company && typeof published.company === 'object' ? published.company as Record<string, unknown> : {};
      const company = { ...defaultCompany };
      for (const key of Object.keys(defaultCompany) as (keyof typeof defaultCompany)[]) {
        if (key !== 'founded' && typeof companyOverride[key] === 'string') {
          (company as unknown as Record<string, unknown>)[key] = safeText(companyOverride[key], String(defaultCompany[key]));
        }
      }
      company.phoneHref = `tel:${company.phone.replace(/[^+\d]/g, '')}`;
      company.mapsOffice = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.registeredOffice)}`;
      company.mapsWorks = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.works)}`;
      const services = defaultServices.map(service => {
        const override = published[`service:${service.slug}`] as { description?: unknown; overview?: unknown; summary?: unknown } | undefined;
        return { ...service, overview: safeText(override?.overview, safeText(override?.description, service.overview)), summary: safeText(override?.summary, service.summary) };
      });
      const training = published.training as { description?: unknown; topics?: unknown } | undefined;
      const trainingTopics = Array.isArray(training?.topics) && training.topics.every(topic => typeof topic === 'string') ? training.topics as string[] : defaultTrainingTopics;
      setContent({
        company, services, trainingTopics,
        trainingDescription: safeText(training?.description, defaults.trainingDescription),
        products: productsResult.status === 'fulfilled' ? productsResult.value as Product[] : [],
        loading: false,
        error: productsResult.status === 'rejected' ? 'Current equipment listings could not be loaded. Please contact Haviss to confirm availability.' : null,
      });
    });
    return () => { active = false; };
  }, []);
  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
}
export function useSiteContent() { return useContext(SiteContentContext); }
