const { ok } = require('assert')
const exported = require('../dist/index.cjs')

ok(typeof exported === 'object' && exported)
ok(typeof exported.installLink === 'function')
ok(typeof exported.runAndReplaceLink === 'function')
ok(typeof exported.reportError === 'function')
