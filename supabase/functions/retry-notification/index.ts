import { createClient } from 'npm:@supabase/supabase-js@2';
import { sendEnquiryNotification } from '../_shared/notification.ts';
import { BodyTooLarge, readBoundedText } from '../_shared/bounded-body.ts';

// Deliberately keep Supabase's default verify_jwt=true for this staff-only function.
Deno.serve(async (request: Request) => {
  const origins = (Deno.env.get('ALLOWED_ORIGINS') || '').split(',').map(value => value.trim()).filter(Boolean);
  const origin = request.headers.get('origin') || '';
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Vary': 'Origin',
    ...(origins.includes(origin) ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': 'apikey,authorization,content-type,x-client-info', 'Access-Control-Allow-Methods': 'POST,OPTIONS' } : {}) };
  const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });
  if (!origins.includes(origin)) return reply({ error: 'Origin not allowed.' }, 403);
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') return reply({ error: 'Method not allowed.' }, 405);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return reply({ error: 'Unsupported request.' }, 415);
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const authorization = request.headers.get('authorization') || '';
  const token = authorization.match(/^Bearer\s+(\S+)$/i)?.[1];
  if (!serviceKey || !supabaseUrl || !token) return reply({ error: 'Staff authorization is required.' }, 401);
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  try {
    const { data: identity, error: authError } = await admin.auth.getUser(token);
    if (authError || !identity.user) return reply({ error: 'Staff authorization is required.' }, 401);
    const { data: staff, error: roleError } = await admin.from('staff_roles').select('role').eq('user_id', identity.user.id).maybeSingle();
    if (roleError || !['admin', 'editor'].includes(staff?.role)) return reply({ error: 'You do not have permission to retry notifications.' }, 403);
    if (Number(request.headers.get('content-length') || 0) > 1024) return reply({ error: 'Invalid request.' }, 413);
    let raw: string;
    try { raw = await readBoundedText(request.body, 1024); }
    catch (error) { return reply({error:'Invalid request.'}, error instanceof BodyTooLarge ? 413 : 400); }
    let id: unknown;
    try { id = JSON.parse(raw).id; } catch { return reply({ error: 'Invalid request.' }, 400); }
    if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return reply({ error: 'Invalid enquiry reference.' }, 400);
    const { data: enquiry, error: lookupError } = await admin.from('enquiries').select('id,full_name,company_name,email,phone,city,service,manufacturer,model,product,requirement,attachment_path,notification_status').eq('id', id).maybeSingle();
    if (lookupError) return reply({ error: 'The enquiry could not be loaded.' }, 503);
    if (!enquiry) return reply({ error: 'Enquiry not found.' }, 404);
    if (enquiry.notification_status === 'sent') return reply({ notification: 'sent', message: 'This notification is already marked sent.' });
    const apiKey = Deno.env.get('RESEND_API_KEY')?.trim(); const from = Deno.env.get('ENQUIRY_FROM_EMAIL')?.trim(); const to = Deno.env.get('ENQUIRY_TO_EMAIL')?.trim();
    if (!apiKey || !from || !to) return reply({ error: 'Email delivery or its recipient is not configured. Review the enquiry in this dashboard and contact the customer directly.' }, 503);
    const sent = await sendEnquiryNotification(enquiry, { apiKey, from, to });
    const notification = sent ? 'sent' : 'failed';
    // A concurrent successful request must not be overwritten by a failed retry.
    const { error: updateError } = await admin.from('enquiries').update({ notification_status: notification }).eq('id', id).neq('notification_status', 'sent');
    if (updateError) return reply({ error: 'Delivery status could not be saved. Check the email provider before trying again.' }, 503);
    if (!sent) return reply({ error: 'The email provider did not accept the notification. Review the enquiry here and contact the customer directly.' }, 502);
    return reply({ notification });
  } catch {
    return reply({ error: 'The notification could not be retried. Please try again later.' }, 503);
  }
});
