import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import { ReactNode } from "react";
import { useNonce } from "~/components/Nonce";
import { SnackbarProvider } from "~/components/Snackbar";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

export default function App(props: { children: ReactNode }) {
	const nonce = useNonce();

	return (
		<html>
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<link rel="icon" href="/favicon.ico" />
				{/* <link rel="manifest" href="/manifest.json" /> */}
				<Meta />
				<Links />
			</head>
			<body>
				<ThemeProvider theme={darkTheme}>
					<CssBaseline />
					<SnackbarProvider>
						<Outlet />
					</SnackbarProvider>
					<ScrollRestoration nonce={nonce} />
					<Scripts nonce={nonce} />
				</ThemeProvider>
			</body>
		</html>
	);
}
