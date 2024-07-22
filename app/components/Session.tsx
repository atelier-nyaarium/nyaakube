import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	CircularProgress,
} from "@mui/material";
import React, {
	createContext,
	memo,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { AlignScreenMiddle } from "~/components/AlignScreenMiddle";
import { ControlledInput } from "~/components/ControlledInput";
import { useSnackbar } from "~/components/Snackbar";
import { useFetch } from "~/hooks/useFetch";

interface SessionContextType {
	session: any;
	checkSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function useSession(): SessionContextType {
	const context = useContext(SessionContext);

	if (!context) {
		throw new Error(`useSession() : must be used within a <Session> tree.`);
	}

	return context;
}

interface SessionProps {
	children: ReactNode;
}

export const Session = memo(function Session({ children }: SessionProps) {
	const [sessionData, setSessionData] = useState<any>(null);

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

interface LoginInterfaceProps {
	checkSession: () => void;
}

function LoginInterface({ checkSession }: LoginInterfaceProps) {
	const snackbar = useSnackbar();

	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [totp, setTotp] = useState<string>("");

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
					snackbar({
						type: "info",
						message: `Email and password are both required.`,
					});
					return false;
				}
				return true;
			},
			async ok(data) {
				snackbar({
					type: "success",
					message: `Log in successful.`,
				});
				checkSession();
			},
			async error(error) {
				snackbar({
					type: "error",
					message: error.message,
				});
			},
		}),
		[checkSession, email, password, snackbar, totp],
	);

	const handlerSubmit = useCallback(
		(event: React.FormEvent<HTMLFormElement>) => event.preventDefault(),
		[],
	);

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
