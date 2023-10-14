import { fetchJSON } from "@/assets/client";
import {
	Box,
	Button,
	Card,
	CardContent,
	CircularProgress,
	Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import ImageGallery from "react-image-gallery";

const styles = {
	centerAlignOuter: {
		display: `flex`,
		width: `100%`,
		alignItems: `center`,
		flexFlow: `column`,
	},
	centerAlignInner: {
		display: `flex`,
		height: `100vh`,
		alignItems: `center`,
		textAlign: `center`,
	},
};

export default function PageGallery() {
	const { isReady, query } = useRouter();

	const path = query.path || "/";

	const [readyStatus, setReadyStatus] = useState(false);
	const [listing, setListing] = useState([]);

	const fetchListing = useCallback(async (path) => {
		try {
			setReadyStatus(false);
			setListing([]);

			const reply = await fetchJSON(`/api/gallery`, {
				path,
			});
			if (reply.ok) {
				setReadyStatus(true);
				setListing({
					dirs: reply.json.dirs,
					files: reply.json.files.map(
						(fileName) => `${path}/${fileName}`,
					),
				});
			} else {
				setReadyStatus(reply.status);
				setListing(null);
			}
		} catch (error) {
			setReadyStatus(error);
			setListing(null);
		}
	}, []);

	useEffect(() => {
		if (typeof window === "undefined") return; // SSR

		if (!isReady) return;

		fetchListing(path);
	}, [fetchListing, isReady, path]);

	const images = useMemo(() => {
		return listing?.files?.map?.((path) => {
			let url = encodeURI(`files/gallery/${path}`);
			url = url.replace(/\(/g, "%28");
			url = url.replace(/\)/g, "%29");
			return {
				original: url,
				thumbnail: url,
			};
		});
	}, [listing]);

	return (
		<>
			<title>Gallery</title>

			<link
				rel="stylesheet"
				href="https://cdn.jsdelivr.net/npm/react-image-gallery/styles/css/image-gallery.css"
			/>

			{readyStatus === false && (
				<Box sx={styles.centerAlignOuter}>
					<Box sx={styles.centerAlignInner}>
						<CircularProgress size={128} />
					</Box>
				</Box>
			)}

			{readyStatus === true && (
				<>
					<div style={{ margin: "8px", textAlign: "center" }}>
						<div>
							{path !== "/" && (
								<Button
									variant="outlined"
									sx={{ margin: "4px" }}
									href={`?path=/`}
								>
									/
								</Button>
							)}

							{listing?.dirs?.map((path, i) => (
								<Button
									key={i}
									variant="outlined"
									sx={{ margin: "4px" }}
									href={`?path=${path}`}
								>
									{path}
								</Button>
							))}
						</div>
						<Typography variant="h6">{path}</Typography>
						{images?.length ? (
							<ImageGallery
								items={images}
								infinite={false}
								thumbnailPosition="top"
							/>
						) : (
							<>
								<div>No images in this directory</div>
								<div>Choose a directory to browse</div>
							</>
						)}
					</div>
				</>
			)}

			{readyStatus?.error && (
				<Card>
					<CardContent>
						<b>Error fetching gallery</b>
						<div>
							{readyStatus.error} :: {readyStatus.message}
						</div>
					</CardContent>
				</Card>
			)}
		</>
	);
}
