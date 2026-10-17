import test from 'node:test'
import assert from 'node:assert/strict'
import { recordedTraffic } from '../src/lib/server/analytics-data.ts'

test('website reports are isolated and count only recorded public page views', () => {
  const sessions = [
    {session_id:'standard',entry_path:'/',device_type:'desktop'},
    {session_id:'call',entry_path:'https://www.callharbison.com/contact',device_type:'mobile'},
    {session_id:'bot',entry_path:'/',device_type:'bot'},
    {session_id:'empty',entry_path:'/',device_type:'desktop'},
    {session_id:'admin',entry_path:'/hq',device_type:'desktop'},
  ]
  const visits = [
    {session_id:'standard',path:'/'}, {session_id:'standard',path:'/about'},
    {session_id:'call',path:'https://www.callharbison.com/contact'},
    {session_id:'call',path:'/'}, // Malformed cross-site record must not leak.
    {session_id:'bot',path:'/'}, {session_id:'admin',path:'/hq'},
    {session_id:'missing',path:'/'},
  ]
  const standard = recordedTraffic(sessions,visits,'harbison_standard')
  const call = recordedTraffic(sessions,visits,'call_harbison')
  assert.deepEqual(standard.sessions.map(s=>s.session_id),['standard'])
  assert.equal(standard.visits.length,2)
  assert.deepEqual(call.sessions.map(s=>s.session_id),['call'])
  assert.equal(call.visits.length,1)
})
