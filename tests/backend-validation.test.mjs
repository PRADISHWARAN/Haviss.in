import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { transform } from 'esbuild';

const source = await readFile(new URL('../supabase/functions/submit-enquiry/validation.ts', import.meta.url), 'utf8');
const { code } = await transform(source, { loader: 'ts', format: 'esm', target: 'es2022' });
const { validateFields, validateAttachment } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
function validForm() {
  const form = new FormData();
  for (const [key,value] of Object.entries({request_id:'00112233-4455-4677-8899-aabbccddeeff',full_name:'Test Engineer',company_name:'Test Company',email:'engineer@example.com',phone:'+91 90000 00000',city:'Chennai',service:'CMM Retrofit',manufacturer:'',model:'',requirement:'Please assess our existing coordinate measuring machine.',product:'',consent:'true'})) form.set(key,value);
  return form;
}
test('valid enquiry is normalized without losing technical text', () => {
  const form=validForm(); form.set('email',' Engineer@EXAMPLE.com ');
  assert.equal(validateFields(form).email,'engineer@example.com');
  assert.equal(validateFields(form).service,'CMM Retrofit');
});
test('rejects arbitrary service, missing consent, malformed identifiers and control characters', () => {
  for (const [key,value] of [['service','Invented service'],['consent','false'],['request_id','not-a-uuid'],['full_name','Name\u0000payload'],['email','invalid@'],['phone','call me soon']]) {
    const form=validForm(); form.set(key,value); assert.throws(()=>validateFields(form),undefined,`${key} should fail`);
  }
});
test('enforces meaningful requirement and maximum field lengths', () => {
  const short=validForm();short.set('requirement','Hello');assert.throws(()=>validateFields(short));
  const long=validForm();long.set('requirement','x'.repeat(5001));assert.throws(()=>validateFields(long));
  const fileField=validForm();fileField.set('email',new Blob(['malformed']), 'bad.txt');assert.throws(()=>validateFields(fileField));
});
test('accepts recognized file signatures only when MIME and extension agree', () => {
  assert.equal(validateAttachment(new Uint8Array([37,80,68,70,45,49]),'application/pdf','part.pdf'),'pdf');
  assert.equal(validateAttachment(new Uint8Array([255,216,255,224]),'image/jpeg','part.jpeg'),'jpg');
  assert.equal(validateAttachment(new Uint8Array([137,80,78,71,13,10,26,10]),'image/png','part.png'),'png');
});
test('rejects spoofed, mismatched, empty and oversized attachments', () => {
  assert.throws(()=>validateAttachment(new TextEncoder().encode('<script>alert(1)</script>'),'application/pdf','part.pdf'));
  assert.throws(()=>validateAttachment(new Uint8Array([37,80,68,70,45]),'image/png','part.png'));
  assert.throws(()=>validateAttachment(new Uint8Array([37,80,68,70,45]),'application/pdf','part.exe'));
  assert.throws(()=>validateAttachment(new Uint8Array(),'application/pdf','part.pdf'));
  assert.throws(()=>validateAttachment(new Uint8Array(5*1024*1024+1),'application/pdf','part.pdf'));
});
