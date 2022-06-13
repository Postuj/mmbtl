import Box from '@mui/material/Box';
import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { Player } from '../common/types/player';
import RoundLeaderboard from '../components/game/leaderboard/RoundLeaderboard';
import RoundTitle from '../components/game/RoundTitle';
import NextRoundTitle from '../components/lobby/NextRoundTitle';
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

const RoundResultPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>MemeBattle - Round results</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DefaultLayout>
        <Box
          sx={{
            py: 2,
            px: 1,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        >
          <RoundTitle
            primary={`Round ${3} results`}
            secondary={'house fire'}
          ></RoundTitle>
          <RoundLeaderboard players={players} />
          <NextRoundTitle time={7} />
        </Box>
      </DefaultLayout>
    </>
  );
};

export default RoundResultPage;
