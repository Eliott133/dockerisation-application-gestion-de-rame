module.exports = {
  env: {
    browser: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    'jest',
  ],
  globals: {
    APP_ENV_APP_PUBLIC_PATH: 'readonly',
    APP_ENV_APP_TITLE: 'readonly',
    APP_ENV_API_BASE_URL: 'readonly',
    fetchMock: 'readonly',
  },
  rules: {
    'no-console': ['error', {
      allow: ['warn', 'error'],
    }],
    'no-underscore-dangle': 'off',
    // 'react/prop-types': 'off',
  },
};
