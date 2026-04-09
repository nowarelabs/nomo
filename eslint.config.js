import tseslint from 'typescript-eslint';
import pluginImport from 'eslint-plugin-import';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/.vitest/**',
    ],
  },
  {
    plugins: {
      import: pluginImport,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
        Cloudflare: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        RequestInit: 'readonly',
        Headers: 'readonly',
        D1Database: 'readonly',
        DurableObjectStorage: 'readonly',
        DurableObjectStub: 'readonly',
        ExecutionContext: 'readonly',
        Fetcher: 'readonly',
        Cache: 'readonly',
        Crypto: 'readonly',
        CryptoKey: 'readonly',
        SubtleCrypto: 'readonly',
      },
    },
    rules: {
      'no-console': 'error',
      'no-debugger': 'error',
      'no-unused-vars': 'error',
      'no-restricted-exports': [
        'error',
        {
          restrictedNamedExports: ['default'],
        },
      ],
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-unresolved': 'off',
      'import/no-named-as-default': 'off',
    },
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
    },
  },
  {
    files: ['packages/logger/**/*.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['packages/assets/**/*.ts', 'packages/scripts/**/*.ts'],
    rules: {
      'no-console': 'off',
      'import/order': 'off',
    },
  },
  {
    files: ['packages/views/**/*.ts', 'packages/views/**/*.tsx'],
    rules: {
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    },
  },
  {
    files: ['packages/result/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'no-console': 'off',
    },
  },
  {
    files: ['packages/shared/**/*.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'import/order': 'off',
    },
  },
  {
    files: ['packages/jobs/**/*.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'import/order': 'off',
    },
  },
  {
    files: ['packages/router/**/*.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'import/order': 'off',
    },
  },
  {
    files: ['packages/sql/**/*.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'import/order': 'off',
    },
  },
  {
    files: ['packages/services/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'import/order': 'off',
    },
  },
  {
    files: ['packages/entrypoints/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'import/order': 'off',
    },
  },
  {
    files: ['packages/durable_objects/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'import/order': 'off',
    },
  },
  {
    files: ['packages/models/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'prefer-const': 'off',
      'import/order': 'off',
    },
  },
  {
    files: ['packages/migrations/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-console': 'off',
      'import/order': 'off',
    },
  },
  {
    files: ['packages/controllers/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'no-console': 'off',
      'import/order': 'off',
    },
  },
  {
    files: [
      'packages/validators/**/*.ts',
      'packages/formatters/**/*.ts',
      'packages/normalizers/**/*.ts',
      'packages/sql/**/*.ts',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    languageOptions: {
      globals: {
        vitest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
      },
    },
    rules: {
      'import/order': 'off',
    },
  }
);
