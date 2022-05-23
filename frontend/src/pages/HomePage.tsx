import React, { FC } from 'react';
import DefaultLayout from '../layouts/DefaultLayout';
import QuickActions from '../components/home/QuickActions';
import GameHistory from '../components/game/GameHistory';
import Grid from '@mui/material/Grid';

const HomePage: FC = () => {
  return (
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
  );
};

export default HomePage;
