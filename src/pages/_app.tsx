import "../styles/globals.css";
import type { AppProps } from 'next/app'
import { ThemeProvider } from "@mui/material";
import { theme } from "../config/theme";
import createEmotionCache from '~/config/createEmotionCache';

import { ControlProvider } from "~/context/controlContext";

const clientSideEmotionCache = createEmotionCache();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <ControlProvider>
        <Component {...pageProps} />
      </ControlProvider>
    </ThemeProvider>
  );
}

export default MyApp;