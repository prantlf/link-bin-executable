import { installLink, runAndReplaceLink, reportError } from 'link-bin-executable'

declare type testCallback = () => void
declare function test (label: string, callback: testCallback)

test('Type declarations for TypeScript', () => {
  installLink({
    packageDirectory: ''
  })
  installLink({
    name: '',
    linkNames: [''],
    packageDirectory: '',
    executable: '',
    verbose: true
  })

  runAndReplaceLink({
    scriptDirectory: ''
  })
  runAndReplaceLink({
    name: '',
    linkNames: [''],
    scriptDirectory: '',
    executable: '',
    verbose: true
  })

  reportError(new Error())
})
