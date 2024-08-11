import { ok, strictEqual } from 'node:assert'
import { access, chmod, writeFile, realpath, symlink, unlink } from 'node:fs/promises'
import { after, afterEach, before, beforeEach, test } from 'node:test'
import { installLink, runAndReplaceLink, reportError } from 'link-bin-executable'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const exists = file => access(file).then(() => true, () => false)
const __dirname = dirname(fileURLToPath(import.meta.url))
const { platform, cwd } = process

const name = 'jsonlint'
const packageDirectory = join(__dirname, '..')
const binDirectory = join(__dirname, '..', 'node_modules', '.bin')
const link = join(binDirectory, name)
const executable = join(packageDirectory, name)
const script = `#!/bin/sh
echo "$*"`

async function cleanup() {
  join(__dirname, '..')
  // failed on Windows on GitHub
  if (platform === 'win32') return
  if (await exists(link)) unlink(link)
}

before(async () => {
  process.env.INIT_CWD = cwd()
  await writeFile(executable, script)
  await chmod(executable, 0o755)
  if (await exists(link)) await unlink(link)
})

beforeEach(cleanup)

afterEach(cleanup)

after(async () => {
  await unlink(executable)
})

if (platform !== 'win32') {
  test('installs a link to an inferred executable', async () => {
    await installLink({ name, packageDirectory, verbose: true })
    ok(await exists(link), 'link not found')
  })
}

test('installs a link to a specified executable', async () => {
  await installLink({ name, packageDirectory, executable })
  ok(await exists(link), 'link not found')
})

test('installs a specific link to a specified executable', async () => {
  await installLink({ linkNames: [name], packageDirectory, executable })
  ok(await exists(link), 'link not found')
})

test('installs a link over an existing link', async () => {
  await symlink(join(__dirname, 'stub.js'), link)
  await installLink({ name, packageDirectory, executable })
  ok(await exists(link), 'link not found')
})

if (platform !== 'win32') {
  test('replaces a link to a stub with a link to an inferred executable', async () => {
    await symlink(join(__dirname, 'stub.js'), link)
    await runAndReplaceLink({ name, scriptDirectory: __dirname, verbose: true })
    const path = await realpath(link)
    ok(path.endsWith(name))
  })

  test('replaces a link to a stub with a link to a specified executable', async () => {
    await symlink(join(__dirname, 'stub.js'), link)
    await runAndReplaceLink({ name, scriptDirectory: __dirname, executable })
    const path = await realpath(link)
    ok(path.endsWith(name))
  })

  test('replaces a specific link to a stub with a link to a specified executable', async () => {
    await symlink(join(__dirname, 'stub.js'), link)
    await runAndReplaceLink({ linkNames: [name], scriptDirectory: __dirname, executable })
    const path = await realpath(link)
    ok(path.endsWith(name))
  })
}

test('reports a general error', () => {
  reportError(new Error('test'))
  strictEqual(process.exitCode, 1)
  process.exitCode = 0
})

test('reports an error propagated from the child process', () => {
  reportError(2)
  strictEqual(process.exitCode, 2)
  process.exitCode = 0
})
