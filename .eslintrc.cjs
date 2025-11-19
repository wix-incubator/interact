module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
    jest: true
  },
  ignorePatterns: [
    '**/dist/**',
    '**/build/**',
    '**/node_modules/**',
    '**/*.d.ts',
    'coverage',
    '.eslintcache'
  ],
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
        'prettier'
      ],
      settings: {
        react: {
          version: 'detect'
        }
      },
      globals: {
        vi: 'readonly'
      },
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'no-async-promise-executor': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off'
      }
    },
    {
      files: ['**/*.{js,jsx}'],
      extends: ['eslint:recommended']
    }
  ]
};

