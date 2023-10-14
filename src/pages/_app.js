import { QueryProvider } from "@/schemas/default/useQuery";
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
		<QueryProvider>
			<ThemeProvider theme={darkTheme}>
				<CssBaseline />
				<Component {...pageProps} />
			</ThemeProvider>
		</QueryProvider>
	);
}

App.propTypes = {
	Component: PropTypes.elementType.isRequired,
	pageProps: PropTypes.object.isRequired,
};
