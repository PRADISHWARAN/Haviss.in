import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { ArrowLeft, Check, Download, Loader2, LockKeyhole, LogOut, Plus, RefreshCw, Save, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { company, services as serviceContent, trainingTopics } from '../data/content';
import { backendConfigured, services, supabase, type Enquiry, type Product } from '../lib/supabase';
import '../components/enquiry.css';
import './admin.css';

type Role = 'admin' | 'editor' | 'viewer';
type Tab = 'enquiries' | 'products' | 'content';
const emptyProduct: Omit<Product, 'id'> = { slug:'', name:'', manufacturer:'', model:'', machine_type:'', specifications:{}, condition:'', availability:'Contact us for current availability', description:'', image_url:'', category:'used-cmm', published:false };
const statusOptions = ['new','contacted','quoted','closed'];
const errorMessage = (error: unknown) => error instanceof Error ? error.message : (error as {message?:string})?.message || 'Something went wrong. Please try again.';

export default function Admin() {
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('enquiries');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [undeliveredCount, setUndeliveredCount] = useState<number | null>(null);
  const [deliveryCheckFailed, setDeliveryCheckFailed] = useState(false);
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | Omit<Product,'id'> | null>(null);
  const [filterService, setFilterService] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(0);
  const [contentKey, setContentKey] = useState('company');
  const [content, setContent] = useState<Record<string, Record<string, unknown>>>({});
  const [contentVersion, setContentVersion] = useState(0);
  const canEdit = role === 'admin' || role === 'editor';
  const feedback = useCallback((text: string) => { setMessage(text); setError(''); }, []);
  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    let active = true;
    let identityVersion = 0;
    let currentUserId: string | undefined;
    async function identify(version: number, id?: string, email?: string) {
      if (!active || version !== identityVersion) return;
      const identityChanged = currentUserId !== id;
      currentUserId = id;
      setUser(email || '');
      if (identityChanged || !id) {
        setRole(null); setEnquiries([]); setUndeliveredCount(null); setDeliveryCheckFailed(false); setProducts([]); setSelected(null); setEditing(null); setContent({});
        setLoading(Boolean(id));
      }
      if (!id) return;
      try {
        const result = await supabase!.from('staff_roles').select('role').eq('user_id',id).maybeSingle();
        if (!active || version !== identityVersion) return;
        if (result.error) {
          // Keep an already verified same-user role during a transient refresh failure.
          // Every data operation remains authorized independently by database RLS.
          setError('Staff access could not be rechecked. Please retry.');
        } else {
          setRole(result.data?.role || null);
        }
      } catch {
        if (active && version === identityVersion) setError('Staff access could not be rechecked. Please retry.');
      } finally {
        if (active && version === identityVersion) setLoading(false);
      }
    }
    supabase.auth.getSession().then(({data,error:sessionError}) => {
      if (!active || identityVersion !== 0) return;
      if (sessionError) { setError(sessionError.message); setLoading(false); }
      else void identify(0,data.session?.user.id,data.session?.user.email);
    });
    const {data} = supabase.auth.onAuthStateChange((_event,session) => {
      // Invalidate older checks immediately, before deferring work outside the auth callback.
      const version = ++identityVersion;
      setTimeout(() => void identify(version,session?.user.id,session?.user.email),0);
    });
    return () => { active = false; ++identityVersion; data.subscription.unsubscribe(); };
  }, []);
  const loadData = useCallback(async () => {
    if (!supabase || !role) return;
    setLoading(true); setError('');
    try {
      if (tab === 'enquiries') {
        let query = supabase.from('enquiries').select('*').order('created_at',{ascending:false}).range(page*50,page*50+49);
        if (filterService) query = query.eq('service',filterService);
        if (fromDate) query = query.gte('created_at',`${fromDate}T00:00:00+05:30`);
        if (toDate) { const end = new Date(`${toDate}T00:00:00+05:30`); end.setTime(end.getTime()+24*60*60*1000); query = query.lt('created_at',end.toISOString()); }
        const [result, delivery] = await Promise.all([
          query,
          supabase.from('enquiries').select('id',{count:'exact',head:true}).in('notification_status',['pending','failed']),
        ]);
        if (result.error) throw result.error;
        setEnquiries(result.data || []);
        setDeliveryCheckFailed(Boolean(delivery.error));
        setUndeliveredCount(delivery.error ? null : delivery.count);
      } else if (tab === 'products') {
        const result = await supabase.from('products').select('*').order('created_at',{ascending:false});
        if (result.error) throw result.error; setProducts(result.data || []);
      } else {
        const result = await supabase.from('site_content').select('key,value');
        if (result.error) throw result.error; setContent(Object.fromEntries((result.data || []).map(row => [row.key,row.value]))); setContentVersion(value => value+1);
      }
    } catch (cause) { setError(errorMessage(cause)); }
    finally { setLoading(false); }
  }, [role,tab,page,filterService,fromDate,toDate]);
  useEffect(() => { void loadData(); }, [loadData]);
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!supabase) return; setBusy(true); setError('');
    const data = new FormData(event.currentTarget);
    const result = await supabase.auth.signInWithPassword({email:String(data.get('email')),password:String(data.get('password'))});
    setBusy(false); if (result.error) setError('Sign-in failed. Please check your email and password.');
  }
  async function signOut() { await supabase?.auth.signOut(); setRole(null); setUser(''); setEnquiries([]); setUndeliveredCount(null); setDeliveryCheckFailed(false); setProducts([]); setSelected(null); setEditing(null); setContent({}); }
  async function retryNotification() {
    if (!supabase || !selected || !canEdit || busy) return;
    setBusy(true); setError(''); setMessage('');
    try {
      const {data,error:invokeError} = await supabase.functions.invoke('retry-notification',{body:{id:selected.id}});
      if (invokeError) {
        const response = (invokeError as {context?: Response}).context;
        const result = response ? await response.json().catch(() => ({})) : {};
        throw new Error(result.error || 'Notification could not be retried. Review the enquiry and contact the customer directly.');
      }
      if (data?.notification !== 'sent') throw new Error('The notification was not confirmed as sent.');
      setSelected({...selected,notification_status:'sent'});
      feedback('Email notification accepted by the email provider.');
      await loadData();
    } catch (cause) { await loadData(); setError(errorMessage(cause)); }
    finally { setBusy(false); }
  }
  async function updateStatus(value: string) {
    if (!supabase || !selected || !canEdit) return; setBusy(true);
    const result = await supabase.from('enquiries').update({status:value}).eq('id',selected.id);
    if (result.error) setError(errorMessage(result.error)); else { setSelected({...selected,status:value}); setEnquiries(items => items.map(item => item.id===selected.id ? {...item,status:value}:item)); feedback('Enquiry status updated.'); }
    setBusy(false);
  }
  async function downloadAttachment() {
    if (!supabase || !selected?.attachment_path) return;
    const result = await supabase.storage.from('enquiry-attachments').createSignedUrl(selected.attachment_path,60,{download:true});
    if (result.error) setError('Attachment could not be opened. Please retry.');
    else { const anchor = document.createElement('a'); anchor.href=result.data.signedUrl; anchor.download='enquiry-attachment'; anchor.rel='noopener'; anchor.click(); }
  }
  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!supabase || !editing || !canEdit) return; setBusy(true); setError('');
    try {
      const data = new FormData(event.currentTarget);
      const image = data.get('image'); let imageUrl = String(data.get('image_url') || '');
      if (image instanceof File && image.size) {
        if (image.size>5*1024*1024 || !['image/jpeg','image/png','image/webp'].includes(image.type)) throw new Error('Choose a JPG, PNG or WebP image up to 5 MB.');
        // Decode and re-encode staff images, removing metadata and non-image payloads.
        const bitmap = await createImageBitmap(image); const canvas = document.createElement('canvas');
        const scale = Math.min(1,1800/Math.max(bitmap.width,bitmap.height)); canvas.width=Math.round(bitmap.width*scale); canvas.height=Math.round(bitmap.height*scale);
        const context = canvas.getContext('2d'); if (!context) throw new Error('This browser could not process the image.'); context.drawImage(bitmap,0,0,canvas.width,canvas.height); bitmap.close();
        const blob = await new Promise<Blob>((resolve,reject) => canvas.toBlob(value => value ? resolve(value):reject(new Error('Image processing failed.')),'image/webp',.88));
        const path = `${crypto.randomUUID()}.webp`; const upload = await supabase.storage.from('product-images').upload(path,blob,{contentType:'image/webp'});
        if (upload.error) throw upload.error; imageUrl=supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl;
      }
      let specifications: Record<string,string> = {};
      const rawSpecs = String(data.get('specifications') || '').trim();
      if (rawSpecs) for (const line of rawSpecs.split('\n')) { const colon=line.indexOf(':'); if (colon<1) throw new Error('Write each specification as Label: Value on its own line.'); specifications[line.slice(0,colon).trim()]=line.slice(colon+1).trim(); }
      const values = {slug:String(data.get('slug')).trim(),name:String(data.get('name')).trim(),category:String(data.get('category')),manufacturer:String(data.get('manufacturer')).trim(),model:String(data.get('model')).trim(),machine_type:String(data.get('machine_type')).trim(),condition:String(data.get('condition')).trim(),availability:String(data.get('availability')).trim(),description:String(data.get('description')).trim(),specifications,image_url:imageUrl,published:data.get('published')==='on'};
      if (values.published && !values.image_url) throw new Error('Before publishing, add an approved product photograph.');
      if (values.published && values.category==='used-cmm' && (!values.manufacturer || !values.model || !values.machine_type || !values.condition)) throw new Error('Before publishing a used CMM, add a verified manufacturer, model, machine type and condition.');
      const result = 'id' in editing ? await supabase.from('products').update(values).eq('id',editing.id) : await supabase.from('products').insert(values);
      if (result.error) throw result.error; setEditing(null); feedback('Product saved.'); await loadData();
    } catch (cause) { setError(errorMessage(cause)); }
    finally { setBusy(false); }
  }
  async function archiveProduct(item: Product) {
    if (!supabase || !canEdit) return; const result = await supabase.from('products').update({published:false}).eq('id',item.id);
    if (result.error) setError(errorMessage(result.error)); else { feedback('Product removed from the public catalogue.'); await loadData(); }
  }
  async function saveContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!supabase || !canEdit) return; setBusy(true); setError('');
    const data = new FormData(event.currentTarget); let value: Record<string,unknown>;
    if (contentKey === 'company') value = {phone:data.get('phone'),email:data.get('email'),registeredOffice:data.get('registeredOffice'),works:data.get('works')};
    else if (contentKey === 'training') value = {description:data.get('description'),topics:String(data.get('topics')).split('\n').map(line=>line.trim()).filter(Boolean)};
    else value = {summary:data.get('summary'),overview:data.get('overview'),description:data.get('overview')};
    const result = await supabase.from('site_content').upsert({key:contentKey,value,published:true,updated_at:new Date().toISOString()});
    if (result.error) setError(errorMessage(result.error)); else { setContent(current=>({...current,[contentKey]:value})); feedback('Content published. Refresh the public website to see the update.'); }
    setBusy(false);
  }
  const currentContent = content[contentKey] || {};
  const currentService = serviceContent.find(item => `service:${item.slug}` === contentKey);
  if (!user || !role) return <main className="admin-shell admin-login-shell"><div className="admin-login"><Link to="/" className="admin-back"><ArrowLeft size={16}/>Back to Haviss</Link><div className="admin-lock"><LockKeyhole size={24}/></div><span className="eyebrow">HAVISS · STAFF ACCESS</span><h1>Welcome back.</h1><p>Sign in to manage enquiries and website content.</p>{!backendConfigured ? <div className="form-notice"><strong>Staff portal setup required</strong><p>Connect Supabase and provision an authorized staff account to enable access. No enquiry information is stored in this preview.</p></div> : loading ? <p role="status">Checking your session…</p> : user ? <div className="form-notice">This account does not have staff access. Ask your administrator to assign a role.<button className="button button-primary" onClick={signOut}>Sign out</button></div> : <form onSubmit={login}><label className="field">Staff email<input name="email" type="email" autoComplete="username" required/></label><label className="field">Password<input name="password" type="password" autoComplete="current-password" required/></label><button className="button button-primary" disabled={busy}>{busy ? 'Signing in…':'Sign in securely'}<ShieldCheck size={18}/></button></form>}{error && <p role="alert" className="form-status form-error">{error}</p>}<small>Access is limited to approved Haviss staff. Contact the website administrator for account assistance.</small></div></main>;
  return <main className="admin-shell"><div className="admin-container"><header className="admin-top"><div><Link to="/" className="admin-back"><ArrowLeft size={15}/>View website</Link><h1>Haviss workspace</h1><p>{user} <span className="admin-role">{role}</span></p></div><button className="admin-secondary" onClick={signOut}><LogOut size={16}/>Sign out</button></header><nav className="admin-tabs" aria-label="Staff workspace">{(['enquiries','products','content'] as Tab[]).map(item => <button key={item} aria-current={tab===item ? 'page':undefined} onClick={()=>{setTab(item);setMessage('');setError('');setSelected(null);setEditing(null);}}>{item==='content'?'Website content':item[0].toUpperCase()+item.slice(1)}</button>)}</nav>
    {error && <div role="alert" className="form-status form-error">{error}</div>}{message && <div role="status" className="form-status form-success"><Check size={16}/>{message}</div>}
    {tab==='enquiries' && <><div className="admin-section-heading"><div><h2>Customer enquiries</h2><p>Review requirements and track each conversation.</p></div><button className="admin-secondary" onClick={()=>void loadData()}><RefreshCw size={16}/>Refresh</button></div>{deliveryCheckFailed && <p className="admin-delivery-alert" role="alert">Email notification status could not be checked. Review recent enquiries directly.</p>}{undeliveredCount !== null && undeliveredCount > 0 && <p className="admin-delivery-alert" role="alert"><strong>{undeliveredCount} notification{undeliveredCount === 1 ? "" : "s"} need attention.</strong> Enquiries are saved here even if the email notification was not sent. Open an enquiry to retry or contact the customer directly.</p>}<div className="admin-filters"><label className="field">Service<select value={filterService} onChange={event=>{setFilterService(event.target.value);setPage(0);}}><option value="">All services</option>{services.map(item=><option key={item}>{item}</option>)}</select></label><label className="field">From date (India)<input type="date" value={fromDate} onChange={event=>{setFromDate(event.target.value);setPage(0);}}/></label><label className="field">To date (India)<input type="date" value={toDate} min={fromDate} onChange={event=>{setToDate(event.target.value);setPage(0);}}/></label></div><div className="admin-enquiry-grid"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Received</th><th>Contact</th><th>Service</th><th>Status</th><th>Email</th><th/></tr></thead><tbody>{enquiries.map(item=><tr key={item.id}><td>{new Date(item.created_at).toLocaleDateString('en-IN',{timeZone:'Asia/Kolkata'})}</td><td><strong>{item.company_name}</strong><br/>{item.full_name}</td><td>{item.service}</td><td><span className={`status-badge status-${item.status}`}>{item.status}</span></td><td><span className={"status-badge status-notification-" + item.notification_status}>{item.notification_status}</span></td><td><button className="admin-text-button" onClick={()=>setSelected(item)}>View<span className="sr-only"> enquiry from {item.full_name}</span></button></td></tr>)}</tbody></table>{!enquiries.length && !loading && <p className="admin-empty">No enquiries match these filters.</p>}{loading && <p className="admin-empty" role="status">Loading enquiries…</p>}<div className="admin-pagination"><button disabled={page===0} onClick={()=>setPage(value=>value-1)}>Previous</button><span>Page {page+1}</span><button disabled={enquiries.length<50} onClick={()=>setPage(value=>value+1)}>Next</button></div></div>{selected && <aside className="admin-detail"><button className="admin-text-button" onClick={()=>setSelected(null)}>Close details</button><h3>{selected.company_name}</h3><p>{selected.full_name}</p><dl><dt>Email</dt><dd><a href={`mailto:${selected.email}`}>{selected.email}</a></dd><dt>Phone</dt><dd><a href={`tel:${selected.phone}`}>{selected.phone}</a></dd><dt>Location</dt><dd>{selected.city}</dd><dt>Service</dt><dd>{selected.service}</dd><dt>Machine</dt><dd>{[selected.manufacturer,selected.model].filter(Boolean).join(' ') || 'Not provided'}</dd>{selected.product && <><dt>Product</dt><dd>{selected.product}</dd></>}<dt>Requirement</dt><dd className="admin-requirement">{selected.requirement}</dd><dt>Email notification</dt><dd><span className={"status-badge status-notification-" + selected.notification_status}>{selected.notification_status}</span>{selected.notification_status !== "sent" && <><p className="admin-retry-help">The enquiry is saved. If email delivery is unavailable, contact the customer directly.</p>{canEdit && <button className="admin-secondary admin-retry" disabled={busy} onClick={()=>void retryNotification()}><RefreshCw size={16}/>{busy?"Retrying…":"Retry notification"}</button>}</>}</dd></dl>{selected.attachment_path && <button className="admin-secondary" onClick={downloadAttachment}><Download size={16}/>Download attachment</button>}<label className="field">Enquiry status<select value={selected.status} disabled={!canEdit||busy} onChange={event=>void updateStatus(event.target.value)}>{statusOptions.map(item=><option key={item}>{item}</option>)}</select></label><small>Reference: {selected.id}</small></aside>}</div></>}
    {tab==='products' && <><div className="admin-section-heading"><div><h2>Product catalogue</h2><p>Publish only verified equipment and current specifications.</p></div>{canEdit && <button className="button button-primary" onClick={()=>setEditing({...emptyProduct})}><Plus size={18}/>Add product</button>}</div>{editing ? <form className="admin-editor" onSubmit={saveProduct}><div className="admin-section-heading"><h3>{'id' in editing?'Edit product':'New product'}</h3><button type="button" className="admin-text-button" onClick={()=>setEditing(null)}>Cancel</button></div><div className="form-grid"><label className="field">Product name<input name="name" required maxLength={150} defaultValue={editing.name}/></label><label className="field">URL slug<input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={100} defaultValue={editing.slug} placeholder="manufacturer-model"/></label><label className="field">Category<select name="category" defaultValue={editing.category}><option value="used-cmm">Used CMM</option><option value="modular-fixtures">Modular fixtures</option><option value="accessories">Accessories & spares</option><option value="consultation">Equipment consultation</option></select></label><label className="field">Manufacturer<input name="manufacturer" maxLength={100} defaultValue={editing.manufacturer}/></label><label className="field">Model<input name="model" maxLength={100} defaultValue={editing.model}/></label><label className="field">Machine type<input name="machine_type" maxLength={100} defaultValue={editing.machine_type}/></label><label className="field">Condition<input name="condition" maxLength={200} defaultValue={editing.condition}/></label><label className="field">Availability<input name="availability" required maxLength={200} defaultValue={editing.availability}/></label><label className="field field-full">Description<textarea name="description" rows={5} required maxLength={5000} defaultValue={editing.description}/></label><label className="field field-full">Verified specifications (one Label: Value per line)<textarea name="specifications" rows={5} defaultValue={Object.entries(editing.specifications).map(([key,value])=>`${key}: ${value}`).join('\n')} placeholder="Only enter specifications verified for this machine."/></label><input type="hidden" name="image_url" value={editing.image_url}/><label className="field field-full">Product photograph<input name="image" type="file" accept=".jpg,.jpeg,.png,.webp"/><small>JPG, PNG or WebP, maximum 5 MB. Use approved photography.</small>{editing.image_url && <img className="admin-product-thumb" src={editing.image_url} alt={editing.name}/>}</label></div><label className="consent-field"><input type="checkbox" name="published" defaultChecked={editing.published}/><span>Publish in the public catalogue. I have verified the description, specifications, image rights and availability.</span></label><button className="button button-primary" disabled={busy}>{busy?<Loader2 className="spin" size={18}/>:<Save size={18}/>}Save product</button></form> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Product</th><th>Manufacturer / model</th><th>Visibility</th><th>Availability</th><th/></tr></thead><tbody>{products.map(item=><tr key={item.id}><td>{item.name}</td><td>{item.manufacturer} {item.model}</td><td>{item.published?'Published':'Draft'}</td><td>{item.availability}</td><td>{canEdit && <div className="admin-actions"><button className="admin-text-button" onClick={()=>setEditing(item)}>Edit</button>{item.published&&<button className="admin-text-button" onClick={()=>void archiveProduct(item)}>Unpublish</button>}</div>}</td></tr>)}</tbody></table>{!products.length && !loading && <div className="admin-empty"><h3>No machines listed yet.</h3><p>The public catalogue invites visitors to contact Haviss for current availability.</p></div>}</div>}</>}
    {tab==='content' && <><div className="admin-section-heading"><div><h2>Website content</h2><p>Keep contact information, service copy and training topics current.</p></div></div><label className="field admin-content-selector">Section<select value={contentKey} onChange={event=>setContentKey(event.target.value)}><option value="company">Company contact details</option><option value="training">Training information</option>{serviceContent.map(item=><option key={item.slug} value={`service:${item.slug}`}>{item.title}</option>)}</select></label><form key={`${contentKey}-${contentVersion}`} className="admin-editor" onSubmit={saveContent}><fieldset disabled={!canEdit||busy}><div className="form-grid">{contentKey==='company' ? <><label className="field">Phone number<input name="phone" type="tel" required maxLength={25} defaultValue={String(currentContent.phone||company.phone)}/></label><label className="field">Email<input name="email" type="email" required maxLength={254} defaultValue={String(currentContent.email||company.email)}/></label><label className="field field-full">Registered office<textarea name="registeredOffice" required maxLength={1000} rows={3} defaultValue={String(currentContent.registeredOffice||company.registeredOffice)}/></label><label className="field field-full">Works address<textarea name="works" required maxLength={1000} rows={3} defaultValue={String(currentContent.works||company.works)}/></label></> : contentKey==='training' ? <><label className="field field-full">Training introduction<textarea name="description" required rows={5} maxLength={5000} defaultValue={String(currentContent.description||'Build practical skills in coordinate measurement, alignment, inspection and reporting. Discuss your machine, software and learning requirements with Haviss to shape a suitable training programme.')}/></label><label className="field field-full">Topics (one per line)<textarea name="topics" rows={12} required maxLength={5000} defaultValue={(Array.isArray(currentContent.topics)?currentContent.topics:trainingTopics).join('\n')}/></label></> : <><label className="field field-full">Service summary<textarea name="summary" rows={3} required maxLength={500} defaultValue={String(currentContent.summary||currentService?.summary||'')}/></label><label className="field field-full">Technical overview<textarea name="overview" rows={8} required maxLength={5000} defaultValue={String(currentContent.overview||currentContent.description||currentService?.overview||'')}/></label></>}</div>{canEdit && <button className="button button-primary" type="submit" disabled={busy}><Save size={18}/>{busy?'Saving…':'Publish changes'}</button>}{!canEdit&&<p className="form-notice">Your viewer role permits read-only access. An editor or administrator can publish changes.</p>}</fieldset></form></>}
    </div></main>;
}
