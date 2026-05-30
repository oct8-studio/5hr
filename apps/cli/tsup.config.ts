import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  dts: false,
  clean: true,
  minify: true,
  // bundle workspace packages into single file — only node built-ins stay external
  noExternal: [/^@5hr\//],
  banner: {
    js: '#!/usr/bin/env node',
  },
})
