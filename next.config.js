const { merge } = require("lodash");
const {
	PHASE_DEVELOPMENT_SERVER,
	PHASE_PRODUCTION_BUILD,
	PHASE_PRODUCTION_SERVER,
} = require("next/constants");

module.exports = (phase, { defaultConfig }) => {
	const config = { ...defaultConfig, poweredByHeader: false };

	switch (phase) {
		case PHASE_DEVELOPMENT_SERVER:
			merge(config, {
				//
			});
			break;
		case PHASE_PRODUCTION_BUILD:
			merge(config, {
				output: "standalone",

				eslint: {
					ignoreDuringBuilds: true,
				},

				headers,
			});
			break;
		case PHASE_PRODUCTION_SERVER:
			merge(config, {
				headers,
			});
			break;
	}

	return config;
};

async function headers() {
	return [
		{
			source: "/(.*)",
			headers: [
				{
					key: "Content-Security-Policy",
					value: Object.entries({
						"default-src": ["'none'"],
						"script-src": ["'self'"],
						"connect-src": ["'self'"],
						"style-src": [
							"'self'",
							"'unsafe-inline'", // Is this needed?
							"https://cdn.jsdelivr.net/npm/react-image-gallery/styles/css/image-gallery.css",
						],
						"font-src": ["'self'", "data:", "blob:"],
						"img-src": ["'self'", "data:", "blob:"],
						"media-src": ["'self'", "data:", "blob:"],
						"worker-src": ["'self'"],
						"form-action": ["'self'"],
						"base-uri": ["'self'"],
						"frame-ancestors": ["'self'"],
					})
						.map(([k, v]) => `${k} ${v.join(" ")}`)
						.join("; "),
				},
				{
					key: "Referrer-Policy",
					value: "same-origin",
				},
				{
					key: "Strict-Transport-Security",
					value: "max-age=31536000; includeSubDomains; preload",
				},
				{
					key: "X-Content-Type-Options",
					value: "nosniff",
				},
				{ key: "X-Frame-Options", value: "SAMEORIGIN" },
				{
					key: "X-XSS-Protection",
					value: "1; mode=block",
				},
			],
		},
	];
}
