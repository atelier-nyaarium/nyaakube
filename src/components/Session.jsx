import { useFetch } from "@/assets/client";
import { AlignScreenMiddle } from "@/components/AlignScreenMiddle";
import { ControlledInput } from "@/components/ControlledInput";
import { useSnackbar } from "@/components/Snackbar";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	CircularProgress,
} from "@mui/material";
import PropTypes from "prop-types";
import React, {
	createContext,
	memo,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

const SessionContext = createContext();

export function useSession() {
	const context = useContext(SessionContext);

	if (!context) {
		throw new Error(`useSession() : must be used within a <Session> tree.`);
	}

	return context;
}

export const Session = memo(function Session({ children }) {
	const [sessionData, setSessionData] = useState(null);

	const [checkSession, loading] = useFetch(
		() => ({
			url: `/api/session/check`,
			ok: setSessionData,
		}),
		[],
	);

	// Once
	useEffect(() => {
		checkSession();
	}, [checkSession]);

	if (!sessionData) {
		return null;
	}

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<SessionContext.Provider value={{ session: sessionData, checkSession }}>
			{sessionData?.valid ? (
				children
			) : (
				<AlignScreenMiddle>
					<LoginInterface checkSession={checkSession} />
				</AlignScreenMiddle>
			)}
		</SessionContext.Provider>
	);
});

Session.propTypes = {
	children: PropTypes.node.isRequired,
};

const styles = {
	loginCard: {
		width: `300px`,
	},
	flexColumn: {
		display: `flex`,
		flexDirection: `column`,
		gap: `8px`,
	},
};

function LoginInterface({ checkSession }) {
	const { infoSnack, successSnack, errorSnack } = useSnackbar();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [totp, setTotp] = useState("");

	const [sessionLogin, loading] = useFetch(
		() => ({
			url: `/api/session/login`,
			data: {
				email,
				password,
				totp,
			},
			async validate() {
				if (loading || !email || !password) {
					infoSnack(`Email and password are both required.`);
					return false;
				}
				return true;
			},
			async ok(data) {
				successSnack(`Log in successful.`);
				checkSession();
			},
			async error(error) {
				errorSnack(error);
			},
		}),
		[
			checkSession,
			email,
			errorSnack,
			infoSnack,
			password,
			successSnack,
			totp,
		],
	);

	const handlerSubmit = useCallback((event) => event.preventDefault(), []);

	return (
		<Card sx={styles.loginCard}>
			<CardHeader title="Login" />
			<CardContent>
				<Box
					component="form"
					onSubmit={handlerSubmit}
					sx={styles.flexColumn}
				>
					<ControlledInput
						type="text"
						label="Email"
						value={email}
						onChange={setEmail}
						disabled={loading}
					/>

					<ControlledInput
						type="password"
						label="Password"
						value={password}
						onChange={setPassword}
						disabled={loading}
					/>

					<ControlledInput
						type="text"
						label={
							<span>
								TOTP <sup>(if enabled)</sup>
							</span>
						}
						value={totp}
						onChange={setTotp}
						disabled={loading}
					/>

					<Button
						type="submit"
						variant="contained"
						onClick={sessionLogin}
						disabled={loading}
					>
						{loading ? <CircularProgress size="24px" /> : "Login"}
					</Button>
				</Box>
			</CardContent>
		</Card>
	);
}

LoginInterface.propTypes = {
	checkSession: PropTypes.func.isRequired,
};
