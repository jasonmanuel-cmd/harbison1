import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
import { readJsonBody, BodyError } from '../src/lib/server/request-body.ts'
const code = fs.readFileSync(new URL('../src/pages/api/lead.ts', import.meta.url), 'utf8')
  .replace(/^import .* from 'astro:env\/server'$/m, 'const getSecret = globalThis.__leadMocks.getSecret')
  .replace(/^import \{ saveLead \}.*$/m, 'const saveLead = globalThis.__leadMocks.saveLead')
  .replace(/^import \{ clientKey, hit \}.*$/m, 'const { clientKey, hit } = globalThis.__leadMocks')
  .replace(/^import \{ authorizedCrmCheck.*$/m, 'const { authorizedCrmCheck, saveToSharedCrm, sharedCrmConfigured, verifySharedCrm } = globalThis.__leadMocks')
  .replace(/^import \{ readJsonBody.*$/m, 'const { readJsonBody, BodyError } = globalThis.__leadMocks')
const js = ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText
let sequence = 0
const sample = { name: 'Test', email: 'TEST@example.test', phone: '(661) 555-0100', submission_id: '00000000-0000-4000-8000-000000000001' }
async function harness(t, overrides={}) {
  const originalFetch=globalThis.fetch, originalError=console.error
  const logs=[], mail=[]
  console.error=(...args)=>logs.push(args.join(' '))
  globalThis.fetch=async(...args)=>{mail.push(args);return Response.json({ok:true})}
  globalThis.__leadMocks={readJsonBody,BodyError,getSecret:()=>undefined,saveLead:async()=>({id:'one'}),clientKey:()=> 'test',hit:()=>({allowed:true}),authorizedCrmCheck:()=>false,sharedCrmConfigured:()=>true,saveToSharedCrm:async()=>({duplicate:false}),verifySharedCrm:async()=>{},...overrides}
  t.after(()=>{globalThis.fetch=originalFetch;console.error=originalError;delete globalThis.__leadMocks})
  const {POST}=await import('data:text/javascript;base64,'+Buffer.from(js+'\n//'+sequence++).toString('base64'))
  return {mail,logs,call:async(body=sample)=>POST({request:new Request('https://www.harbisonstandard.com/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})})}
}

test('invalid and oversized requests reach neither storage nor notification',async t=>{
  let saves=0;const h=await harness(t,{saveToSharedCrm:async()=>{saves++;return{duplicate:false}}})
  for(const extra of [{phone:''},{phone:'not a phone'},{name:'x'.repeat(101)},{timeline:'invented'},{bedrooms:'99+'},{bedrooms:{toString:null}},{bedrooms:['2+']},{bedrooms:true},{message:'x'.repeat(20000)}])assert.equal((await h.call({...sample,...extra})).status,extra.message?413:400)
  assert.equal(saves,0);assert.equal(h.mail.length,0)
})
test('email failure then same-ID duplicate reports unknown and does not resend',async t=>{
  let saved=false;const h=await harness(t,{saveToSharedCrm:async()=>{const duplicate=saved;saved=true;return{duplicate}}})
  globalThis.fetch=async(...args)=>{h.mail.push(args);return new Response('PRIVATE submitted contact',{status:502})}
  const first=await h.call();assert.equal(first.status,502);assert.equal((await first.json()).stored,true)
  const retry=await h.call();assert.equal(retry.status,202);assert.equal((await retry.json()).notification,'unknown');assert.equal(h.mail.length,1)
  assert.ok(h.logs.every(line=>!line.includes('PRIVATE')))
})
test('concurrent duplicate submissions have one email attempt and no false duplicate success',async t=>{
  let saved=false;const h=await harness(t,{saveToSharedCrm:async()=>{const duplicate=saved;saved=true;return{duplicate}}})
  const responses=await Promise.all([h.call(),h.call(),h.call()]);const bodies=await Promise.all(responses.map(r=>r.json()))
  assert.equal(h.mail.length,1);assert.equal(bodies.filter(b=>b.notification==='accepted').length,1);assert.equal(bodies.filter(b=>b.notification==='unknown').length,2)
})
test('lost email response remains uncertain on duplicate after recovery',async t=>{
  let saved=false;const h=await harness(t,{saveToSharedCrm:async()=>{const duplicate=saved;saved=true;return{duplicate}}})
  globalThis.fetch=async(...args)=>{h.mail.push(args);throw new Error('PRIVATE payload')}
  assert.equal((await h.call()).status,503)
  globalThis.fetch=async(...args)=>{h.mail.push(args);return Response.json({ok:true})}
  assert.equal((await (await h.call()).json()).notification,'unknown');assert.equal(h.mail.length,1);assert.ok(h.logs.every(line=>!line.includes('PRIVATE')))
})
test('storage failure still attempts notification; neither service success is not claimed',async t=>{
  const h=await harness(t,{saveToSharedCrm:async()=>{throw new Error('PRIVATE')}})
  const response=await h.call();assert.equal(response.status,201);assert.equal((await response.json()).stored,false)
  globalThis.fetch=async()=>{throw new Error('PRIVATE')};assert.equal((await h.call()).status,503);assert.ok(h.logs.every(line=>!line.includes('PRIVATE')))
})
test('body reader bounds chunked bytes and stalled streams',async()=>{
  const request=()=>new Request('https://local.test',{method:'POST',headers:{'Content-Type':'application/json'},body:new ReadableStream({start(c){c.enqueue(new TextEncoder().encode('123456789'))}}),duplex:'half'})
  await assert.rejects(readJsonBody(request(),4),e=>e.status===413)
  await assert.rejects(readJsonBody(request(),100,10),e=>e.status===408)
})
