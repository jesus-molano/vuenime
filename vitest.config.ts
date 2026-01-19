import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    projects: [
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/**/*.{test,spec}.ts'],
          environment: 'nuxt',
          environmentOptions: {
            nuxt: {
              rootDir: fileURLToPath(new URL('.', import.meta.url)),
              domEnvironment: 'happy-dom',
            },
          },
        },
      }),
    ],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['app/composables/**/*.ts', 'app/components/**/*.vue', 'app/stores/**/*.ts', 'app/utils/**/*.ts'],
      exclude: ['**/node_modules/**', '**/test/**', '**/*.d.ts'],
      thresholds: {
        lines: 50,
        functions: 50,
        branches: 40,
      },
    },
  },
})
