import { json, LoaderFunctionArgs } from "@remix-run/node";
import { makeBadge } from "badge-maker";
import { ExpiringCacheMap, fetchJson } from "~/assets/common";
import { getEnv } from "~/assets/server";

interface BadgeData {
	url: string;
	fetchData: () => Promise<any>;
}

interface BadgeJson {
	enabled: boolean;
	url: string;
	image: string;
}

let badgesDefs: { [key: string]: BadgeData };
let badges: ExpiringCacheMap<string, BadgeJson>;

export async function loader({ request }: LoaderFunctionArgs) {
	// const url = new URL(request.url);
	// const data = JSON5.parse(url.searchParams.get("data") ?? "{}");

	const enabledBadges = await getBadges();

	return json(
		enabledBadges.map(({ url, image }) => ({
			url,
			image,
		})),
	);
}

async function getBadges(): Promise<BadgeJson[]> {
	const ret: BadgeJson[] = [];

	if (!badgesDefs) {
		// Initialize maps
		initializeBadges();
	}

	for (const key in badgesDefs) {
		const badgeDef = badgesDefs[key];

		let badge: BadgeJson | undefined = badges.get(key);
		if (!badge) {
			try {
				console.log(`Fetching badge for: ${badgeDef.url}`);

				badge = {
					enabled: true,
					url: badgeDef.url,
					image: await badgeDef.fetchData(),
				};

				badges.set(key, badge);
			} catch (error) {
				console.error("Error fetching badge", error);

				badge = {
					enabled: false,
					url: badgeDef.url,
					image: "--",
				};

				badges.set(key, badge);
				continue;
			}
		}

		if (badge.enabled) {
			ret.push(badge!);
		}
	}

	return ret;
}

function initializeBadges(): void {
	badgesDefs = {};
	badges = new ExpiringCacheMap<string, BadgeJson>({
		keepAliveOnGet: false,
		ttl: 24 * 60 * 60 * 1000, // 24 hours
	});

	const PUBLIC_HOST = getEnv("PUBLIC_HOST");
	if (PUBLIC_HOST) {
		badgesDefs.observatory = {
			url: `https://developer.mozilla.org/en-US/observatory/analyze?host=${PUBLIC_HOST}`,
			async fetchData() {
				const json = await fetchJson(
					`https://observatory-api.mdn.mozilla.net/api/v2/analyze?host=${PUBLIC_HOST}`,
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
					message: `${grade.grade}`,
					color,
				};

				return `data:image/svg+xml;base64,` + btoa(makeBadge(format));
			},
		};
	}
}
