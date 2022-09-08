import "../styles/globals.css";
import type { AppProps } from 'next/app'
import { ThemeProvider } from "@mui/material";
import { theme } from "../config/theme";
import createEmotionCache from '~/config/createEmotionCache';

import { AppContextProvider } from "~/context/appContext";

const clientSideEmotionCache = createEmotionCache();

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