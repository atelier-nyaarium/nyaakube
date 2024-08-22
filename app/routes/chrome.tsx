import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { CSSProperties } from "react";
import { getEnv } from "~/assets/server";

export async function loader() {
	const origin = `https://${getEnv("PUBLIC_HOST") || "localhost:3000"}`;

	return json({
		origin,
	});
}

export const meta: MetaFunction = ({
	data, // Data from the loader
	location, // Location object
	params, // File name driven params: concerts.$city.$date.tsx
}: any) => {
	const title = `Chrome | Atelier Nyaarium`;
	const description = `Recommended Chrome Extensions`;
	const image = `/logos/nyaarium.webp`;
	const url = `${data.origin}/`;

	console.groupCollapsed(`Meta`);
	console.log(`Loader Data`, data);
	console.log(`Location`, location);
	console.log(`Params`, params);
	console.groupEnd();

	return [
		{ title },
		{ name: "description", content: description },
		{ property: "og:title", content: title },
		{ property: "og:description", content: description },
		{ property: "og:image", content: image },
		{ property: "og:url", content: url },

		{ tagName: "link", rel: "icon", content: "/favicon.ico" },
		{ tagName: "link", rel: "canonical", content: url },
	];
};

export default function PageChrome() {
	const links = [
		{
			name: `SponsorBlock`,
			url: `https://chromewebstore.google.com/detail/sponsorblock-for-youtube/mnjggcdmjocbbbhaepdhchncahnbgone`,
		},
		{
			name: `7TV`,
			url: `https://chromewebstore.google.com/detail/7tv/ammjkodgmmoknidbanneddgankgfejfh`,
		},
		{
			name: `Purple Ads Blocker`,
			url: `https://chromewebstore.google.com/detail/purple-ads-blocker/lkgcfobnmghhbhgekffaadadhmeoindg`,
		},
		{
			name: `The Camelizer`,
			url: `https://chromewebstore.google.com/detail/the-camelizer/ghnomdcacenbmilgjigehppbamfndblo`,
		},
		{
			name: `Consent-O-Matic`,
			url: `https://chromewebstore.google.com/detail/consent-o-matic/mdjildafknihdffpkfmmpnpoiajfjnjd`,
		},
		{
			name: `uBlock Origin`,
			url: `https://chromewebstore.google.com/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm`,
		},
	];

	// Invert if dark theme

	return (
		<>
			<div style={styles.root}>
				<div>
					<h3>Recommended Chrome Extensions:</h3>
				</div>
				{links.map((link) => (
					<Card key={link.url}>
						<CardActionArea href={link.url}>{link.name}</CardActionArea>
					</Card>
				))}
			</div>
		</>
	);
}

const styles: { [key: string]: CSSProperties } = {
	root: {
		margin: `16px`,
		display: `inline-flex`,
		flexDirection: `column`,
	},
	card: {
		display: `block`,
		flexGrow: 1,
		margin: `4px`,
		boxShadow: `0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)`,
		borderRadius: `4px`,
		backgroundColor: `rgba(127, 127, 127, 0.2)`,
	},
	cardActionArea: {
		padding: `16px`,
		display: `block`,
		textDecoration: "none",
		color: "inherit",
	},
};

const Card = ({ sx, children }: any) => (
	<div style={styles.card}>
		<div style={sx}>{children}</div>
	</div>
);

const CardActionArea = ({ href, onClick, children }: any) => (
	<a href={href} onClick={onClick} style={styles.cardActionArea}>
		{children}
	</a>
);
