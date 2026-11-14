import { createClient } from 'npm:@supabase/supabase-js@2';
import { validateAttachment, validateFields } from './validation.ts';
import { sendEnquiryNotification } from '../_shared/notification.ts';

Deno.serve(async (request: Request) => {
  const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') || '').split(',').map(value => value.trim()).filter(Boolean);
  const origin = request.headers.get('origin') || '';
  const headers = { 'Content-Type': 'application/json', 'Vary': 'Origin', 'Cache-Control': 'no-store', ...(allowedOrigins.includes(origin) ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': 'apikey,content-type,authorization,x-client-info', 'Access-Control-Allow-Methods': 'POST,OPTIONS' } : {}) };
  const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });
  if (!allowedOrigins.includes(origin)) return reply({ error: 'This website is not configured for online enquiries.' }, 403);
  if (request.method === 'OPTIONS') return new Response(null,{status:204,headers});
  if (request.method !== 'POST') return reply({ error: 'Method not allowed.' },405);
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY');
  const ipSalt = Deno.env.get('RATE_LIMIT_SALT');
  if (!serviceKey || !secret || !ipSalt) return reply({ error: 'Online enquiries are being connected. Please contact our team by phone.' },503);
  if (!request.headers.get('content-type')?.startsWith('multipart/form-data')) return reply({ error: 'Unsupported form format.' },415);
  if (Number(request.headers.get('content-length') || 0) > 6 * 1024 * 1024) return reply({ error: 'The attachment is too large.' },413);
  const client = createClient(Deno.env.get('SUPABASE_URL')!,serviceKey,{auth:{persistSession:false}});
  let attachmentPath: string | null = null;
  let inserted = false;
  try {
    // Bound even chunked bodies before invoking the multipart parser.
    const reader = request.body?.getReader();
    if (!reader) return reply({error:'Empty form.'},400);
    const chunks: Uint8Array[] = []; let length = 0;
    while (true) { const {done,value} = await reader.read(); if (done) break; length += value.byteLength; if (length > 6 * 1024 * 1024) { await reader.cancel(); return reply({error:'The attachment is too large.'},413); } chunks.push(value); }
    const bytes = new Uint8Array(length); let offset = 0; for (const chunk of chunks) { bytes.set(chunk,offset); offset += chunk.byteLength; }
    const data = await new Response(bytes,{headers:{'Content-Type':request.headers.get('content-type')!}}).formData();
    if (data.get('website')) return reply({error:'Unable to accept this submission.'},400);
    const fields = validateFields(data);
    const started = Number(data.get('started_at'));
    if (!Number.isFinite(started) || Date.now() - started < 2000 || Date.now() - started > 24*60*60*1000) return reply({error:'Please reload the form and try again.'},400);
    const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    const digest = new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(`${ipSalt}:${ip}`)));
    const rateKey = Array.from(digest,value => value.toString(16).padStart(2,'0')).join('');
    const { data: allowed, error: rateError } = await client.rpc('take_enquiry_rate_limit',{p_key:rateKey});
    if (rateError) throw new Error('Submission protection is temporarily unavailable. Please try again later.');
    if (!allowed) return reply({error:'Too many enquiries. Please wait an hour or call our team.'},429);
    const token = String(data.get('turnstile_token') || '');
    if (!token || token.length > 2048) return reply({error:'Please complete the security check.'},400);
    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret,response:token,remoteip:ip})});
    const verificationResult = await verification.json();
    if (!verification.ok || !verificationResult.success) return reply({error:'The security check expired. Please try again.'},400);
    const allowedHosts = allowedOrigins.map(value => new URL(value).hostname);
    if (!allowedHosts.includes(verificationResult.hostname)) return reply({error:'The security check was not issued for this website.'},400);
    const { data: existing } = await client.from('enquiries').select('id,notification_status').eq('id',fields.id).maybeSingle();
    if (existing) return reply({id:existing.id,notification:existing.notification_status});
    const attachment = data.get('attachment');
    if (attachment instanceof File && attachment.size) {
      const fileBytes = new Uint8Array(await attachment.arrayBuffer());
      const extension = validateAttachment(fileBytes,attachment.type,attachment.name);
      attachmentPath = `${fields.id}/${crypto.randomUUID()}.${extension}`;
      const { error } = await client.storage.from('enquiry-attachments').upload(attachmentPath,fileBytes,{contentType:attachment.type,upsert:false});
      if (error) throw new Error('The attachment could not be saved. Please try again.');
    }
    const { error: insertError } = await client.from('enquiries').insert({...fields,attachment_path:attachmentPath,consent_at:new Date().toISOString()});
    if (insertError) throw new Error('Your enquiry could not be saved. Please try again.');
    inserted = true;
    let notification = 'pending';
    const emailKey = Deno.env.get('RESEND_API_KEY')?.trim(); const from = Deno.env.get('ENQUIRY_FROM_EMAIL')?.trim(); const to = Deno.env.get('ENQUIRY_TO_EMAIL')?.trim();
    // The recipient is deliberately unset until the business explicitly supplies it.
    if (emailKey && from && to) {
      const sent = await sendEnquiryNotification({...fields,attachment_path:attachmentPath},{apiKey:emailKey,from,to});
      notification = sent ? 'sent' : 'failed';
      await client.from('enquiries').update({notification_status:notification}).eq('id',fields.id).neq('notification_status','sent');
    }
    return reply({id:fields.id,notification},201);
  } catch (error) {
    if (attachmentPath && !inserted) await client.storage.from('enquiry-attachments').remove([attachmentPath]);
    // User validation errors contain no database credentials or query details.
    return reply({error:error instanceof Error ? error.message : 'Unable to submit the enquiry. Please contact our team.'},400);
  }
});
