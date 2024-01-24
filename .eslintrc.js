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
		"prefer-arrow-callback": "warn",
		"prefer-const": "warn",
		"react-hooks/exhaustive-deps": [
			"warn",
			{ additionalHooks: "(useFetch|useLoadingCallback)" },
		],
		"security/detect-object-injection": "off",
	},
};