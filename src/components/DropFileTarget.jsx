import PropTypes from "prop-types";
import React, { useCallback, useMemo, useState } from "react";

const styles = {
	root: {
		transition: `background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`,
		backgroundColor: `rgba(255,255,255, 0)`,
	},
	dropzoneHighlight: {
		cursor: `grabbing`,
		backgroundColor: `rgba(255,255,200, 0.75)`,
	},
};

/**
 * A component that provides a drop zone for files.

 * @typedef {Object} Props
 * @property {ReactNode} children - The child elements to be rendered within the component.
 * @property {function} onDrop - The function to be called when files are dropped onto the component.
 * @property {boolean} disabled - A flag indicating whether the component is disabled.
 * 
 * @param {Props} props - The props of the component.
 * 
 * @returns {JSX.Element} - The JSX element representing the component.
 */
export default function DropFileTarget({ children, onDrop, disabled }) {
	const [dragOver, setDragOver] = useState(false);

	const styleZone = useMemo(
		() => ({
			...styles.root,
			...(!disabled && dragOver ? styles.dropzoneHighlight : {}),
		}),
		[disabled, dragOver],
	);

	const handlerStartDrag = useCallback((event) => {
		//
	}, []);

	const handlerDragOver = useCallback((event) => {
		event.preventDefault();

		if (!event.dataTransfer.types.includes(`Files`)) return;

		setDragOver(true);
	}, []);

	const handlerDragLeave = useCallback((event) => {
		if (!event.dataTransfer.types.includes(`Files`)) return;

		setDragOver(false);
	}, []);

	const handlerDrop = useCallback(
		(event) => {
			event.preventDefault();

			if (!event.dataTransfer.types.includes(`Files`)) return;

			setDragOver(false);

			onDrop(event.dataTransfer.files);
		},
		[onDrop],
	);

	return (
		<div
			style={styleZone}
			onDragStart={handlerStartDrag}
			onDragOver={handlerDragOver}
			onDragLeave={handlerDragLeave}
			onDrop={handlerDrop}
		>
			{children}
		</div>
	);
}

DropFileTarget.propTypes = {
	children: PropTypes.any,
	onDrop: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
};
