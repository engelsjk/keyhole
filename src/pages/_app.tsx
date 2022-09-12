import "../styles/globals.css";
import type { AppProps } from 'next/app'
import { ThemeProvider } from "@mui/material";
import { theme } from "../config/theme";

import { AppContextProvider } from "~/context/appContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <AppContextProvider>
        <Component {...pageProps} />
      </AppContextProvider>
    </ThemeProvider>
  );
}

export default MyApp;