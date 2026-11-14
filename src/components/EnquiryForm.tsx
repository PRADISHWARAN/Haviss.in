import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, Loader2, Mail, Paperclip } from 'lucide-react';
import { backendConfigured, services, submitEnquiry, turnstileSiteKey } from '../lib/supabase';
import { useSiteContent } from '../lib/content-context';
import './enquiry.css';
import './email-draft.css';

type Turnstile = { render: (element: HTMLElement, options: Record<string, unknown>) => string; remove: (id: string) => void; reset: (id: string) => void };
declare global { interface Window { turnstile?: Turnstile } }

export default function EnquiryForm({ service = '', product = '', compact = false }: { service?: string; product?: string; compact?: boolean }) {
  const { company } = useSiteContent();
  const online = backendConfigured && Boolean(turnstileSiteKey);
  const [selectedService, setSelectedService] = useState(service);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [draft, setDraft] = useState<{ body: string; href: string } | null>(null);
  const [fileName, setFileName] = useState('Attach a drawing or machine detail');
  const token = useRef('');
  const captcha = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const requestId = useRef(crypto.randomUUID());
  const started = useRef(Date.now());
  useEffect(() => setSelectedService(service), [service]);
  useEffect(() => {
    if (!online || !turnstileSiteKey || !captcha.current) return;
    let cancelled = false;
    const render = () => {
      if (cancelled || !captcha.current || !window.turnstile || widget.current) return;
      widget.current = window.turnstile.render(captcha.current, { sitekey: turnstileSiteKey, theme: 'light', callback: (value: string) => { token.current = value; }, 'expired-callback': () => { token.current = ''; }, 'error-callback': () => { token.current = ''; } });
    };
    let script = document.querySelector<HTMLScriptElement>('script[data-haviss-turnstile]');
    if (!script) { script = document.createElement('script'); script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; script.async = true; script.dataset.havissTurnstile = 'true'; document.head.appendChild(script); }
    script.addEventListener('load', render); render();
    return () => { cancelled = true; script?.removeEventListener('load', render); if (widget.current) { window.turnstile?.remove(widget.current); widget.current = null; } };
  }, [online]);
  if (!online && !company.email) {
    return <div className="enquiry-form"><div className="enquiry-form-heading"><span className="eyebrow">TALK TO OUR TEAM</span><h2>Let’s discuss your requirement.</h2><p>Tell us about your machine, component or training needs.</p></div><div className="form-notice">For enquiries, please call <a href={company.phoneHref}>{company.phone}</a>.</div><a className="button button-primary" href={company.phoneHref}>Call Haviss <ArrowUpRight size={19}/></a></div>;
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setSuccess(''); setDraft(null);
    const element = event.currentTarget;
    const data = new FormData(element);
    const phone = String(data.get('phone') || '');
    if (!/^[+0-9()\s-]+$/.test(phone) || phone.replace(/\D/g, '').length < 7) { setError('Please enter a valid phone number including your country or area code.'); return; }
    if (!online) {
      const value = (key: string) => String(data.get(key) || '').trim();
      const subject = `Haviss enquiry: ${value('service')}`;
      const body = `Hello Haviss,\n\nI would like to discuss the following requirement.\n\nName: ${value('full_name')}\nCompany: ${value('company_name')}\nEmail: ${value('email')}\nPhone: ${phone}\nCity / location: ${value('city')}\nService: ${value('service')}\n${value('product') ? `Product: ${value('product')}\n` : ''}${value('manufacturer') ? `Machine manufacturer: ${value('manufacturer')}\n` : ''}${value('model') ? `Machine model: ${value('model')}\n` : ''}\nRequirement:\n${value('requirement')}\n\nThank you.`;
      const recipient = encodeURIComponent(company.email).replace('%40', '@');
      setDraft({body, href: `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`});
      return;
    }
    const file = data.get('attachment');
    if (file instanceof File && file.size && (file.size > 5 * 1024 * 1024 || !['application/pdf', 'image/jpeg', 'image/png'].includes(file.type))) { setError('Please attach a PDF, JPG or PNG file no larger than 5 MB.'); return; }
    if (turnstileSiteKey && !token.current) { setError('Please complete the security check before sending.'); return; }
    data.set('turnstile_token', token.current); data.set('request_id', requestId.current); data.set('started_at', String(started.current));
    setBusy(true);
    try {
      const result = await submitEnquiry(data);
      setSuccess(`Your enquiry has been received. Reference: ${result.id.slice(0, 8).toUpperCase()}. Our team will review your requirement.`);
      element.reset(); setSelectedService(service); setFileName('Attach a drawing or machine detail'); requestId.current = crypto.randomUUID(); started.current = Date.now();
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to send your enquiry. Please contact our team.'); }
    finally { setBusy(false); token.current = ''; if (widget.current) window.turnstile?.reset(widget.current); }
  }
  return <form className={`enquiry-form ${compact ? 'enquiry-compact' : ''}`} onSubmit={submit} onChange={() => { if (draft) setDraft(null); }}>
    <div className="enquiry-form-heading"><span className="eyebrow">TELL US WHAT YOU NEED</span><h2>Let’s get the details right.</h2><p>Share your machine, component or training requirement. We’ll help you identify the next step.</p></div>
    {!online && <div className="form-notice"><strong>Send your enquiry by email.</strong> Fill in the details below, then prepare an email draft. Your email app must be set up, and you must press Send in that app. You can also contact us at <a href={`mailto:${company.email}`}>{company.email}</a> or <a href={company.phoneHref}>{company.phone}</a>.</div>}
    {product && <div className="selected-product">Product enquiry: <strong>{product}</strong></div>}
    <input name="product" type="hidden" value={product} />
    <div className="form-grid">
      <label className="field">Full name <span>*</span><input name="full_name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Your name" /></label>
      <label className="field">Company name <span>*</span><input name="company_name" autoComplete="organization" required minLength={2} maxLength={150} placeholder="Company / institution" /></label>
      <label className="field">Business email <span>*</span><input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@company.com" /></label>
      <label className="field">Phone number <span>*</span><input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={25} placeholder="+91" /></label>
      <label className="field">City / location <span>*</span><input name="city" autoComplete="address-level2" required minLength={2} maxLength={100} placeholder="Your city" /></label>
      <label className="field">Service required <span>*</span><select name="service" required value={selectedService} onChange={event => setSelectedService(event.target.value)}><option value="">Select a service</option>{services.map(item => <option key={item}>{item}</option>)}</select></label>
      <label className="field">Machine manufacturer <small>Optional</small><input name="manufacturer" maxLength={100} placeholder="e.g. machine make" /></label>
      <label className="field">Machine model <small>Optional</small><input name="model" maxLength={100} placeholder="Model, if known" /></label>
      <label className="field field-full">Requirement description <span>*</span><textarea name="requirement" required minLength={20} maxLength={5000} rows={5} placeholder="Tell us about your equipment, inspection challenge or training needs (at least 20 characters)." /></label>
    </div>
    <div className="form-honey" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    {online ? <label className="attachment-field"><Paperclip size={20} /><span>{fileName}<small>Optional · PDF, JPG or PNG · Maximum 5 MB</small></span><input name="attachment" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={event => setFileName(event.target.files?.[0]?.name || 'Attach a drawing or machine detail')} /></label> : <p className="form-footnote"><Paperclip size={16} /> To include a drawing or machine detail, attach it in your email app after opening the draft.</p>}
    <label className="consent-field"><input type="checkbox" name="consent" required value="true" /><span>I agree to Haviss using these details to respond to my enquiry, as described in the <Link to="/privacy">Privacy Policy</Link>. <span aria-hidden="true">*</span></span></label>
    {online && <div ref={captcha} className="captcha-container" />}
    {error && <div role="alert" className="form-status form-error">{error}</div>}
    {success && <div role="status" className="form-status form-success"><CheckCircle2 size={20} />{success}</div>}
    <button type="submit" className="button button-primary" disabled={busy}>{busy ? <><Loader2 className="spin" size={18} />Sending enquiry…</> : <>{online ? 'Send Your Enquiry' : 'Prepare Email Enquiry'} <ArrowUpRight size={19} /></>}</button>
    {draft && <div className="email-draft" role="status"><h3>Your email draft is ready</h3><p>Open it in your email app, attach any files, then press Send. The enquiry has not been sent or saved by this website.</p><a className="button button-primary" href={draft.href}><Mail size={18}/>Open Email App <ArrowUpRight size={18}/></a><label className="field">If no email app opens, copy this text and email it to {company.email}<textarea readOnly rows={8} value={draft.body} onFocus={event=>event.currentTarget.select()}/></label></div>}
    <p className="form-footnote">Please share only information needed to assess your requirement. Avoid including confidential drawings without prior agreement.</p>
  </form>;
}
