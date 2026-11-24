import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const backendConfigured = Boolean(url && key);
export const supabase = backendConfigured ? createClient(url!, key!, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } }) : null;
export const turnstileSiteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY || '') as string;
export const services = ['CMM Retrofit', 'CMM Software Upgrade', 'CMM Repair', 'CMM Calibration', 'CMM AMC', 'CMM Relocation', 'CMM Inspection', 'CMM Training', 'Used CMM Purchase', 'Used CMM Sale', 'Modular Fixtures', 'CMM Accessories & Spares', 'Other Enquiry'];
// Values accepted by the currently deployed submit-enquiry function. Newer options are sent as
// 'Other Enquiry' with the chosen service written into the requirement until the function is redeployed.
const deployedServices = ['CMM Retrofit','CMM Calibration','CMM Repair','CMM Software Upgrade','CMM Inspection','CMM AMC','Used CMM Purchase','CMM Training','Modular Fixtures','Other Enquiry'];
export type Product = { id: string; slug: string; name: string; manufacturer: string; model: string; machine_type: string; specifications: Record<string, string>; condition: string; availability: string; description: string; image_url: string; category: string; published: boolean };
export type Enquiry = { id: string; created_at: string; full_name: string; company_name: string; email: string; phone: string; city: string; service: string; manufacturer: string; model: string; requirement: string; product: string; attachment_path: string | null; status: string; notification_status: string };
export async function loadPublishedContent(): Promise<Record<string, unknown>> {
  if (!supabase) return {};
  const { data, error } = await supabase.from('site_content').select('key,value').eq('published', true);
  if (error) throw error;
  return Object.fromEntries((data || []).map(item => [item.key, item.value]));
}
export async function loadProducts(): Promise<Product[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from('products').select('*').eq('published', true).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}
export async function submitEnquiry(form: FormData) {
  if (!supabase) throw new Error('Online enquiries are not connected yet. Please call the Haviss team.');
  const chosen = String(form.get('service') || '');
  if (chosen && !deployedServices.includes(chosen)) { form.set('service', 'Other Enquiry'); form.set('requirement', `Service requested: ${chosen}\n\n${form.get('requirement') || ''}`.slice(0, 5000)); }
  const response = await fetch(`${url}/functions/v1/submit-enquiry`, { method: 'POST', headers: { apikey: key! }, body: form });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Your enquiry could not be sent. Please try again or contact our team.');
  return result as { id: string; notification: string };
}
