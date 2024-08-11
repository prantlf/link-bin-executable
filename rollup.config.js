import cleanup from 'rollup-plugin-cleanup'

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/index.cjs',
        format: 'cjs',
        sourcemap: true
      },
      {
        file: 'dist/index.mjs',
        sourcemap: true
      }
    ],
    external: [
      'node:child_process', 'debug', 'node:fs/promises', 'node:path'
    ],
    plugins: [cleanup()]
  }
]
