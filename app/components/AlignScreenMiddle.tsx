import { CSSProperties, memo, ReactNode } from "react";

const styles: { [key: string]: CSSProperties } = {
	centerAlignOuter: {
		display: `flex`,
		width: `100%`,
		height: `100vh`,
		alignItems: `center`,
		justifyContent: 'center',
		flexFlow: `column`,
	},
	centerAlignInner: {
		display: `flex`,
		justifyContent: 'center',
		alignItems: `center`,
		textAlign: `center`,
	},
	centerAlignContent: {
		maxWidth: `600px`,
		width: `100%`,
		boxSizing: 'border-box',
	},
	reset: {
		textAlign: `initial`,
	},
};

export const AlignScreenMiddle = memo(function AlignScreenMiddle({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<div style={styles.centerAlignOuter}>
			<div style={styles.centerAlignInner}>
				<div style={styles.centerAlignContent}>
					<div style={styles.reset}>{children}</div>
				</div>
			</div>
		</div>
	);
});
