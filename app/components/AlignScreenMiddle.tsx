import { Box } from "@mui/material";
import { memo, ReactNode } from "react";

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
	centerAlignContent: {
		"maxWidth": `600px`,

		"& > *": {
			textAlign: `initial`,
		},
	},
};

interface AlignScreenMiddleProps {
	children: ReactNode;
}

export const AlignScreenMiddle = memo(function AlignScreenMiddle({
	children,
}: AlignScreenMiddleProps) {
	return (
		<Box sx={styles.centerAlignOuter}>
			<Box sx={styles.centerAlignInner}>
				<Box sx={styles.centerAlignContent}>{children}</Box>
			</Box>
		</Box>
	);
});
