import { spawn } from 'child_process'
import debug from 'debug'
import { lstat, symlink, unlink } from 'fs/promises'
import { join } from 'path'

const exists = file => lstat(file).then(() => true, () => false)
let log = debug('linkbe')
const { platform } = process

async function findExeOnRun(name, scriptDirectory) {
  /* c8 ignore next 5 */
  const exe = join(scriptDirectory, '..', platform != 'win32' ? name : `${name}.exe`)
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

async function replaceLink(bin, name, exe) {
  const link = join(bin, name)
  log('stat "%s"', link)
  const { mode } = await lstat(link)
  if (mode & 0o222) {
    log('unlink "%s"', link)
    await unlink(link)
    log('link "%s"', link)
    await symlink(exe, link, 'junction')
    return true
  /* c8 ignore next 3 */
  } else {
    log('not writable')
  }
}

function replaceLinks(bin, linkNames, exe) {
  return Promise.all(linkNames.map(name => replaceLink(bin, name, exe)))
}

export async function runAndReplaceLink({ name, linkNames, executable, scriptDirectory, verbose }) {
  if (verbose) log = console.log.bind(console)
  if (!executable) executable = await findExeOnRun(name, scriptDirectory)
  if (platform != 'win32') {
    const bin = await findBinOnRun(scriptDirectory)
    if (!linkNames) linkNames = [name]
    await replaceLinks(bin, linkNames, executable)
  }
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
  let bin = join(scriptDirectory, '..', 'node_modules', '.bin')
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
  const exe = join(packageDirectory, platform != 'win32' ? name : `${name}.exe`)
  if (!await exists(exe)) {
    log('exe "%s"', exe)
    throw new Error('missing executable')
  }
  return exe
}

async function makeLink(bin, name, exe) {
  const link = join(bin, name)
  if (await exists(link)) {
    log('unlink "%s"', link)
    await unlink(link)
  }
  log('link "%s"', link)
  await symlink(exe, link, 'junction')
}

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
