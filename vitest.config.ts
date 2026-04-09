import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['packages/*/src/**/*.test.ts', 'packages/*/src/**/*.spec.ts'],
    exclude: ['**/dist/**', '**/node_modules/**', '**/.turbo/**'],
    passWithNoTests: true,
    resolve: {
      alias: {
        'nomo/logger': path.resolve(__dirname, 'packages/logger/src/index.ts'),
        'nomo/sql': path.resolve(__dirname, 'packages/sql/src/index.ts'),
        'nomo/result': path.resolve(__dirname, 'packages/result/src/index.ts'),
      },
    },
  },
});
