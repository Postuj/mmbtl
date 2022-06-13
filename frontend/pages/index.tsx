import React from 'react';
import Grid from '@mui/material/Grid';
import Head from 'next/head';
import { NextPage } from 'next';
import DefaultLayout from '../layouts/DefaultLayout';
import QuickActions from '../components/home/QuickActions';
import GameHistory from '../components/game/GameHistory';

const HomePage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>MemeBattle - Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <DefaultLayout>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <QuickActions />
            </Grid>
            <Grid item xs={12} md={6}>
              <GameHistory />
            </Grid>
          </Grid>
        </DefaultLayout>
      </main>
    </div>
  );
};

export default HomePage;
