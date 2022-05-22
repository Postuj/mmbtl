import React, { FC } from 'react';
import LobbyPlayerList from '../components/lobby/LobbyPlayerList';
import DefaultLayout from '../layouts/DefaultLayout';
import { Player } from '../common/types/player';
import PaperSectionLayout from '../layouts/PaperSectionLayout';
import LobbyGameStatus from '../components/lobby/LobbyGameStatus';
import LeaveLobbyButton from '../components/lobby/LeaveLobbyButton';

const players: Player[] = [
  {
    username: 'DawidPasieka',
    score: 420,
  },
  {
    username: 'JarosławBiegacz',
    score: 150,
  },
  {
    username: 'SzybkaAkcja',
    score: 245,
  },
];

const LobbyPage: FC = () => {
  return (
    <DefaultLayout>
      <LeaveLobbyButton />
      <PaperSectionLayout
        title="Game"
        secondary="custom"
        sx={{
          my: 3,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      />
      <LobbyPlayerList players={players} maxPlayers={4} />
      <LobbyGameStatus />
    </DefaultLayout>
  );
};

export default LobbyPage;
