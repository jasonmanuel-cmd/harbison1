import { test } from 'node:test'
import assert from 'node:assert/strict'
import { authorizedCrmCheck, saveToSharedCrm, verifySharedCrm } from '../src/lib/server/shared-crm.ts'

const id = '00000000-0000-4000-8000-000000000001'
const config = { url: 'https://www.callharbison.com/api/intake', secret: 'test-only-secret-longer-than-32-characters' }

test('Standard sends authenticated brand and form context and requires confirmed CRM storage', async () => {
  const result = await saveToSharedCrm({ name: 'Test Buyer', desired_area: 'Tehachapi', message: 'Please call' }, id, config, async (url, init) => {
    assert.equal(String(url), config.url)
    assert.equal(init.headers.Authorization, `Bearer ${config.secret}`)
    const payload = JSON.parse(init.body)
    assert.equal(payload.brand, 'harbison_standard')
    assert.equal(payload.lead.desired_area, 'Tehachapi')
    assert.equal(payload.lead.message, 'Please call')
    assert.equal(init.redirect, 'error')
    return Response.json({ ok: true, stored: true, id })
  })
  assert.deepEqual(result, { id, duplicate: false })
})

test('Standard rejects incomplete config, insecure destinations, false success and wrong submission IDs', async () => {
  await assert.rejects(saveToSharedCrm({}, id, { url: config.url }), /configured/)
  await assert.rejects(saveToSharedCrm({}, id, { ...config, url: 'http://remote.example/intake' }), /HTTPS/)
  for (const reply of [{ ok: true }, { ok: true, stored: false }, { ok: true, stored: true, id: 'wrong' }]) {
    await assert.rejects(saveToSharedCrm({}, id, config, async () => Response.json(reply)), /confirm/)
  }
  await assert.rejects(saveToSharedCrm({}, id, config, async () => Response.json({ ok: false }, { status: 502 })), /confirm/)
})

test('private diagnostic requires the shared secret and confirms safe downstream cleanup', async () => {
  assert.equal(authorizedCrmCheck(null, config.secret), false)
  assert.equal(authorizedCrmCheck('Bearer wrong', config.secret), false)
  assert.equal(authorizedCrmCheck(`Bearer ${config.secret}`, config.secret), true)
  await verifySharedCrm(config, async (_url, init) => {
    assert.deepEqual(JSON.parse(init.body), { kind: 'verify' })
    return Response.json({ ok: true, verified: true, cleaned: true })
  })
  await assert.rejects(verifySharedCrm(config, async () => Response.json({ ok: true, verified: true, cleaned: false })), /failed/)
})
