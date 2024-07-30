module.exports = {
	platform: "github",
	logLevel: "info",
	onboarding: false,
	requireConfig: false,
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
			packagePatterns: [
				"@typescript-eslint/eslint-plugin",
				"@typescript-eslint/parser",
			],
			groupName: "eslint",
		},
	],
	npm: {
		enabled: true,
		packageRules: [
			{
				matchUpdateTypes: ["minor", "patch"],
				automerge: true,
			},
		],
	},
	docker: {
		enabled: true,
	},
	schedule: [
		{
			// interval: "weekly",
			// day: "monday",
			interval: "daily",
			time: "10:00",
		},
	],
};
