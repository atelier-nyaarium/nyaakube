import Session, { useSession } from "@/components/Session";
import { Card, CardHeader, Typography } from "@mui/material";
import React from "react";

const styles = {
	navigationCard: {
		display: `inline-block`,
		margin: `4px`,
		width: `260px`,
	},
};

export default function PageTest() {
	return (
		<>
			<title>Test | Nyaarium</title>

			<Session>
				<TestCard />
			</Session>
		</>
	);
}

function TestCard(props) {
	const { session } = useSession();

	return (
		<Card sx={styles.navigationCard}>
			<CardHeader title={<Typography variant="h5">Test</Typography>} />

			{JSON.stringify(session)}
		</Card>
	);
}
