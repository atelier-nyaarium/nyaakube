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
			labels: ["dependencies"],
		},
		{
			packagePatterns: ["next", "eslint-config-next"],
			groupName: "nextjs",
			labels: ["dependencies"],
		},
		{
			packagePatterns: ["@remix-run/*"],
			groupName: "remix",
			labels: ["dependencies"],
		},
		{
			packagePatterns: ["@mui/material", "@mui/icons-material"],
			groupName: "material-ui",
			labels: ["dependencies"],
		},
		{
			packagePatterns: ["@emotion/*"],
			groupName: "emotion",
			labels: ["dependencies"],
		},
		{
			packagePatterns: ["@mikro-orm/*"],
			groupName: "mikro-orm",
			labels: ["dependencies"],
		},
		{
			packagePatterns: ["@typescript-eslint/eslint-plugin", "@typescript-eslint/parser"],
			groupName: "eslint",
			labels: ["dependencies"],
		},
		{
			matchPackagePatterns: ["^github-actions/.*"],
			groupName: "github-actions",
			automerge: true,
			labels: ["dependencies"],
		},
		{
			matchDatasources: ["docker"],
			groupName: "docker",
			automerge: true,
			labels: ["dependencies"],
		},
		{
			matchPackagePatterns: [".*"],
			matchPaths: [".github/workflows/*.yml"],
			groupName: "github-workflows",
			automerge: true,
			labels: ["dependencies"],
		},
	],
};