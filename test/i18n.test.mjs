import test from 'node:test'
import assert from 'node:assert/strict'
import { langFromPath, pathFor, t } from '../src/i18n/index.ts'

test('Spanish pages are recognised by their /es prefix', () => {
  assert.equal(langFromPath('/'), 'en')
  assert.equal(langFromPath('/about'), 'en')
  assert.equal(langFromPath('/es'), 'es')
  assert.equal(langFromPath('/es/about'), 'es')
  // A path that merely starts with "es" is not Spanish.
  assert.equal(langFromPath('/estate'), 'en')
})

test('pathFor maps a page to its twin in the other language', () => {
  assert.equal(pathFor('/', 'es'), '/es')
  assert.equal(pathFor('/about', 'es'), '/es/about')
  assert.equal(pathFor('/es', 'en'), '/')
  assert.equal(pathFor('/es/about', 'en'), '/about')
  assert.equal(pathFor('/es/about/', 'en'), '/about')
  assert.equal(pathFor('/about', 'en'), '/about')
  assert.equal(pathFor('/es', 'es'), '/es')
})

test('the Spanish dictionary is really translated and keeps the same shape', () => {
  const en = t('en')
  const es = t('es')
  assert.notEqual(es.home.title, en.home.title)
  assert.notEqual(es.about.title, en.about.title)
  assert.notEqual(es.hero.line1, en.hero.line1)
  assert.equal(es.home.values.length, en.home.values.length)
  assert.equal(es.about.values.length, en.about.values.length)
  assert.match(es.home.playVideo('Taller'), /Taller/)
  assert.match(es.about.licenseLink('02059393'), /02059393/)
})
