import test from 'node:test'
import assert from 'node:assert/strict'
import { hit } from '../src/lib/server/rate-limit.ts'
test('instance limiter is bounded and preserves active offender counts at capacity',()=>{
 const prefix='capacity-'+Date.now();for(let i=0;i<10000;i++)assert.equal(hit(prefix,String(i),1,60000).allowed,true)
 assert.equal(hit(prefix,'overflow',1,60000).allowed,false)
 assert.equal(hit(prefix,'0',1,60000).allowed,false)
})
