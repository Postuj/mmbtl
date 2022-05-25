import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MemePage from './pages/MemePage';
import GameResultPage from './pages/GameResultPage';
import RoundResultPage from './pages/RoundResultPage';
import HomePage from './pages/HomePage';
import LobbyPage from './pages/LobbyPage';
import LoginPage from './pages/LoginPage';
import theme from './theme';

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firebaseApp = initializeApp({
  apiKey: 'AIzaSyBT799mwBT6UoeLeiq24lRO_0nrPxlb_PM',
  authDomain: 'memebattle-402e2.firebaseapp.com',
  databaseURL: 'https://memebattle-402e2.firebaseio.com',
  projectId: 'memebattle-402e2',
  storageBucket: 'memebattle-402e2.appspot.com',
  messagingSenderId: '1022255950050',
  appId: '1:1022255950050:web:d0f8471151a2504e4056bb',
});

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

function App() {
  const [user] = useAuthState(auth);

  return (
    <ThemeProvider theme={theme}>
      {user ? (
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="lobby" element={<LobbyPage />} />
            <Route path="meme" element={<MemePage />} />
            <Route path="roundresult" element={<RoundResultPage />} />
            <Route path="gameresult" element={<GameResultPage />} />
          </Routes>
        </Router>
      ) : (
        <LoginPage />
      )}
    </ThemeProvider>
  );
}

export default App;
