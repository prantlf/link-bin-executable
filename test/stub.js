#!/usr/bin/env node

import { runAndReplaceLink } from 'link-bin-executable'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

await runAndReplaceLink({ name: 'jsonlint', scriptDirectory: __dirname })
