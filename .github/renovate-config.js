module.exports = {
	repositories: ["atelier-nyaarium/nyaakube"],
	platform: "github",
	onboarding: false,
	requireConfig: false,
	docker: {
		enabled: true,
	},
	npm: {
		enabled: true,
		packageRules: [
			{
				matchUpdateTypes: ["minor", "patch"],
				automerge: true,
			},
		],
	},
	packageRules: [
		{
			packagePatterns: ["react", "react-dom"],
			groupName: "react",
		},
		{
			packagePatterns: ["next", "eslint-config-next"],
			groupName: "nextjs",
		},
		{
			packagePatterns: ["@remix-run/*"],
			groupName: "remix",
		},
		{
			packagePatterns: ["@mui/material", "@mui/icons-material"],
			groupName: "material-ui",
		},
		{
			packagePatterns: ["@emotion/*"],
			groupName: "emotion",
		},
		{
			packagePatterns: ["@mikro-orm/*"],
			groupName: "mikro-orm",
		},
		{
			packagePatterns: ["@typescript-eslint/eslint-plugin", "@typescript-eslint/parser"],
			groupName: "eslint",
		},
		{
			matchPackagePatterns: ["^github-actions/.*"],
			groupName: "github-actions",
			automerge: true,
		},
		{
			matchDatasources: ["docker"],
			groupName: "docker",
			automerge: true,
		},
	],
};
