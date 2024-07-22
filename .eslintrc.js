/* OLD
module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true,
		jest: true,
	},
	root: true,
	ignorePatterns: [
		"/.eslintrc.js",
		"/app/",
		"/.next/",
		"/build/",
		"/coverage/",
		"/dist/",
		"/jest.config.mjs",
		"/next-env.d.ts",
		"/next.config.js",
		"/node_modules/",
		"/tsconfig.json",
		"/volumes/",
		"/webpack.config.js",
	],
	extends: [
		"eslint:recommended",
		"next",
		"next/core-web-vitals",
		"plugin:@typescript-eslint/recommended",
		"plugin:react/recommended",
		"plugin:react-hooks/recommended",
	],
	plugins: ["@typescript-eslint", "react", "security"],
	rules: {
		"@next/next/no-img-element": "off",
		"@typescript-eslint/no-explicit-any": "warn",
		"@typescript-eslint/no-unused-vars": ["warn", { args: "none" }],
		"no-case-declarations": "warn",
		"no-constant-condition": "off",
		"no-loss-of-precision": "warn",
		"no-undef": "error",
		"no-unused-vars": ["warn", { args: "none" }],
		"no-useless-escape": "warn",
		"no-var": "warn",
		"prefer-arrow-callback": "off",
		"prefer-const": "warn",
		"react-hooks/exhaustive-deps": [
			"warn",
			{ additionalHooks: "(useFetch|useLoadingCallback)" },
		],
		"security/detect-object-injection": "off",
	},
};
*/

/** @type {import('eslint').Linter.Config} */
module.exports = {
	root: true,
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		ecmaFeatures: {
			jsx: true,
		},
	},
	env: {
		browser: true,
		commonjs: true,
		es6: true,
	},
	ignorePatterns: [
		"/build/",
		"/node_modules/",
		"/volumes/",
		"/.eslintrc.js",
		"/tsconfig.json",
	],

	// Base config
	extends: ["eslint:recommended"],

	overrides: [
		// React
		{
			files: ["**/*.{js,jsx,ts,tsx}"],
			plugins: ["react", "jsx-a11y"],
			extends: [
				"plugin:react/recommended",
				"plugin:react/jsx-runtime",
				"plugin:react-hooks/recommended",
				"plugin:jsx-a11y/recommended",
			],
			rules: {
				"@typescript-eslint/no-unused-vars": ["warn", { args: "none" }],
			},
			settings: {
				"react": {
					version: "detect",
				},
				"formComponents": ["Form"],
				"linkComponents": [
					{ name: "Link", linkAttribute: "to" },
					{ name: "NavLink", linkAttribute: "to" },
				],
				"import/resolver": {
					typescript: {},
				},
			},
		},

		// Typescript
		{
			files: ["**/*.{ts,tsx}"],
			plugins: ["@typescript-eslint", "import"],
			parser: "@typescript-eslint/parser",
			settings: {
				"import/internal-regex": "^~/",
				"import/resolver": {
					node: {
						extensions: [".ts", ".tsx"],
					},
					typescript: {
						alwaysTryTypes: true,
					},
				},
			},
			extends: [
				"plugin:@typescript-eslint/recommended",
				"plugin:import/recommended",
				"plugin:import/typescript",
			],
		},

		// Node
		{
			files: [".eslintrc.cjs"],
			env: {
				node: true,
			},
		},
	],
};
