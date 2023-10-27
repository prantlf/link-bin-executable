#!/usr/bin/env node

import { runAndReplaceLink } from 'link-bin-executable'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

await runAndReplaceLink({ name: 'jsonlint', scriptDirectory: __dirname })
