import { SnackbarProvider } from "@/components/Snackbar";
import { QueryProvider } from "@/schemas/default/useGraphAPI";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PropTypes from "prop-types";
import React from "react";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

export default function App({ Component, pageProps }) {
	return (
		<SnackbarProvider>
			<QueryProvider>
				<ThemeProvider theme={darkTheme}>
					<CssBaseline />
					<Component {...pageProps} />
				</ThemeProvider>
			</QueryProvider>
		</SnackbarProvider>
	);
}

App.propTypes = {
	Component: PropTypes.elementType.isRequired,
	pageProps: PropTypes.object.isRequired,
};
