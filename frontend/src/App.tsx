import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MemePage from './pages/MemePage';
import GameResultPage from './pages/GameResultPage';
import RoundResultPage from './pages/RoundResultPage';
import HomePage from './pages/HomePage';
import LobbyPage from './pages/LobbyPage';
import LoginPage from './pages/LoginPage';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="lobby" element={<LobbyPage />} />
          <Route path="meme" element={<MemePage />} />
          <Route path="roundresult" element={<RoundResultPage />} />
          <Route path="gameresult" element={<GameResultPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
