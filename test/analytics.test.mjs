import test from 'node:test'
import assert from 'node:assert/strict'
import { analyticsAllowed, initAnalytics, trackPageView, optOutOfAnalytics } from '../src/scripts/analytics.ts'

test('restricted browser storage does not break page initialization or send analytics', (t) => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  t.after(() => {
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow)
    else delete globalThis.window
    if (originalNavigator) Object.defineProperty(globalThis, 'navigator', originalNavigator)
    else delete globalThis.navigator
  })
  const denied = () => { throw new Error('SecurityError: storage access denied') }
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {} })
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      localStorage: { getItem: denied },
      sessionStorage: { getItem: denied, setItem: denied },
      addEventListener() { assert.fail('analytics listeners should not be registered') },
    },
  })
  assert.equal(analyticsAllowed(), false)
  assert.doesNotThrow(() => initAnalytics())
  assert.doesNotThrow(() => trackPageView('Harbison Standard'))
})

test('opting out takes effect even when the browser refuses to save the preference', (t) => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  t.after(() => {
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow)
    else delete globalThis.window
    if (originalNavigator) Object.defineProperty(globalThis, 'navigator', originalNavigator)
    else delete globalThis.navigator
  })
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: {} })
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { localStorage: {
      getItem() { return null },
      setItem() { throw new Error('QuotaExceededError') },
    } },
  })
  assert.equal(analyticsAllowed(), true)
  assert.equal(optOutOfAnalytics(), false)
  assert.equal(analyticsAllowed(), false)
  assert.doesNotThrow(() => trackPageView('Harbison Standard'))
})
