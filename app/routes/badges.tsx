import { json, LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { makeBadge } from "badge-maker";
import { fetchJson } from "~/assets/common";
import { getEnv } from "~/assets/server";

interface BadgeData {
	enabled: boolean;
	url?: string;
	image?: any;
	fetchData: () => Promise<any>;
}

const HOST = getEnv("HOST");
const badges: BadgeData[] = [
	{
		enabled: !!HOST,
		url: `https://developer.mozilla.org/en-US/observatory/analyze?host=${HOST}`,
		async fetchData() {
			const json = await fetchJson(
				`https://observatory-api.mdn.mozilla.net/api/v2/analyze?host=${HOST}`,
			);

			const grade = json.history.pop();

			let color;
			if (85 <= grade.score) {
				color = "brightgreen";
			} else if (65 <= grade.score) {
				color = "yellow";
			} else {
				color = "red";
			}

			const format = {
				label: "Observatory",
				message: `${grade.grade} (${grade.score})`,
				color,
			};

			return `data:image/svg+xml;base64,` + btoa(makeBadge(format));
		},
	},
];

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
		{ property: "og:title", content: "New Remix App" },
		{ property: "og:description", content: "Welcome to Remix!" },
		{ property: "og:image", content: "/Nyaarium%20Logo.png" },
		{ property: "og:url", content: "Canonical URL of the page" },
		{
			"script:ld+json": {
				"@context": "https://schema.org",
				"@type": "Organization",
				"name": "Atelier Nyaarium",
				"url": "https://nyaarium.com",
			},
		},
	];
};

export async function loader({ request }: LoaderFunctionArgs) {
	const ret: any[] = [];

	for (const badge of badges) {
		if (!badge.enabled) continue;

		if (!badge.image) {
			try {
				console.log(`Fetching badge for: ${badge.url}`);

				badge.image = await badge.fetchData();
			} catch (error) {
				badge.enabled = false;
				console.error("Error fetching badge", error);
				continue;
			}
		}

		ret.push({
			url: badge.url,
			image: badge.image,
		});
	}

	// const url = new URL(request.url);
	// const data = JSON5.parse(url.searchParams.get("data") ?? "{}");

	try {
		return json(ret);
	} catch (error: any) {
		return json({ error: error.message });
	}
}
