import { TextField } from "@mui/material";
import PropTypes from "prop-types";
import React, { useCallback } from "react";

const InputLabelProps = {
	shrink: true,
};

/**
 * Controlled input that encapsulates many MUI components.
 *
 * Just TextField for now.
 *
 * @param {string} props.type - Type of the input. (text, password, email, etc.)
 * @param {any} [props.value] - Raw value state.
 * @param {function} props.setValue - Raw value setter.
 * @param {function} props.onChange - Callback with parsed value.
 * @param {any} [props.label] - The label of the input.
 * @param {string} props.placeholder - The placeholder of the input.
 *
 * @returns {JSX.Element} - The controlled input component.
 */
export default function ControlledInput({
	value,
	setValue,
	onChange,
	type,
	label,
	placeholder,
}) {
	const handlerChange = useCallback(
		(event) => {
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
}

ControlledInput.propTypes = {
	value: PropTypes.any,
	setValue: PropTypes.func,
	onChange: PropTypes.func,
	onChangeDeferred: PropTypes.func,
	type: PropTypes.string.isRequired,
	label: PropTypes.any,
	placeholder: PropTypes.string,
};
