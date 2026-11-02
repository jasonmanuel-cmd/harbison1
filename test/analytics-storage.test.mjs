import test from 'node:test'
import assert from 'node:assert/strict'
let counter=0
async function setup(t, sessionStorage, navigatorValue={}) {
 const originals=new Map(['window','navigator','fetch','document'].map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)]))
 t.after(()=>{for(const [k,d] of originals){if(d)Object.defineProperty(globalThis,k,d);else delete globalThis[k]}})
 const values=new Map();const localStorage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)}
 Object.defineProperty(globalThis,'window',{configurable:true,value:{localStorage,sessionStorage,location:{hostname:'www.harbisonstandard.com',pathname:'/',search:''},addEventListener(){}}})
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:navigatorValue})
 Object.defineProperty(globalThis,'document',{configurable:true,value:{hidden:false,title:'Test',referrer:''}})
 const sent=[];globalThis.fetch=async(...args)=>{sent.push(args);return Response.json({stored:true})}
 return {module:await import('../src/scripts/analytics.ts?test='+counter++),sent}
}
test('working localStorage with denied sessionStorage reads skips analytics and attribution',async t=>{
 const deny=()=>{throw Error('denied')};const {module:m,sent}=await setup(t,{getItem:deny,setItem:deny})
 assert.equal(m.analyticsAllowed(),true);assert.doesNotThrow(()=>m.trackPageView());assert.equal(m.getSessionId(),null);await Promise.resolve();assert.equal(sent.length,0)
})
test('sessionStorage write denial does not throw or send orphan events',async t=>{
 const {module:m,sent}=await setup(t,{getItem:()=>null,setItem:()=>{throw Error('quota')}})
 assert.doesNotThrow(()=>m.trackPageView());await Promise.resolve();assert.equal(sent.length,0)
})
test('opt-out prevents attribution to an existing session and queued analytics',async t=>{
 const values=new Map([['hs_sid','old-session'],['hs_t0',String(Date.now())]])
 const {module:m,sent}=await setup(t,{getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)})
 assert.equal(m.getSessionId(),'old-session');m.trackPageView();m.optOutOfAnalytics();assert.equal(m.getSessionId(),null)
 await new Promise(r=>setTimeout(r,0));assert.equal(sent.length,0)
})
for(const privacy of [{doNotTrack:'1'},{globalPrivacyControl:true}])test('browser privacy flag suppresses existing session attribution '+JSON.stringify(privacy),async t=>{
 const {module:m}=await setup(t,{getItem:()=> 'existing-session'},privacy);assert.equal(m.getSessionId(),null)
})
