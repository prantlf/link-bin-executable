import { installLink, runAndReplaceLink, reportError } from 'link-bin-executable'

declare type testCallback = () => void
declare function test (label: string, callback: testCallback)

test('Type declarations for TypeScript', () => {
  installLink({
    name: '',
    packageDirectory: ''
  })
  installLink({
    name: '',
    packageDirectory: '',
    executable: ''
  })

  runAndReplaceLink({
    name: '',
    scriptDirectory: ''
  })
  runAndReplaceLink({
    name: '',
    scriptDirectory: '',
    executable: ''
  })

  reportError(new Error())
})
