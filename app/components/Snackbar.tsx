import { Close } from "@mui/icons-material";
import { Alert, Grow, IconButton, Snackbar } from "@mui/material";
import {
	createContext,
	CSSProperties,
	MouseEvent,
	ReactNode,
	SyntheticEvent,
	useCallback,
	useContext,
	useReducer,
} from "react";
import { v4 as uuid } from "uuid";

const CLOSE_TRANSITION_DURATION = 250;
const DEFAULT_TIMEOUT = 8000;

export interface SnackbarMessageOptions {
	/**
	 * The type of the message.
	 * @optional
	 * @default "info"
	 */
	type?: "error" | "info" | "success" | "warning";

	/**
	 * The time it takes to auto-dismiss.
	 * @optional
	 * @default DEFAULT_TIMEOUT
	 */
	timeout?: number;

	/**
	 * The message to display.
	 */
	message: string;
}

export type DispatchSnackbar = (options: SnackbarMessageOptions) => void;

interface SnackbarMessage {
	key: string;
	type: "error" | "info" | "success" | "warning";
	message: string;
	error?: Error;
	timeout?: number;
}

interface SnackbarState {
	closingTransition: boolean;
	count: number;
	length: number;
	snackConfigQueue: Array<SnackbarMessage>;
}

const initialState: SnackbarState = {
	closingTransition: false,
	count: 1,
	length: 0,
	snackConfigQueue: [],
};

interface ActionCloseTransition {
	type: "CLOSE_TRANSITION";
	closingTransition: boolean;
}
interface ActionAppendSnack {
	type: "APPEND_SNACK";
	snackConfig: SnackbarMessage;
}
interface ActionDismissSnack {
	type: "DISMISS_SNACK";
}

const noop = () => {};
const SnackbarContext = createContext<DispatchSnackbar>(noop);

const styles: Record<string, CSSProperties> = {
	closeButton: {
		padding: 0,
	},
	count: {
		marginRight: 4,
	},
};

function pureReducer(
	state: SnackbarState,
	action: ActionCloseTransition | ActionAppendSnack | ActionDismissSnack,
): SnackbarState {
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
			const lastSnack = queue.length ? queue[queue.length - 1] : null;
			if (
				queue.length === 1 &&
				lastSnack &&
				lastSnack.message === action.snackConfig?.message
			) {
				// Fast-forward if we are on the last message, and it's exactly the same
				return {
					...state,
					length: state.length + 1,
					count: count + 1,
				};
			} else {
				return {
					...state,
					snackConfigQueue: [...queue, action.snackConfig],
					length: state.length + 1,
				};
			}
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
				let newQueue = queue.slice(1);
				let newCount = count + 1;
				while (
					newQueue.length &&
					newQueue[0].message === queue[0].message
				) {
					newQueue = newQueue.slice(1);
					newCount++;
				}
				return {
					...state,
					snackConfigQueue: newQueue,
					count: newCount,
				};
			}
		}
		default:
			return state;
	}
}

/**
 * @example
 * const snackbar = useSnackbar();
 * useEffect(() => {
 *     snackbar({
 *         type: "info",
 *         message: "This is an info message",
 *         timeout: 1000,
 *     });
 *     snackbar({
 *         type: "success",
 *         message: "This is a success message",
 *     });
 *     snackbar({
 *         type: "warning",
 *         message: "This is a warning message",
 *     });
 *     snackbar({
 *         type: "error",
 *         message: "This is an error message",
 *         timeout: 60000,
 *     });
 * }, []);
 */
export function useSnackbar() {
	const callback = useContext<DispatchSnackbar>(SnackbarContext);
	if (callback === noop) {
		throw new Error("useSnackbar must be used within a SnackbarProvider");
	}
	return callback;
}

export function SnackbarProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(pureReducer, initialState);

	const dispatchClosingTransition = useCallback(
		(closingTransition: boolean) => {
			dispatch({ type: "CLOSE_TRANSITION", closingTransition });
		},
		[],
	);

	const onSnackbarClose = useCallback(
		(event: Event | SyntheticEvent<any, Event>, reason: string) => {
			if (reason === "clickaway") return;

			dispatchClosingTransition(true);
			setTimeout(() => {
				dispatch({ type: "DISMISS_SNACK" });
				dispatchClosingTransition(false);
			}, CLOSE_TRANSITION_DURATION);
		},
		[dispatchClosingTransition],
	);

	const onCloseButtonClick = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => {
			dispatchClosingTransition(true);
			setTimeout(() => {
				dispatch({ type: "DISMISS_SNACK" });
				dispatchClosingTransition(false);
			}, CLOSE_TRANSITION_DURATION);
		},
		[],
	);

	const dispatchSnack: DispatchSnackbar = useCallback(
		(options: SnackbarMessageOptions) => {
			const snackConfig: SnackbarMessage = {
				key: uuid(),
				type: options.type || "info",
				message: options.message,
				timeout: options.timeout,
			};
			dispatch({
				type: "APPEND_SNACK",
				snackConfig,
			});
		},
		[],
	);

	const currentSnackConfig = state.snackConfigQueue?.[0];

	return (
		<SnackbarContext.Provider value={dispatchSnack}>
			<Snackbar
				open={!state.closingTransition && !!currentSnackConfig}
				autoHideDuration={
					currentSnackConfig?.timeout || DEFAULT_TIMEOUT
				}
				onClose={onSnackbarClose}
				TransitionComponent={Grow}
				key="snackbar"
			>
				{currentSnackConfig ? (
					<Alert
						severity={currentSnackConfig?.type || "info"}
						action={
							<IconButton
								aria-label="close"
								color="inherit"
								style={styles.closeButton}
								onClick={onCloseButtonClick}
							>
								<Close />
							</IconButton>
						}
					>
						{1 < state.length && (
							<span style={styles.count}>
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
