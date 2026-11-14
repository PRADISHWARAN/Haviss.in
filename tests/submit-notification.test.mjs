import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { transform } from 'esbuild';

// Exercise submission against mocked database and Turnstile; no email is sent.
const source = await readFile(new URL('../supabase/functions/submit-enquiry/index.ts', import.meta.url),'utf8');
const withoutImports = source.replace(/^import .*;\r?\n/gm, '');
const {code} = await transform(`const createClient=globalThis.__submitCreateClient; const validateFields=globalThis.__submitValidate; const validateAttachment=globalThis.__submitValidateAttachment; const sendEnquiryNotification=globalThis.__submitSend;\n${withoutImports}`,{loader:'ts',format:'esm',target:'es2022'});
const id='00112233-4455-4677-8899-aabbccddeeff';
const fields={id,full_name:'Test Engineer',company_name:'Test Company',email:'customer@example.com',phone:'+91 9000000000',city:'Chennai',service:'CMM Retrofit',manufacturer:'',model:'',product:'',requirement:'Please assess our machine.'};
let handler;let state;
function reset(){state={env:{ALLOWED_ORIGINS:'https://example.com',SUPABASE_URL:'https://example.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'server-secret',TURNSTILE_SECRET_KEY:'captcha-secret',RATE_LIMIT_SALT:'test-salt',RESEND_API_KEY:'email-secret',ENQUIRY_FROM_EMAIL:'site@example.com'},inserted:null,update:null,sends:[]};}
globalThis.Deno={env:{get:key=>state.env[key]},serve:fn=>{handler=fn}};
globalThis.__submitValidate=()=>fields;
globalThis.__submitValidateAttachment=()=>{throw new Error('No attachment expected');};
globalThis.__submitSend=async (item,config)=>{state.sends.push({item,config});return true;};
globalThis.__submitCreateClient=()=>({
 rpc:async()=>({data:true,error:null}),
 from:()=>({
  select(){return this;},eq(){return this;},async maybeSingle(){return {data:null,error:null};},
  async insert(row){state.inserted=row;return {error:null};},
  update(row){state.update=row;return this;},async neq(){return {error:null};},
 }),
});
const realFetch=globalThis.fetch;
globalThis.fetch=async url=>{assert.equal(url,'https://challenges.cloudflare.com/turnstile/v0/siteverify');return Response.json({success:true,hostname:'example.com'});};
await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
function request(){const form=new FormData();form.set('started_at',String(Date.now()-3000));form.set('turnstile_token','test-token');return new Request('https://example.supabase.co/functions/v1/submit-enquiry',{method:'POST',headers:{origin:'https://example.com'},body:form});}

test('without an explicitly configured recipient, the enquiry persists as pending and no notification is sent',async()=>{
 reset(); const response=await handler(request());const data=await response.json();
 assert.equal(response.status,201);assert.equal(data.notification,'pending');assert.equal(state.inserted.id,id);assert.equal(state.sends.length,0);assert.equal(state.update,null);
});
test('email is sent only when a recipient is explicitly supplied',async()=>{
 reset();state.env.ENQUIRY_TO_EMAIL='  recipient@example.com  ';const response=await handler(request());const data=await response.json();
 assert.equal(response.status,201);assert.equal(data.notification,'sent');assert.equal(state.sends.length,1);assert.equal(state.sends[0].config.to,'recipient@example.com');assert.equal(state.update.notification_status,'sent');
});
test('a blank recipient remains unconfigured',async()=>{
 reset();state.env.ENQUIRY_TO_EMAIL='   ';const response=await handler(request());const data=await response.json();
 assert.equal(data.notification,'pending');assert.equal(state.inserted.id,id);assert.equal(state.sends.length,0);
});
test.after(()=>{globalThis.fetch=realFetch;});
