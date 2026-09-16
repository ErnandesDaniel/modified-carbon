import classnames from "eslint-plugin-classnames";
import reactPerf from "eslint-plugin-react-perf";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import sortDestructureKeys from "eslint-plugin-sort-destructure-keys";
import sortKeysFix from "eslint-plugin-sort-keys-fix";
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import eslint from "@eslint/js";
import unusedImports from "eslint-plugin-unused-imports";
import tsEsLint from 'typescript-eslint';
import pluginReact from "eslint-plugin-react";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import stylistic from '@stylistic/eslint-plugin';
import lodash from 'eslint-plugin-lodash';
import globals from "globals";
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'


export default tsEsLint.config({
  ignores: [
    'src/api/spfx-portal/tags/**',
    'src/api/talent-review/index.ts',
    'src/api/rest-client/**',
    '**/orval.config.mjs',
    '**/mockServiceWorker.js',
    '**/eslint.config.mjs',
    '**/next-env.d.ts',
    '**/next.config.ts',
    '**/postcss.config.js',
    '**/assets.d.ts',
    '**/.browserslistrc',
    '**/node_modules/',
    '**/*.scss',
    '**/*.svg',
    '**/*.png',
    '**/*.webp',
    'orval.config.mjs',
    'public/mockServiceWorker.js'
  ],
  extends: [
    nextVitals,
    nextTs,
    eslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    eslintConfigPrettier,
    eslintPluginPrettierRecommended,
    reactPerf.configs.flat.recommended,
    eslintPluginUnicorn.configs.recommended
  ],
  files: ['**/*.mjs', '**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    globals: {
      ...globals.browser,
      ...globals.node,
      ...globals.builtin
    },
    parserOptions: {
      warnOnUnsupportedTypeScriptVersion: false,
      ecmaFeatures: {
        jsx: true
      },
      project: true,
      tsconfigRootDir: import.meta.dirname,
      parser: {
        js: '@babel/eslint-parser',
        jsx: '@babel/eslint-parser',
        ts: tsEsLint.parser,
        tsx: tsEsLint.parser
      }
    }
  },
  settings: {
    react: {
      version: '18.2.0'
    }
  },
  plugins: {
    '@stylistic': stylistic,
    'unused-imports': unusedImports,
    'simple-import-sort': simpleImportSort,
    'sort-destructure-keys': sortDestructureKeys,
    'sort-keys-fix': sortKeysFix,
    classnames: classnames,
    lodash: lodash
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-irregular-whitespace': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'arrow-body-style': ['error', 'as-needed'],
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true
        },

        AssignmentExpression: {
          array: true,
          object: false
        }
      },
      {
        enforceForRenamedProperties: false
      }
    ],
    'lodash/prefer-lodash-method': 'off',
    'lodash/prefer-lodash-typecheck': 'off',
    '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true }],
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-invalid-this': 'off',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/array-type': 'error',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/prefer-includes': 'error',
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports'
      }
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],

        custom: {
          regex: '^I[A-Z]',
          match: false
        }
      }
    ],
    'react/destructuring-assignment': 'error',
    'no-explicit-any': 'off',
    'unicorn/prefer-at': ['error'],
    'unicorn/prefer-string-replace-all': ['error'],
    'unicorn/no-nested-ternary': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-null': 'off',
    'unicorn/no-empty-file': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/prefer-module': 'off',
    'no-restricted-imports': [
      'error',
      {
        paths: ['lodash']
      }
    ],
    'import/no-unresolved': 'off',
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true
      }
    ],
    'prettier/prettier': [
      'error',
      {
        printWidth: 120,
        tabWidth: 2,
        useTabs: false,
        semi: true,
        singleQuote: true,
        quoteProps: 'as-needed',
        jsxSingleQuote: false,
        trailingComma: 'none',
        bracketSpacing: true,
        bracketSameLine: false,
        arrowParens: 'always',
        rangeStart: 0,
        requirePragma: false,
        insertPragma: false,
        proseWrap: 'preserve',
        htmlWhitespaceSensitivity: 'css',
        vueIndentScriptAndStyle: true,
        endOfLine: 'lf',
        embeddedLanguageFormatting: 'auto'
      }
    ],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'max-params': ['error', 6],
    'max-nested-callbacks': ['error', 5],
    'no-return-await': 'error',
    'sort-vars': [
      'error',
      {
        ignoreCase: false
      }
    ],
    'sort-keys': [
      'error',
      'asc',
      {
        caseSensitive: true,
        natural: false,
        minKeys: 2
      }
    ],
    'sort-destructure-keys/sort-destructure-keys': 2,
    'sort-keys-fix/sort-keys-fix': 'warn',
    'classnames/prefer-classnames-function': [
      'error',
      {
        maxSpaceSeparetedClasses: 20,
        functionName: 'clsx'
      }
    ],
    'react/jsx-no-useless-fragment': [
      'warn',
      {
        allowExpressions: true
      }
    ],
    'react/jsx-newline': [
      'error',
      {
        prevent: true
      }
    ],
    'react/jsx-sort-props': [
      2,
      {
        callbacksLast: true,
        shorthandFirst: true,
        shorthandLast: false,
        ignoreCase: true,
        noSortAlphabetically: false,
        multiline: 'last',
        reservedFirst: ['key', 'ref']
      }
    ],
    'react/jsx-curly-brace-presence': ['error'],
    '@stylistic/no-whitespace-before-property': ['error'],
    '@stylistic/jsx-self-closing-comp': [
      'error',
      {
        component: true,
        html: true
      }
    ],
    'react-hooks/set-state-in-effect': 'off',
    'react-hooks/purity': 'off',
    'react-hooks/refs': 'off',
    'no-redeclare': 'off',
    '@next/next/no-img-element': 'off'
  }
});


