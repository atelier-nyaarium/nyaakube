import AlignScreenMiddle from "@/components/AlignScreenMiddle";
import {
	Avatar,
	Card,
	CardActionArea,
	CardHeader,
	Typography,
} from "@mui/material";
import React from "react";

const styles = {
	navigationCard: {
		display: `inline-block`,
		margin: `4px`,
		width: `260px`,
	},
};

export default function PageIndex() {
	// Invert if dark theme
	const filter = `invert(1)`;

	return (
		<>
			<title>Index | Nyaarium</title>

			<AlignScreenMiddle>
				<Card sx={styles.navigationCard}>
					<CardHeader
						avatar={
							<Avatar
								src="files/logos/discord.png"
								sx={{
									borderRadius: "0",
									filter,
								}}
							/>
						}
						title={
							<Typography variant="h5">Nyaarium#0001</Typography>
						}
					/>
				</Card>

				<Card sx={styles.navigationCard}>
					<CardActionArea href="https://steam.nyaarium.com">
						<CardHeader
							avatar={
								<Avatar
									src="files/logos/steam.png"
									sx={{
										borderRadius: "0",
										filter,
									}}
								/>
							}
							title={<Typography variant="h5">Steam</Typography>}
						/>
					</CardActionArea>
				</Card>

				<Card sx={styles.navigationCard}>
					<CardActionArea href="https://chilloutvr.nyaarium.com">
						<CardHeader
							avatar={
								<Avatar
									src="files/logos/chilloutvr.png"
									sx={{
										borderRadius: "0",
										filter,
									}}
								/>
							}
							title={
								<Typography variant="h5">ChilloutVR</Typography>
							}
						/>
					</CardActionArea>
				</Card>

				<Card sx={styles.navigationCard}>
					<CardActionArea href="https://twitch.nyaarium.com">
						<CardHeader
							avatar={
								<Avatar
									src="files/logos/twitch.png"
									sx={{
										borderRadius: "0",
										filter,
									}}
								/>
							}
							title={<Typography variant="h5">Twitch</Typography>}
						/>
					</CardActionArea>
				</Card>

				<Card sx={styles.navigationCard}>
					<CardActionArea href="https://youtube.nyaarium.com">
						<CardHeader
							avatar={
								<Avatar
									src="files/logos/youtube.png"
									sx={{
										borderRadius: "0",
										filter,
									}}
								/>
							}
							title={
								<Typography variant="h5">Youtube</Typography>
							}
						/>
					</CardActionArea>
				</Card>

				<Card sx={styles.navigationCard}>
					<CardActionArea href="https://twitter.nyaarium.com">
						<CardHeader
							avatar={
								<Avatar
									src="files/logos/twitter.png"
									sx={{
										borderRadius: "0",
										filter,
									}}
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
