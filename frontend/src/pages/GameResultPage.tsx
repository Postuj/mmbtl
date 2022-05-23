import Box from '@mui/material/Box';
import React, { FC } from 'react';
import { Player } from '../common/types/player';
import GameLeaderboard from '../components/game/leaderboard/GameLeaderboard';
import LeaveGameButton from '../components/game/LeaveGameButton';
import RoundTitle from '../components/game/RoundTitle';
import DefaultLayout from '../layouts/DefaultLayout';

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

const GameResultPage: FC = () => {
  return (
    <DefaultLayout>
      <Box
        sx={{
          py: 2,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        <RoundTitle
          primary={`Game results`}
          secondary={'house fire'}
        ></RoundTitle>
        <GameLeaderboard rounds={4} players={players} />
        <LeaveGameButton />
      </Box>
    </DefaultLayout>
  );
};

export default GameResultPage;
