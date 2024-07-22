import type { MetaFunction } from "@remix-run/node";
import { CSSProperties, useMemo } from "react";
import { AlignScreenMiddle } from "~/components/AlignScreenMiddle";
import { useSnackbar } from "~/components/Snackbar";

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
		width: `240px`,
		fontSize: `1.5rem`,
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
	<a
		href={href}
		onClick={onClick}
		style={{ textDecoration: "none", color: "inherit" }}
	>
		{children}
	</a>
);

const Avatar = ({ src, sx }: any) => (
	<img
		src={src}
		style={{ width: "40px", height: "40px", borderRadius: "50%", ...sx }}
		alt="avatar"
	/>
);

const Typography = ({ variant, children }: any) => {
	return <div>{children}</div>;
};

export const meta: MetaFunction = () => {
	return [
		{ title: "Atelier Nyaarium" },
		{ name: "description", content: "Welcome to Atelier Nyaarium!" },

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

export default function PageIndex() {
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
			<title>Index | Nyaarium</title>

			<AlignScreenMiddle>
				<Card sx={styles.navigationTile}>
					<CardActionArea
						href="discord://-/users/164550341604409344"
						onClick={() => {
							snackbar({
								type: "info",
								message: `Opening Discord...`,
							});
						}}
					>
						<CardHeader
							avatar={
								<Avatar
									src="/logos/discord.png"
									sx={sxLogoAuto}
								/>
							}
							title={
								<Typography variant="h5">Nyaarium</Typography>
							}
						/>
					</CardActionArea>
				</Card>

				<Card sx={styles.navigationTile}>
					<CardActionArea href="https://github.com/nyaarium">
						<CardHeader
							avatar={
								<Avatar
									src="/logos/github.png"
									sx={sxLogoAuto}
								/>
							}
							title={<Typography variant="h5">GitHub</Typography>}
						/>
					</CardActionArea>
				</Card>

				<Card sx={styles.navigationTile}>
					<CardActionArea href="https://hub.abinteractive.net/social/profile?guid=09d90a90-f757-2042-d0bc-196a9ecd3a1b">
						<CardHeader
							avatar={
								<Avatar
									src="/logos/chilloutvr.png"
									sx={sxLogoAuto}
								/>
							}
							title={
								<Typography variant="h5">ChilloutVR</Typography>
							}
						/>
					</CardActionArea>
				</Card>

				<Card sx={styles.navigationTile}>
					<CardActionArea href="https://vrchat.com/home/user/usr_8c8467ca-7057-4c65-905e-3e62abb26adb">
						<CardHeader
							avatar={
								<Avatar
									src="/logos/vrchat.png"
									sx={sxLogoNormal}
								/>
							}
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
								message: `Opening Steam...`,
							});
						}}
					>
						<CardHeader
							avatar={
								<Avatar
									src="/logos/steam.png"
									sx={sxLogoAuto}
								/>
							}
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
									src="/logos/twitch.png"
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
							avatar={
								<Avatar
									src="/logos/twitter.png"
									sx={sxLogoAuto}
								/>
							}
							title={
								<Typography variant="h5">Twitter</Typography>
							}
						/>
					</CardActionArea>
				</Card>
			</AlignScreenMiddle>
		</>
	);
}
