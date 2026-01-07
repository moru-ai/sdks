import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  plugins: [
    {
      name: 'hbs-raw',
      enforce: 'pre',
      transform(code: string, id: string) {
        if (id.endsWith('.hbs')) {
          return {
            code: `export default ${JSON.stringify(code)};`,
            map: null,
          }
        }
        return null
      },
    },
  ],
  test: {
    globals: false,
    environment: 'node',
    testTimeout: 30_000,
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'testground'],
    globalSetup: ['tests/setup.ts'],
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },
})
