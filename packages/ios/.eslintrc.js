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
    'import/no-unresolved': 'off',
    'no-underscore-dangle': 'off',
    'import/extensions': 'off',
    'no-param-reassign': 'off',
    'vue/valid-v-slot': 'off',
    'vue/no-mutating-props': 'off',
    'vuejs-accessibility/no-autofocus': 'off',
    'vue/no-computed-properties-in-data': 'off',
    'class-methods-use-this': 'off',
    'linebreak-style': 'off',
  },
};
