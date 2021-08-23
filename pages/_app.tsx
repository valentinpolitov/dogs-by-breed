import type { AppProps } from "next/app";
import React from "react";
import { SWRConfig } from "swr";
import fetcher from "../utils/fetcher";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../styles/theme";

function MyApp({ Component, pageProps }: AppProps) {
	React.useEffect(() => {
		// Remove the server-side injected CSS.
		const jssStyles = document.getElementById("jss-server-side");
		if (jssStyles) {
			jssStyles.parentElement.removeChild(jssStyles);
		}
	}, []);
	return (
		<React.Fragment>
			<Head>
				<title>Pictures of dogs by breed</title>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
			</Head>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<SWRConfig value={{ fetcher }}>
					<Component {...pageProps} />
				</SWRConfig>
			</ThemeProvider>
		</React.Fragment>
	);
}
export default MyApp;
