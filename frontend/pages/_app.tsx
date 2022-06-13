import '../styles/globals.css';
import type { AppProps /*, AppContext */ } from 'next/app';
import theme from "../styles/theme/theme";
import createEmotionCache from "../utility/createEmotionCache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material";

const clientSideEmotionCache = createEmotionCache();

function App({ Component, pageProps }: AppProps) {
  const emotionCache = clientSideEmotionCache;
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
