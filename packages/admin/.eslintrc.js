module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'no-console': process.env.VUE_APP_MODE === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.VUE_APP_MODE === 'production' ? 'warn' : 'off',
    'import/extensions': 'off',
    'class-methods-use-this': 'off',
    'prefer-regex-literals': 'off',
    'no-return-assign': 'off',
    'implicit-arrow-linebreak': 'off',
    'operator-linebreak': 'off',
    'no-param-reassign': 'off',
    'vue/no-unused-components': 'off',
    'vuejs-accessibility/no-autofocus': 'off',
    'linebreak-style': 'off',
  },
};
