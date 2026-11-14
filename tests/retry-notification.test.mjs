import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { transform } from 'esbuild';

// Exercise the Edge handler with mocked Supabase and email; no network calls are made.
const source = await readFile(new URL('../supabase/functions/retry-notification/index.ts', import.meta.url),'utf8');
const withoutImports = source.replace(/^import .*;\r?\n/gm, '');
const boundedSource = await readFile(new URL('../supabase/functions/_shared/bounded-body.ts', import.meta.url),'utf8');
const bounded = await transform(boundedSource, { loader:'ts',format:'esm',target:'es2022' });
const boundedExports = await import(`data:text/javascript;base64,${Buffer.from(bounded.code).toString('base64')}`);
globalThis.__retryBounded = boundedExports;
const { code } = await transform(`const createClient=globalThis.__retryCreateClient; const sendEnquiryNotification=globalThis.__retrySend; const {BodyTooLarge,readBoundedText}=globalThis.__retryBounded;\n${withoutImports}`, { loader:'ts',format:'esm',target:'es2022' });
const id = '00112233-4455-4677-8899-aabbccddeeff';
const enquiry = {id, full_name:'Test',company_name:'Company',email:'customer@example.com',phone:'+91 9000000000',city:'Chennai',service:'CMM Retrofit',manufacturer:'',model:'',product:'',requirement:'Please assess our machine.',attachment_path:null,notification_status:'failed'};
let state;
let handler;
function reset() {
  state = { user:{id:'staff-id'}, role:'editor', item:{...enquiry}, sent:true, sends:0, updateError:null,
    env:{ALLOWED_ORIGINS:'https://example.com',SUPABASE_URL:'https://example.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'server-secret',RESEND_API_KEY:'email-secret',ENQUIRY_FROM_EMAIL:'site@example.com',ENQUIRY_TO_EMAIL:'recipient@example.com'} };
}
globalThis.Deno = {env:{get:key=>state.env[key]},serve:fn=>{handler=fn}};
globalThis.__retrySend = async () => {state.sends++;return state.sent;};
globalThis.__retryCreateClient = () => ({
  auth:{getUser:async()=>({data:{user:state.user},error:state.user?null:new Error('invalid')})},
  from(table) {
    const builder = {
      select(){return this;}, eq(){return this;},
      async maybeSingle(){return {data:table==='staff_roles' ? (state.role?{role:state.role}:null) : state.item,error:null};},
      update(value){this.pending=value;return this;},
      async neq(){if(!state.updateError && state.item && state.item.notification_status !== 'sent') state.item.notification_status=this.pending.notification_status;return {error:state.updateError};},
    };
    return builder;
  },
});
await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
function request({origin='https://example.com',authorization='Bearer signed-user-token',body={id}}={}) {
  return new Request('https://example.supabase.co/functions/v1/retry-notification',{method:'POST',headers:{origin,authorization,'content-type':'application/json'},body:JSON.stringify(body)});
}

test('notification retry requires the allowed origin, an authenticated user and a staff editor role', async () => {
  reset(); assert.equal((await handler(request({origin:'https://other.example'}))).status,403);
  reset(); assert.equal((await handler(request({authorization:''}))).status,401);
  reset(); state.user=null; assert.equal((await handler(request())).status,401);
  reset(); state.role='viewer'; assert.equal((await handler(request())).status,403);
  assert.equal(state.sends,0);
});
test('allowed-origin preflight receives CORS headers without processing an email', async () => {
  reset();
  const preflight=new Request('https://example.supabase.co/functions/v1/retry-notification',{method:'OPTIONS',headers:{origin:'https://example.com','access-control-request-method':'POST','access-control-request-headers':'authorization, apikey, content-type, x-client-info'}});
  const response=await handler(preflight);
  assert.equal(response.status,204);
  assert.equal(response.headers.get('access-control-allow-origin'),'https://example.com');
  for (const name of ['authorization','apikey','content-type','x-client-info']) assert.match(response.headers.get('access-control-allow-headers'),new RegExp(name,'i'));
  assert.equal(state.sends,0);
  const denied=await handler(new Request(preflight.url,{method:'OPTIONS',headers:{origin:'https://other.example'}}));
  assert.equal(denied.status,403);
});
test('notification retry fails closed for invalid requests and missing email configuration', async () => {
  reset(); assert.equal((await handler(request({body:{id:'invalid'}}))).status,400);
  reset(); state.item=null; assert.equal((await handler(request())).status,404);
  reset(); delete state.env.RESEND_API_KEY; assert.equal((await handler(request())).status,503);
  reset(); delete state.env.ENQUIRY_TO_EMAIL; assert.equal((await handler(request())).status,503);
  reset(); state.env.ENQUIRY_TO_EMAIL='  '; assert.equal((await handler(request())).status,503);
  assert.equal(state.sends,0);
});
test('retry bounds chunked bodies even without or with a false Content-Length', async () => {
  for (const lengthHeader of [null, '12']) {
    reset(); let chunksRead=0; let cancelled=false;
    const body = new ReadableStream({
      pull(controller) { chunksRead++; controller.enqueue(new Uint8Array(400)); },
      cancel() { cancelled=true; },
    });
    const headers={origin:'https://example.com',authorization:'Bearer signed-user-token','content-type':'application/json'};
    if (lengthHeader) headers['content-length']=lengthHeader;
    const result=await handler(new Request('https://example.supabase.co/functions/v1/retry-notification',{method:'POST',headers,body,duplex:'half'}));
    assert.equal(result.status,413);
    assert.equal(cancelled,true);
    assert.ok(chunksRead<=4);
    assert.equal(state.sends,0);
  }
});
test('retry marks only provider-accepted delivery sent and does not resend confirmed items', async () => {
  reset(); const ok=await handler(request()); assert.equal(ok.status,200); assert.equal(state.item.notification_status,'sent'); assert.equal(state.sends,1);
  const again=await handler(request()); assert.equal(again.status,200); assert.equal(state.sends,1);
  reset(); state.sent=false; const fail=await handler(request()); assert.equal(fail.status,502); assert.equal(state.item.notification_status,'failed');
  reset(); state.updateError=new Error('unavailable'); const unconfirmed=await handler(request()); assert.equal(unconfirmed.status,503);
});
