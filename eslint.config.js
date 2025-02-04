import antfu from '@antfu/eslint-config';

export default antfu({
  stylistic: {
    semi: true,
    commaDangle: 'never',
    indent: 2,
    braceStyle: '1tbs',
    arrowParens: true,
  },
  formatters: true,
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'no-use-before-define': 'off',
  },
  // exclude examples dir
  ignores: [
    'test/*',
  ],
});
