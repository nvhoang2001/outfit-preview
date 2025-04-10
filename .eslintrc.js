module.exports = {
  root: true,
  extends: [
    '@react-native',
    'prettier',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: ['node_modules/**', 'dist/**'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: '.',
  },
  plugins: ['lingui', 'prettier', 'import', '@typescript-eslint'],
  rules: {},
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: ['./tsconfig.json'],
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            ignoreRestSiblings: true,
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
          },
        ],
        'prettier/prettier': [
          'warn',
          {},
          {
            usePrettierrc: true,
          },
        ],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
        'import/no-named-as-default': 'error',
        'import/no-unresolved': 'warn',
        'react/self-closing-comp': 'warn',
      },
      settings: {
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
            project: ['./tsconfig.json'],
          },
          'eslint-import-resolver-typescript': true,
        },
        'import/ignore': ['\\.svg?url$'],
        'import/order': [
          'error',
          {
            'newlines-between': 'always',
            groups: [
              ['builtin', 'external'],
              'type',
              'internal',
              ['parent', 'sibling', 'index', 'unknown'],
            ],
            pathGroups: [
              {
                pattern: '@/@types/**',
                group: 'type',
                position: 'before',
              },
              {
                pattern: '@/api/**',
                group: 'internal',
                position: 'before',
              },
              {
                pattern: '@/hooks/**',
                group: 'internal',
                position: 'before',
              },
              {
                pattern: '@/contexts/**',
                group: 'internal',
                position: 'before',
              },
              {
                pattern: '@/layouts/**',
                group: 'internal',
                position: 'before',
              },
              {
                pattern: '@/routes/**',
                group: 'internal',
                position: 'before',
              },
              {
                pattern: '@/pages/**/*',
                group: 'internal',
                position: 'before',
              },
              {
                pattern: '@/components/**',
                group: 'internal',
                position: 'before',
              },
              {
                pattern: '@/store/**',
                group: 'internal',
                position: 'before',
              },
              {
                pattern: '@/utils/**',
                group: 'internal',
                position: 'before',
              },
              {
                pattern: '@/constants/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '@/styles/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '@/assets/**',
                group: 'parent',
                position: 'after',
              },
              {
                pattern: '**/*.[css,scss]',
                group: 'sibling',
                position: 'after',
              },
            ],
            pathGroupsExcludedImportTypes: [],
            alphabetize: {
              order: 'asc',
              caseInsensitive: true,
            },
            warnOnUnassignedImports: true,
          },
        ],
      },
    },
  ],
};
