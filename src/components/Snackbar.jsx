import { Close } from "@mui/icons-material";
import { Alert, Grow, IconButton, Snackbar } from "@mui/material";
import PropTypes from "prop-types";
import React, {
	createContext,
	useCallback,
	useContext,
	useReducer,
} from "react";
import { v4 as uuid } from "uuid";

const SnackbarContext = createContext(null);

export function useSnackbar() {
	const api = useContext(SnackbarContext);
	if (!api) {
		throw new Error("useSnackbar must be used within a SnackbarProvider");
	}
	return api;
}

const initialState = {
	closingTransition: false,
	count: 1,
	length: 0,
	snackConfigQueue: [],
};

function pureReducer(state, action) {
	const queue = state.snackConfigQueue;
	const count = state.count;

	switch (action.type) {
		case "CLOSE_TRANSITION": {
			return {
				...state,
				closingTransition: action.closingTransition,
			};
		}
		case "APPEND_SNACK": {
			return {
				...state,
				snackConfigQueue: [...queue, action.snackConfig],
				length: state.length + 1,
			};
		}
		case "DISMISS_SNACK": {
			if (queue.length === 1) {
				return {
					...state,
					snackConfigQueue: [],
					count: 1,
					length: 0,
				};
			} else {
				return {
					...state,
					snackConfigQueue: queue.slice(1),
					count: count + 1,
				};
			}
		}
		default:
			return state;
	}
}

export function SnackbarProvider({ children }) {
	const [state, dispatch] = useReducer(pureReducer, initialState);

	const closingTransition = useCallback((closingTransition) => {
		dispatch({ type: "CLOSE_TRANSITION", closingTransition });
	}, []);

	const dismissSnack = useCallback(
		(event, reason) => {
			if (reason === "clickaway") return;

			closingTransition(true);
			setTimeout(() => {
				dispatch({ type: "DISMISS_SNACK" });
				closingTransition(false);
			}, 250);
		},
		[closingTransition],
	);

	const appendSnack = useCallback((snackConfig) => {
		let message = snackConfig.message;
		if (typeof message !== "string") {
			message = JSON.stringify(message);
		}
		dispatch({
			type: "APPEND_SNACK",
			snackConfig: {
				...snackConfig,
				message,
			},
		});
	}, []);

	const errorSnack = useCallback(
		(message, options = {}) => {
			const snackConfig = {
				variant: "error",
				key: options.key || uuid(),
				message,
				options,
			};

			if (message instanceof Error) {
				snackConfig.error = message;
				snackConfig.message = message.message;
			}

			appendSnack(snackConfig);
		},
		[appendSnack],
	);

	const infoSnack = useCallback(
		(message, options = {}) => {
			const snackConfig = {
				variant: "info",
				key: options.key || uuid(),
				message,
				options,
			};
			appendSnack(snackConfig);
		},
		[appendSnack],
	);

	const successSnack = useCallback(
		(message, options = {}) => {
			const snackConfig = {
				variant: "success",
				key: options.key || uuid(),
				message,
				options,
			};
			appendSnack(snackConfig);
		},
		[appendSnack],
	);

	const warningSnack = useCallback(
		(message, options = {}) => {
			const snackConfig = {
				variant: "warning",
				key: options.key || uuid(),
				message,
				options,
			};
			appendSnack(snackConfig);
		},
		[appendSnack],
	);

	const currentSnackConfig = state.snackConfigQueue?.[0];

	return (
		<SnackbarContext.Provider
			value={{
				// Available callbacks
				errorSnack,
				infoSnack,
				successSnack,
				warningSnack,
			}}
		>
			<Snackbar
				open={!state.closingTransition && !!currentSnackConfig}
				autoHideDuration={currentSnackConfig?.timeout || 8000}
				onClose={dismissSnack}
				TransitionComponent={Grow}
				key="snackbar"
			>
				{currentSnackConfig ? (
					<Alert
						severity={currentSnackConfig?.variant || "info"}
						action={
							<IconButton
								aria-label="close"
								color="inherit"
								sx={{ p: 0.5 }}
								onClick={dismissSnack}
							>
								<Close />
							</IconButton>
						}
					>
						{1 < state.length && (
							<span>
								{state.count}/{state.length}
								&nbsp;&nbsp;
							</span>
						)}
						{currentSnackConfig?.message}
					</Alert>
				) : undefined}
			</Snackbar>
			{children}
		</SnackbarContext.Provider>
	);
}

SnackbarProvider.propTypes = {
	children: PropTypes.any,
};
