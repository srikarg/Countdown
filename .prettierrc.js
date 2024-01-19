/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
  overrides: [
    {
      files: '**/*.svelte',
      options: {
        parser: 'svelte',
      },
    },
  ],
  arrowParens: 'avoid',
  bracketSpacing: true,
  printWidth: 80,
  proseWrap: 'always',
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
}
