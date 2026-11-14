import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { transform } from 'esbuild';

const source = await readFile(new URL('../supabase/functions/_shared/notification.ts', import.meta.url), 'utf8');
const { code } = await transform(source, { loader: 'ts', format: 'esm', target: 'es2022' });
const { notificationPayload, sendEnquiryNotification } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const item = { id:'00112233-4455-4677-8899-aabbccddeeff',full_name:'Test Engineer',company_name:'Test Company',email:'customer@example.com',phone:'+91 90000 00000',city:'Chennai',service:'CMM Retrofit',manufacturer:'Make',model:'Model',product:'',requirement:'Please assess the machine.',attachment_path:'private/secret.pdf' };
const config = { apiKey:'test-key', from:'Haviss <site@example.com>', to:'recipient@example.com' };

test('notification identifies the enquiry without revealing a private attachment path', () => {
  const payload = notificationPayload(item, config);
  assert.equal(payload.reply_to, 'customer@example.com');
  assert.deepEqual(payload.to, ['recipient@example.com']);
  assert.match(payload.text, /\nName: Test Engineer\n/);
  assert.match(payload.text, /Available in the secure staff dashboard/);
  assert.doesNotMatch(payload.text, /private\/secret\.pdf/);
});
test('notification retries use the stable enquiry idempotency key', async () => {
  let request;
  const sent = await sendEnquiryNotification(item, config, async (url, init) => { request = {url,init}; return new Response('',{status:202}); });
  assert.equal(sent, true);
  assert.equal(request.url, 'https://api.resend.com/emails');
  assert.equal(request.init.headers['Idempotency-Key'], `enquiry-${item.id}`);
});
test('email rejection and network errors never claim delivery', async () => {
  assert.equal(await sendEnquiryNotification(item, config, async () => new Response('',{status:500})),false);
  assert.equal(await sendEnquiryNotification(item, config, async () => { throw new Error('offline'); }),false);
});
