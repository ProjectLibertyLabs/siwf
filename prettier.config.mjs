// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/** @type {import("prettier").Config} */
const config = {
  arrowParens: 'always',
  bracketSpacing: true,
  endOfLine: 'auto',
  jsxSingleQuote: false,
  plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
  printWidth: 120,
  proseWrap: 'always',
  quoteProps: 'as-needed',
  semi: true,
  singleQuote: true,
  tailwindFunctions: ['clsx', 'cva'],
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
};

export default config;
