import { Box } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

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

export default function AlignScreenMiddle({ children }) {
	return (
		<Box sx={styles.centerAlignOuter}>
			<Box sx={styles.centerAlignInner}>
				<Box sx={styles.centerAlignContent}>{children}</Box>
			</Box>
		</Box>
	);
}

AlignScreenMiddle.propTypes = {
	children: PropTypes.any,
};
