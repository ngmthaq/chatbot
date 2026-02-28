import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export const base = [
  {
    ignores: ['**/dist/**', '**/node_modules/**'],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    plugins: {
      import: importPlugin,
    },

    rules: {
      /* --- Core hygiene --- */
      'no-console': 'warn',
      'no-debugger': 'error',

      /* --- TypeScript --- */
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      /* --- Imports --- */
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
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },

  eslintPluginPrettierRecommended,
];
