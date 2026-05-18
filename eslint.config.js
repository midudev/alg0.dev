import stylistic from '@stylistic/eslint-plugin'
import n from 'eslint-plugin-n'
import promise from 'eslint-plugin-promise'
import globals from 'globals'

const rules = {
  'no-var': ['warn'],
  'object-shorthand': ['warn', 'properties'],
  'accessor-pairs': ['error', {
    enforceForTSTypes: false,
    enforceForClassMembers: true,
    getWithoutSet: false,
    setWithoutGet: true
  }],
  'array-callback-return': ['error', {
    allowImplicit: false,
    checkForEach: false,
    allowVoid: false
  }],
  camelcase: ['error', {
    allow: ['^UNSAFE_'],
    ignoreDestructuring: false,
    ignoreGlobals: true,
    ignoreImports: false,
    properties: 'never'
  }],
  'constructor-super': ['error'],
  curly: ['error', 'multi-line'],
  'default-case-last': ['error'],
  'dot-notation': ['off', {
    allowKeywords: true,
    allowPattern: ''
  }],
  eqeqeq: ['error', 'always', { null: 'ignore' }],
  'new-cap': ['error', {
    capIsNew: false,
    capIsNewExceptions: ['Array', 'Boolean', 'Date', 'Error', 'Function', 'Number', 'Object', 'RegExp', 'String', 'Symbol', 'BigInt'],
    newIsCap: true,
    newIsCapExceptions: [],
    properties: true
  }],
  'no-array-constructor': ['error'],
  'no-async-promise-executor': ['error'],
  'no-caller': ['error'],
  'no-case-declarations': ['error'],
  'no-class-assign': ['error'],
  'no-compare-neg-zero': ['error'],
  'no-cond-assign': ['error', 'except-parens'],
  'no-const-assign': ['error'],
  'no-constant-condition': ['error', { checkLoops: false }],
  'no-control-regex': ['error'],
  'no-debugger': ['error'],
  'no-delete-var': ['error'],
  'no-dupe-args': ['error'],
  'no-dupe-class-members': ['error'],
  'no-dupe-keys': ['error'],
  'no-duplicate-case': ['error'],
  'no-useless-backreference': ['error'],
  'no-empty': ['error', { allowEmptyCatch: true }],
  'no-empty-character-class': ['error'],
  'no-empty-pattern': ['error', { allowObjectPatternsAsParameters: false }],
  'no-eval': ['error', { allowIndirect: false }],
  'no-ex-assign': ['error'],
  'no-extend-native': ['error', { exceptions: [] }],
  'no-extra-bind': ['error'],
  'no-extra-boolean-cast': ['error', {}],
  'no-fallthrough': ['error', {
    allowEmptyCase: false,
    reportUnusedFallthroughComment: false
  }],
  'no-func-assign': ['error'],
  'no-global-assign': ['error', { exceptions: [] }],
  'no-implied-eval': ['error'],
  'no-import-assign': ['error'],
  'no-invalid-regexp': ['error', {}],
  'no-irregular-whitespace': ['error', {
    skipComments: false,
    skipJSXText: false,
    skipRegExps: false,
    skipStrings: true,
    skipTemplates: false
  }],
  'no-iterator': ['error'],
  'no-labels': ['error', {
    allowLoop: false,
    allowSwitch: false
  }],
  'no-lone-blocks': ['error'],
  'no-loss-of-precision': ['error'],
  'no-misleading-character-class': ['error', { allowEscape: false }],
  'no-prototype-builtins': ['error'],
  'no-useless-catch': ['error'],
  'no-multi-str': ['error'],
  'no-new': ['error'],
  'no-new-func': ['error'],
  'no-object-constructor': ['error'],
  'no-new-native-nonconstructor': ['error'],
  'no-new-wrappers': ['error'],
  'no-obj-calls': ['error'],
  'no-octal': ['error'],
  'no-octal-escape': ['error'],
  'no-proto': ['error'],
  'no-redeclare': ['error', { builtinGlobals: false }],
  'no-regex-spaces': ['error'],
  'no-return-assign': ['error', 'except-parens'],
  'no-self-assign': ['error', { props: true }],
  'no-self-compare': ['error'],
  'no-sequences': ['error', { allowInParentheses: true }],
  'no-shadow-restricted-names': ['error', { reportGlobalThis: false }],
  'no-sparse-arrays': ['error'],
  'no-template-curly-in-string': ['error'],
  'no-this-before-super': ['error'],
  'no-throw-literal': ['error'],
  'no-undef': ['error', { typeof: false }],
  'no-undef-init': ['error'],
  'no-unexpected-multiline': ['error'],
  'no-unmodified-loop-condition': ['error'],
  'no-unneeded-ternary': ['error', { defaultAssignment: false }],
  'no-unreachable': ['error'],
  'no-unreachable-loop': ['error', { ignore: [] }],
  'no-unsafe-finally': ['error'],
  'no-unsafe-negation': ['error', { enforceForOrderingRelations: false }],
  'no-unused-expressions': ['error', {
    allowShortCircuit: true,
    allowTernary: true,
    allowTaggedTemplates: true,
    enforceForJSX: false,
    ignoreDirectives: false
  }],
  'no-unused-vars': ['error', {
    args: 'none',
    caughtErrors: 'none',
    ignoreRestSiblings: true,
    vars: 'all'
  }],
  'no-use-before-define': ['error', {
    classes: false,
    functions: false,
    variables: false,
    allowNamedExports: false,
    enums: true,
    typedefs: true,
    ignoreTypeReferences: true
  }],
  'no-useless-call': ['error'],
  'no-useless-computed-key': ['error', { enforceForClassMembers: true }],
  'no-useless-constructor': ['error'],
  'no-useless-escape': ['error', { allowRegexCharacters: [] }],
  'no-useless-rename': ['error', {
    ignoreDestructuring: false,
    ignoreImport: false,
    ignoreExport: false
  }],
  'no-useless-return': ['error'],
  'no-void': ['error', { allowAsStatement: false }],
  'no-with': ['error'],
  'one-var': ['error', { initialized: 'never' }],
  'prefer-const': ['error', {
    destructuring: 'all',
    ignoreReadBeforeAssign: false
  }],
  'prefer-promise-reject-errors': ['error', { allowEmptyReject: false }],
  'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
  'symbol-description': ['error'],
  'unicode-bom': ['error', 'never'],
  'use-isnan': ['error', {
    enforceForIndexOf: true,
    enforceForSwitchCase: true
  }],
  'valid-typeof': ['error', { requireStringLiterals: true }],
  yoda: ['error', 'never', {
    exceptRange: false,
    onlyEquality: false
  }],
  'n/handle-callback-err': ['error', '^(err|error)$'],
  'n/no-callback-literal': ['error'],
  'n/no-deprecated-api': ['warn'],
  'n/no-exports-assign': ['error'],
  'n/no-new-require': ['error'],
  'n/no-path-concat': ['error'],
  'n/process-exit-as-throw': ['error'],
  'promise/param-names': ['error'],
  '@stylistic/array-bracket-spacing': ['error', 'never'],
  '@stylistic/arrow-spacing': ['error', {
    before: true,
    after: true
  }],
  '@stylistic/block-spacing': ['error', 'always'],
  '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
  '@stylistic/comma-dangle': ['warn', {
    arrays: 'ignore',
    enums: 'ignore',
    exports: 'ignore',
    imports: 'ignore',
    objects: 'ignore'
  }],
  '@stylistic/comma-spacing': ['error', {
    before: false,
    after: true
  }],
  '@stylistic/comma-style': ['error', 'last'],
  '@stylistic/computed-property-spacing': ['error', 'never', { enforceForClassMembers: true }],
  '@stylistic/dot-location': ['error', 'property'],
  '@stylistic/eol-last': ['error'],
  '@stylistic/function-call-spacing': ['error', 'never'],
  '@stylistic/generator-star-spacing': ['error', {
    before: true,
    after: true
  }],
  '@stylistic/indent': ['error', 2, {
    SwitchCase: 1,
    VariableDeclarator: 1,
    outerIIFEBody: 1,
    MemberExpression: 1,
    FunctionDeclaration: {
      parameters: 1,
      body: 1
    },
    FunctionExpression: {
      parameters: 1,
      body: 1
    },
    CallExpression: { arguments: 1 },
    ArrayExpression: 1,
    ObjectExpression: 1,
    ImportDeclaration: 1,
    flatTernaryExpressions: false,
    ignoreComments: false,
    ignoredNodes: ['TemplateLiteral *', 'JSXElement', 'JSXElement > *', 'JSXAttribute', 'JSXIdentifier', 'JSXNamespacedName', 'JSXMemberExpression', 'JSXSpreadAttribute', 'JSXExpressionContainer', 'JSXOpeningElement', 'JSXClosingElement', 'JSXFragment', 'JSXOpeningFragment', 'JSXClosingFragment', 'JSXText', 'JSXEmptyExpression', 'JSXSpreadChild'],
    offsetTernaryExpressions: true,
    tabLength: 4
  }],
  '@stylistic/key-spacing': ['error', {
    beforeColon: false,
    afterColon: true
  }],
  '@stylistic/keyword-spacing': ['error', {
    before: true,
    after: true
  }],
  '@stylistic/lines-between-class-members': ['error', 'always', {
    exceptAfterSingleLine: true,
    exceptAfterOverload: true
  }],
  '@stylistic/multiline-ternary': ['error', 'always-multiline'],
  '@stylistic/new-parens': ['error'],
  '@stylistic/no-extra-parens': ['error', 'functions'],
  '@stylistic/no-floating-decimal': ['error'],
  '@stylistic/no-mixed-operators': ['error', {
    groups: [['==', '!=', '===', '!==', '>', '>=', '<', '<='], ['&&', '||'], ['in', 'instanceof']],
    allowSamePrecedence: true
  }],
  '@stylistic/no-mixed-spaces-and-tabs': ['error'],
  '@stylistic/no-multi-spaces': ['error', {
    ignoreEOLComments: true,
    includeTabs: true
  }],
  '@stylistic/no-multiple-empty-lines': ['error', {
    max: 1,
    maxBOF: 0,
    maxEOF: 0
  }],
  '@stylistic/no-tabs': ['error'],
  '@stylistic/no-trailing-spaces': ['error'],
  '@stylistic/no-whitespace-before-property': ['error'],
  '@stylistic/object-curly-newline': ['error', {
    multiline: true,
    consistent: true
  }],
  '@stylistic/object-curly-spacing': ['error', 'always'],
  '@stylistic/object-property-newline': ['error', { allowAllPropertiesOnSameLine: false }],
  '@stylistic/operator-linebreak': ['error', 'after', {
    overrides: {
      '?': 'before',
      ':': 'before',
      '|>': 'before'
    }
  }],
  '@stylistic/padded-blocks': ['error', {
    blocks: 'never',
    switches: 'never',
    classes: 'never'
  }],
  '@stylistic/quote-props': ['error', 'as-needed'],
  '@stylistic/quotes': ['error', 'single', {
    avoidEscape: true,
    allowTemplateLiterals: 'never'
  }],
  '@stylistic/rest-spread-spacing': ['error', 'never'],
  '@stylistic/semi': ['error', 'never'],
  '@stylistic/semi-spacing': ['error', {
    before: false,
    after: true
  }],
  '@stylistic/space-before-blocks': ['error', 'always'],
  '@stylistic/space-before-function-paren': ['error', 'always'],
  '@stylistic/space-in-parens': ['error', 'never'],
  '@stylistic/space-infix-ops': ['error'],
  '@stylistic/space-unary-ops': ['error', {
    words: true,
    nonwords: false
  }],
  '@stylistic/spaced-comment': ['error', 'always', {
    line: { markers: ['*package', '!', '/', ',', '='] },
    block: {
      balanced: true,
      markers: ['*package', '!', ',', ':', '::', 'flow-include'],
      exceptions: ['*']
    }
  }],
  '@stylistic/template-curly-spacing': ['error', 'never'],
  '@stylistic/template-tag-spacing': ['error', 'never'],
  '@stylistic/wrap-iife': ['error', 'any', { functionPrototypeMethods: true }],
  '@stylistic/yield-star-spacing': ['error', 'both'],
}

export default [
  { ignores: ['dist/**'] },
  {
    files: ['**/*.{js,mjs,cjs}'],
    linterOptions: {
      reportUnusedDisableDirectives: 'warn',
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.es2021,
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      '@stylistic': stylistic,
      n,
      promise,
    },
    rules,
  },
]
