import '../styles/globals.css';
import type { AppProps /*, AppContext */ } from 'next/app';
import theme from '../styles/theme/theme';
import createEmotionCache from '../utility/createEmotionCache';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material';
import { AuthContextProvider } from '../context/AuthContext';
import { useRouter } from 'next/router';
import ProtectedRoute from '../components/navigation/ProtectedRoute';

const clientSideEmotionCache = createEmotionCache();
const noAuthRoutes = ['/login'];

function App({ Component, pageProps }: AppProps) {
  const emotionCache = clientSideEmotionCache;
  const router = useRouter();
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <AuthContextProvider>
          {noAuthRoutes.includes(router.pathname) ? (
            <Component {...pageProps} />
          ) : (
            <ProtectedRoute>
              <Component {...pageProps} />
            </ProtectedRoute>
          )}
        </AuthContextProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
