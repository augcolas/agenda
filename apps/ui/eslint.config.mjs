import eslintReactConfig from '@agenda/eslint-config/react.js';

export default [
  ...eslintReactConfig,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  }
];
