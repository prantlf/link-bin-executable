interface InstallLinkOptions {
  /**
   * primary name of the symbolic link to create and default executable name
   */
  name?: string
  /**
   * names of the symbolic links to create; if not specified, `name` will be
   * created, otherwise only the specified names will be created
   */
  linkNames?: string[]
  /**
   * package directory where the postinstall script runs
   */
  packageDirectory: string
  /**
   * path to the executable to create the link to; if not specified, the file
   * named by `name` will be looked up in the package directory
   */
  executable?: string
  /**
   * log debug messages on the standard output instead of being enabled
   * by the DEBUG environment variable and log on the standard error
   */
  verbose?: boolean
}

/**
 * creates a symbolic link in the `.bin` directory to the executable available
 * usually in the package directory
 *
 * @param options see properties of `GrabOptions` for more information
 */
export function installLink(options: InstallLinkOptions): Promise<void>

interface RunAndReplaceLinkOptions {
  /**
   * primary name of the symbolic link to replace and default executable name
   */
  name?: string
  /**
   * names of the symbolic links to replace; if not specified, `name` will be
   * replaced, otherwise only the specified names will be replaced
   */
  linkNames?: string[]
  /**
   * bin directory where the javascript stub runs
   */
  scriptDirectory: string
  /**
   * path to the executable to create the link to; if not specified, the file
   * named by `name` will be looked up in the package directory
   */
  executable?: string
  /**
   * log debug messages on the standard output instead of being enabled
   * by the DEBUG environment variable and log on the standard error
   */
  verbose?: boolean
}

/**
 * replaces the just executed symbolic link to a javascript stub in the `.bin`
 * directory by a link to the executable available usually in the package
 * directory and delegates the process to the executable with the same arguments
 *
 * @param options see properties of `GrabOptions` for more information
 */
export function runAndReplaceLink(options: RunAndReplaceLinkOptions): Promise<void>

/**
 * prints the error message on the console and sets the process exit code
 * if `runAndReplaceLink` failed; supposed to be called from a catch block
 *
 * @param err error thrown from `runAndReplaceLink`
 */
export function reportError(err: Error)
