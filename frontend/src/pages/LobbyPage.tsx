import React, { FC } from 'react';
import LobbyPlayerList from '../components/lobby/LobbyPlayerList';
import DefaultLayout from '../layouts/DefaultLayout';
import { Player } from '../common/types/player';
import PaperSection from '../components/common/PaperSection';
import LobbyGameStatus from '../components/lobby/LobbyGameStatus';
import LeaveLobbyButton from '../components/lobby/LeaveLobbyButton';
import Box from '@mui/material/Box';

const players: Player[] = [
  {
    username: 'DawidPasieka',
    scores: [11, 14, 15, 7],
  },
  {
    username: 'JarosławBiegacz',
    scores: [14, 13, 4, 3],
  },
  {
    username: 'SzybkaAkcja',
    scores: [11, 7, 10, 11],
  },
];

const customPaperSectionStyle = {
  mx: 1,
  my: 3,
  display: 'flex',
  justifyContent: 'space-between',
};

const LobbyPage: FC = () => {
  return (
    <DefaultLayout>
      <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
        <PaperSection
          title="Game"
          secondary="custom"
          sx={customPaperSectionStyle}
        />
      </Box>
      <LobbyPlayerList players={players} maxPlayers={4} />
      <LobbyGameStatus />
      <LeaveLobbyButton />
    </DefaultLayout>
  );
};

export default LobbyPage;
