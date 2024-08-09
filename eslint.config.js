import eslintJs from "@eslint/js";
import eslintReact from "eslint-plugin-react";
import globalTypes from "globals";
import eslintTs from "typescript-eslint";

const globals = {
	...globalTypes.node,
	...globalTypes.browser,

	React: "readonly",
	JSX: "readonly",
	NodeJS: "readonly",
};

// Shared rules for all files
const commonRules = {
	"no-empty-pattern": "off",
	"no-fallthrough": "off",
	"no-unused-vars": ["off", { args: "none", caughtErrors: "none", varsIgnorePattern: "^React$" }],
};

const jsRules = {
	...commonRules,
};

const tsRules = {
	...commonRules,

	"no-explicit-any": "off",
};

export default [
	{
		ignores: [
			//
			".eslintrc.js",
			"build/",
			"node_modules/",
			"tsconfig.json",
			"volumes/",
		],
	},

	// Instructions: https://github.com/typescript-eslint/typescript-eslint/pull/7935#issue-1994634097
	eslintJs.configs.recommended,

	{
		files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
		...eslintReact.configs.flat.recommended,
	},

	// JavaScript/JSX Configuration
	{
		files: ["**/*.{js,jsx}"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals,
		},
		plugins: {
			// react: eslintPluginReact,
		},
		rules: jsRules,
		settings: {
			react: {
				version: "detect",
			},
			formComponents: ["Form"],
			linkComponents: [
				{ name: "Link", linkAttribute: "to" },
				{ name: "NavLink", linkAttribute: "to" },
			],
		},
	},

	// TypeScript/TSX Configuration
	{
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals,
			parser: eslintTs.parser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
				project: "./tsconfig.json",
				tsconfigRootDir: process.cwd(),
			},
		},
		plugins: {
			// "@typescript-eslint": eslintTs.plugin,
		},
		rules: tsRules,
		settings: {
			react: {
				version: "detect",
			},
			formComponents: ["Form"],
			linkComponents: [
				{ name: "Link", linkAttribute: "to" },
				{ name: "NavLink", linkAttribute: "to" },
			],
		},
	},

	// Node.js Specific Configuration for Config Files
	// {
	// 	files: [".eslintrc.cjs"],
	// 	languageOptions: {
	// 		sourceType: "script",
	// 	},
	// 	env: {
	// 		node: true,
	// 	},
	// 	rules: {
	// 		strict: ["error", "global"],
	// 	},
	// },
];
