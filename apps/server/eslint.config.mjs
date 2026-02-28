import { base } from '@chatbot/eslint-config/base';

export default [
  {
    files: ['**/*.ts'],

    rules: {
      /* --- NestJS patterns --- */
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      /* --- Backend safety --- */
      'no-console': 'off', // NestJS logger is console-based
    },
  },

  ...base,
];
