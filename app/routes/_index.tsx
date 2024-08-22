import type { MetaFunction } from "@remix-run/node";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { CSSProperties, useEffect, useMemo } from "react";
import { getEnv } from "~/assets/server";
import { AlignScreenMiddle } from "~/components/AlignScreenMiddle";
import { useSnackbar } from "~/components/Snackbar";
import { useFetch } from "~/hooks/useFetch";

export async function loader({ request }: LoaderFunctionArgs) {
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
	const title = `Atelier Nyaarium`;
	const description = `Welcome to Atelier Nyaarium!`;
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

		{
			"script:ld+json": {
				"@context": "https://schema.org",
				"@type": "Organization",
				"name": `Atelier Nyaarium`,
				"url": data.origin,
			},
		},
	];
};

export default function PageIndex() {
	const [getBadges, badges] = useFetch(
		() => ({
			url: `/badges`,
		}),
		[],
	);
	useEffect(() => {
		getBadges();
	}, [getBadges]);

	const snackbar = useSnackbar();

	// Invert if dark theme
	const filterInvert = `invert(1)`;

	// SxProps<Theme>
	const sxLogoAuto = useMemo(
		() => ({
			borderRadius: "0",
			filter: filterInvert,
		}),
		[],
	);

	const sxLogoNormal = useMemo(
		() => ({
			borderRadius: "0",
		}),
		[],
	);

	return (
		<>
			<AlignScreenMiddle width="420px">
				<Card sx={styles.navigationTile}>
					<CardActionArea
						href="discord://-/users/164550341604409344"
						onClick={() => {
							snackbar({
								type: "info",
								message: `Opened in Discord`,
							});
						}}
					>
						<CardHeader
							avatar={<Avatar src="/logos/discord.webp" sx={sxLogoAuto} />}
							title={<Typography variant="h5">Nyaarium</Typography>}
						/>
					</CardActionArea>
				</Card>

				<Card sx={styles.navigationTile}>
					<CardActionArea href="https://github.com/nyaarium">
						<CardHeader
							avatar={<Avatar src="/logos/github.webp" sx={sxLogoAuto} />}
							title={<Typography variant="h5">GitHub</Typography>}
						/>
					</CardActionArea>
				</Card>

				<Card sx={styles.navigationTile}>
					<CardActionArea href="https://hub.abinteractive.net/social/profile?guid=09d90a90-f757-2042-d0bc-196a9ecd3a1b">
						<CardHeader
							avatar={<Avatar src="/logos/chilloutvr.webp" sx={sxLogoAuto} />}
							title={<Typography variant="h5">ChilloutVR</Typography>}
						/>
					</CardActionArea>
				</Card>

				<Card sx={styles.navigationTile}>
					<CardActionArea href="https://vrchat.com/home/user/usr_8c8467ca-7057-4c65-905e-3e62abb26adb">
						<CardHeader
							avatar={<Avatar src="/logos/vrchat.webp" sx={sxLogoNormal} />}
							title={<Typography variant="h5">VRChat</Typography>}
						/>
					</CardActionArea>
				</Card>

				<Card sx={styles.navigationTile}>
					<CardActionArea
						href="steam://url/SteamIDPage/76561199048616813"
						onClick={() => {
							snackbar({
								type: "info",
								message: `Opened in Steam`,
							});
						}}
					>
						<CardHeader
							avatar={<Avatar src="/logos/steam.webp" sx={sxLogoAuto} />}
							title={<Typography variant="h5">Steam</Typography>}
						/>
					</CardActionArea>
				</Card>

				{/* 
				<Card sx={styles.navigationTile}>
					<CardActionArea href="https://www.twitch.tv/Nyaarium/about">
						<CardHeader
							avatar={
								<Avatar
									src="/logos/twitch.webp"
									sx={sxLogoAuto}
								/>
							}
							title={<Typography variant="h5">Twitch</Typography>}
						/>
					</CardActionArea>
				</Card>
				*/}

				<Card sx={styles.navigationTile}>
					<CardActionArea href="https://x.com/nyaarium">
						<CardHeader
							avatar={<Avatar src="/logos/twitter.webp" sx={sxLogoAuto} />}
							title={<Typography variant="h5">Twitter</Typography>}
						/>
					</CardActionArea>
				</Card>
			</AlignScreenMiddle>

			<div style={styles.footerBadges}>
				{badges?.map((badge: any) => (
					<a key={badge.url} href={badge.url}>
						<img src={badge.image} alt="[badge]" />
					</a>
				))}
			</div>
		</>
	);
}

const styles: { [key: string]: CSSProperties } = {
	coreCard: {
		display: `inline-block`,
		margin: `4px`,
		boxShadow: `0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)`,
		borderRadius: `4px`,
		backgroundColor: `rgba(127, 127, 127, 0.2)`,
	},
	coreCardContent: {
		padding: `16px`,
	},

	navigationTile: {
		width: `170px`,
		fontSize: `1.4rem`,
	},

	footerBadges: {
		position: "absolute",
		bottom: "0",
		left: "8px",
	},
};

const Card = ({ sx, children }: any) => (
	<div style={styles.coreCard}>
		<div style={styles.coreCardContent}>
			<div style={sx}>{children}</div>
		</div>
	</div>
);

const CardHeader = ({ avatar, title }: any) => (
	<div style={{ display: "flex", alignItems: "center" }}>
		{avatar}
		<div style={{ marginLeft: "16px" }}>{title}</div>
	</div>
);

const CardActionArea = ({ href, onClick, children }: any) => (
	<a href={href} onClick={onClick} style={{ textDecoration: "none", color: "inherit" }}>
		{children}
	</a>
);

const Avatar = ({ src, sx }: any) => (
	<img src={src} style={{ width: "40px", height: "40px", borderRadius: "50%", ...sx }} alt="avatar" />
);

const Typography = ({ variant, children }: any) => {
	return <div>{children}</div>;
};
