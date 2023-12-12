# Link Executable to .bin

[![Latest version](https://img.shields.io/npm/v/link-bin-executable)
 ![Dependency status](https://img.shields.io/librariesio/release/npm/link-bin-executable)
](https://www.npmjs.com/package/link-bin-executable)
[![Coverage](https://codecov.io/gh/prantlf/link-bin-executable/branch/master/graph/badge.svg)](https://codecov.io/gh/prantlf/link-bin-executable)

Helps creating a symbolic link to a (binary) executable in `.bin` during a package postinstall phase.

Works well with [grab-github-release], if you want to download a binary executable from a GitHub release.

## Synopsis

A script to install to `.bin` by an entry in `bin` in `package.json`:

```js
#!/usr/bin/env node

import { runAndReplaceLink, reportError } from 'link-bin-executable'

try {
  await runAndReplaceLink({ name: 'myexecutable' })
} catch (err) {
  reportError(err)
}
```

A script to install to `.bin` by an entry in `scripts.postinstall` in `package.json`:

```js
import { installLink, reportError } from 'link-bin-executable'

try {
  await installLink({ name: 'myexecutable' })
} catch (err) {
  reportError(err)
}
```

## Installation

This package is usually installed as a local dependency:

```sh
$ npm i link-bin-executable
```

Make sure, that you use [Node.js] version 18 or newer.

## API

```ts
interface InstallLinkOptions {
  // primary name of the symbolic link to create and default executable name
  name?: string
  // names of the symbolic links to create; if not specified, `name` will be
  // created, otherwise only the specified names will be created
  linkNames?: string[]
  // package directory where the postinstall script runs
  packageDirectory: string
  // path to the executable to create the link to; if not specified, the file
  // named by `name` will be looked up in the package directory
  executable?: string
  // log debug messages on the standard output instead of being enabled
  // by the DEBUG environment variable and log on the standard error
  verbose?: boolean
}

// creates a symbolic link in the `.bin` directory to the executable available
// usually in the package directory
 *
// @param options see properties of `GrabOptions` for more information
export function installLink(options: InstallLinkOptions): Promise<void>

interface RunAndReplaceLinkOptions {
  // primary name of the symbolic link to replace and default executable name
  name?: string
  // names of the symbolic links to replace; if not specified, `name` will be
  // replaced, otherwise only the specified names will be replaced
  linkNames?: string[]
  // bin directory where the javascript stub runs
  scriptDirectory: string
  // path to the executable to create the link to; if not specified, the file
  // named by `name` will be looked up in the package directory
  executable?: string
  // log debug messages on the standard output instead of being enabled
  // by the DEBUG environment variable and log on the standard error
  verbose?: boolean
}

// replaces the just executed symbolic link to a javascript stub in the `.bin`
// directory by a link to the executable available usually in the package
// directory and delegates the process to the executable with the same arguments
 *
// @param options see properties of `GrabOptions` for more information
export function runAndReplaceLink(options: RunAndReplaceLinkOptions): Promise<void>

// prints the error message on the console and sets the process exit code
// if `runAndReplaceLink` failed; supposed to be called from a catch block
 *
// @param err error thrown from `runAndReplaceLink`
export function reportError(err: Error)
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.  Add unit tests for any new or changed functionality. Lint and test your code using Grunt.

## License

Copyright (c) 2023 Ferdinand Prantl

Licensed under the MIT license.

[Node.js]: http://nodejs.org/
[grab-github-release]: https://github.com/prantlf/grab-github-release
