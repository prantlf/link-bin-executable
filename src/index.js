import { spawn } from 'node:child_process'
import debug from 'debug'
import { lstat, symlink, unlink, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const exists = file => lstat(file).then(() => true, () => false)
let log = debug('linkbe')
const { platform } = process
const windows = platform === 'win32'

async function findExeOnRun(name, scriptDirectory) {
  /* c8 ignore next 5 */
  const exe = join(scriptDirectory, '..', windows ? `${name}.exe` : name)
  if (!await exists(exe)) {
    log('exe "%s"', exe)
    throw new Error('missing executable')
  }
  return exe
}

function runExe(exe) {
  const [,, ...args] = process.argv
  log('run "%s" with %d args', exe, args.length)
  return new Promise((resolve, reject) =>
    spawn(exe, args, { stdio: 'inherit' })
      .on('error', reject)
      /* c8 ignore next */
      .on('exit', code => code ? reject(code) : resolve())
  )
}

async function findBinOnRun(scriptDirectory) {
  // installed locally
  let bin = join(scriptDirectory, '..', '..', '.bin')
  log('local bin "%s"', bin)
  // installed globally
  if (!await exists(bin)) {
    bin = join(scriptDirectory, '..', '..', '..', '..', 'bin')
    log('global bin "%s"', bin)
    // installed dependencies of this package
    if (!await exists(bin)) {
      bin = join(scriptDirectory, '..', 'node_modules', '.bin')
      log('package bin "%s"', bin)
    }
    /* c8 ignore next */
    if (!await exists(bin)) throw new Error('cannot find bin directory')
  }
  return bin
}

async function replaceSymlink(bin, name, exe) {
  const link = join(bin, name)
  log('stat "%s"', link)
  const { mode } = await lstat(link)
  if (mode & 0o222) {
    log('unlink "%s"', link)
    await unlink(link)
    log('link "%s"', link)
    await symlink(exe, link)
    return true
  /* c8 ignore next 3 */
  }
    log('"%s" not writable', link)
}

/* c8 ignore next 45 */

async function replaceCmd(bin, name, exe) {
  const cmd = join(bin, `${name}.cmd`)
  log('stat "%s"', cmd)
  const { mode } = await lstat(cmd)
  if (mode & 0o222) {
    log('unlink "%s"', cmd)
    await unlink(cmd)
    log('write "%s"', cmd)
    await writeFile(cmd, `"${exe}" %*`)
    return true
  }
    log('"%s" not writable', cmd)
}

async function replacePs(bin, name, exe) {
  const ps = join(bin, `${name}.ps1`)
  log('stat "%s"', ps)
  const { mode } = await lstat(ps)
  if (mode & 0o222) {
    log('unlink "%s"', ps)
    await unlink(ps)
    log('write "%s"', ps)
    await writeFile(ps, `#!/usr/bin/env pwsh
if ($MyInvocation.ExpectingInput) {
  $input | & "${exe}" $args
} else {
  & "${exe}" $args
}
exit $LASTEXITCODE`)
    return true
  }
    log('"%s" not writable', ps)
}

function replaceCmdAndPs(bin, name, exe) {
  return Promise.all([
    replaceCmd(bin, name, exe),
    replacePs(bin, name, exe)
  ])
}

const replaceLink = windows ? replaceCmdAndPs : replaceSymlink

function replaceLinks(bin, linkNames, exe) {
  return Promise.all(linkNames.map(name => replaceLink(bin, name, exe)))
}

export async function runAndReplaceLink({ name, linkNames, executable, scriptDirectory, verbose }) {
  if (verbose) log = console.log.bind(console)
  if (!executable) executable = await findExeOnRun(name, scriptDirectory)
  const bin = await findBinOnRun(scriptDirectory)
  if (!linkNames) linkNames = [name]
  await replaceLinks(bin, linkNames, executable)
  await runExe(executable)
}

export function reportError(err) {
  let code
  if (typeof err !== 'number') {
    console.error(err)
    code = 1
  } else {
    code = err
  }
  process.exitCode = code
}

async function findBinOnInstall(scriptDirectory) {
  /* c8 ignore next */
  if (!process.env.INIT_CWD) throw new Error('not running during npm install')

  // installed locally
  let bin = join(scriptDirectory, '..', '.bin')
  log('local bin "%s"', bin)
  // installed globally
  if (!await exists(bin)) {
    bin = join(scriptDirectory, '..', '..', 'bin')
    log('global bin "%s"', bin)
    // installed dependencies of this package
    if (!await exists(bin)) {
      bin = join(scriptDirectory, 'node_modules', '.bin')
      log('package bin "%s"', bin)
    }
    /* c8 ignore next */
    if (!await exists(bin)) throw new Error('cannot find bin directory')
  }
  return bin
}

async function findExeOnInstall(name, packageDirectory) {
  /* c8 ignore next 5 */
  const exe = join(packageDirectory, windows ? `${name}.exe` : name)
  if (!await exists(exe)) {
    log('exe "%s"', exe)
    throw new Error('missing executable')
  }
  return exe
}

async function makeSymlink(bin, name, exe) {
  const link = join(bin, name)
  if (await exists(link)) {
    log('unlink "%s"', link)
    await unlink(link)
  }
  log('link "%s"', link)
  await symlink(exe, link)
}

/* c8 ignore next 35 */

async function makeCmd(bin, name, exe) {
  const cmd = join(bin, `${name}.cmd`)
  if (await exists(cmd)) {
    log('unlink "%s"', cmd)
    await unlink(cmd)
  }
  log('write "%s"', cmd)
  await writeFile(cmd, `"${exe}" %*`)
}

async function makePs(bin, name, exe) {
  const ps = join(bin, `${name}.ps1`)
  if (await exists(ps)) {
    log('unlink "%s"', ps)
    await unlink(ps)
  }
  log('write "%s"', ps)
  await writeFile(ps, `#!/usr/bin/env pwsh
if ($MyInvocation.ExpectingInput) {
  $input | & "${exe}" $args
} else {
  & "${exe}" $args
}
exit $LASTEXITCODE`)
}

function makeCmdAndPs(bin, name, exe) {
  return Promise.all([
    makeCmd(bin, name, exe),
    makePs(bin, name, exe)
  ])
}

const makeLink = windows ? makeCmdAndPs : makeSymlink

function makeLinks(bin, linkNames, exe) {
  return Promise.all(linkNames.map(name => makeLink(bin, name, exe)))
}

export async function installLink({ name, linkNames, executable, packageDirectory, verbose }) {
  if (verbose) log = console.log.bind(console)
  if (!executable) executable = await findExeOnInstall(name, packageDirectory)
  const bin = await findBinOnInstall(packageDirectory)
  if (!linkNames) linkNames = [name]
  await makeLinks(bin, linkNames, executable)
}
