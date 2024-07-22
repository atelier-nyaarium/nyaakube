import {
	CSSProperties,
	memo,
	ReactNode,
	useCallback,
	useMemo,
	useState,
} from "react";

const styles: Record<string, CSSProperties> = {
	root: {
		transition: `background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`,
		backgroundColor: `rgba(255,255,255, 0)`,
	},
	dropzoneHighlight: {
		cursor: `grabbing`,
		backgroundColor: `rgba(255,255,200, 0.75)`,
	},
};

interface DropFileTargetProps {
	children: ReactNode;
	onDrop: (files: FileList) => void;
	disabled?: boolean;
}

/**
 * A component that provides a drop zone for files.
 *
 * @param props - The props of the component.
 * @returns The JSX element representing the component.
 */
export const DropFileTarget = memo(function DropFileTarget({
	children,
	onDrop,
	disabled = false,
}: DropFileTargetProps): JSX.Element {
	const [dragOver, setDragOver] = useState(false);

	const styleZone = useMemo(
		() => ({
			...styles.root,
			...(!disabled && dragOver ? styles.dropzoneHighlight : {}),
		}),
		[disabled, dragOver],
	);

	const handlerStartDrag = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			// Do nothing for now
		},
		[],
	);

	const handlerDragOver = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault();

			if (!event.dataTransfer.types.includes(`Files`)) return;

			setDragOver(true);
		},
		[],
	);

	const handlerDragLeave = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
			if (!event.dataTransfer.types.includes(`Files`)) return;

			setDragOver(false);
		},
		[],
	);

	const handlerDrop = useCallback(
		(event: React.DragEvent<HTMLDivElement>) => {
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
});
