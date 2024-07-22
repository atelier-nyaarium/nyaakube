import { TextField } from "@mui/material";
import React, { memo, useCallback } from "react";

interface ControlledInputProps {
	type: string;
	value?: any;
	setValue?: (value: any) => void;
	onChange?: (value: any) => void;
	label?: React.ReactNode;
	placeholder?: string;
	disabled?: boolean;
}

const InputLabelProps = {
	shrink: true,
};

/**
 * Controlled input that encapsulates many MUI components.
 *
 * Just TextField for now.
 *
 * @param props - The properties for the controlled input component.
 * @returns The controlled input component.
 */
export const ControlledInput = memo(function ControlledInput({
	value,
	setValue,
	onChange,
	type,
	label,
	placeholder,
}: ControlledInputProps): JSX.Element {
	const handlerChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			let rawValue;
			let parsedValue;
			switch (type) {
				case "date":
					rawValue = event.target.value;
					parsedValue = new Date(rawValue);
					break;
				// Should be handled in a separate component:
				// case "checkbox":
				// 	rawValue = event.target.checked;
				// 	parsedValue = event.target.checked;
				// 	break;
				case "number":
					rawValue = event.target.value;
					parsedValue = Number(rawValue);
					break;
				default:
					rawValue = event.target.value;
					parsedValue = rawValue;
			}
			setValue?.(rawValue);
			onChange?.(parsedValue); // TODO: debounce
		},
		[onChange, setValue, type],
	);

	return (
		<TextField
			type={type}
			label={label}
			placeholder={placeholder}
			fullWidth
			variant="filled"
			margin="none"
			value={value}
			onChange={handlerChange}
			InputLabelProps={InputLabelProps}
		/>
	);
});
