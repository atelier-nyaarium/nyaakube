import { CSSProperties, memo, ReactNode, useMemo } from "react";

const styles: { [key: string]: CSSProperties } = {
	centerAlignOuter: {
		display: `flex`,
		width: `100%`,
		height: `100vh`,
		alignItems: `center`,
		justifyContent: "center",
		flexFlow: `column`,
	},
	centerAlignInner: {
		display: `flex`,
		justifyContent: "center",
		alignItems: `center`,
		textAlign: `center`,
	},
	centerAlignContent: {
		boxSizing: "border-box",
	},
	reset: {
		textAlign: `initial`,
	},
};

export const AlignScreenMiddle = memo(function AlignScreenMiddle({
	width,
	children,
}: {
	width: string;
	children: ReactNode;
}) {
	const contentStyle = useMemo(() => {
		return {
			...styles.centerAlignContent,
			width,
		};
	}, [width]);

	return (
		<div style={styles.centerAlignOuter}>
			<div style={styles.centerAlignInner}>
				<div style={contentStyle}>
					<div style={styles.reset}>{children}</div>
				</div>
			</div>
		</div>
	);
});
