import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import { ReactNode } from "react";
import { SnackbarProvider } from "~/components/Snackbar";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

export default function App(props: { children: ReactNode }) {
	return (
		<html>
			<head>
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
					<ScrollRestoration />
					<Scripts />
				</ThemeProvider>
			</body>
		</html>
	);
}
