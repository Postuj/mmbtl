import Box from '@mui/material/Box';
import React, { FC } from 'react';
import MemeLayout from '../layouts/MemeLayout';
import { Meme as MemeType } from '../common/types/meme';
import { Round } from '../common/types/game';
import RoundTitle from '../components/game/RoundTitle';
import TimeBar from '../components/game/TimeBar';
import MemeForm from '../components/memes/MemeForm';
import ReadyButton from '../components/game/ReadyButton';

type MemePageProps = {
  // meme: MemeType;
  // round: Round;
  rating?: boolean;
};

const MemePage: FC<MemePageProps> = ({ rating }) => {
  return (
    <MemeLayout>
      <RoundTitle
        primary={`Round ${1}${!rating ? ' rating' : ''}`}
        secondary="house fire"
      />
      <TimeBar currentTime={30} maxTime={60} />
      <MemeForm rating={!rating}/>
      <ReadyButton />
    </MemeLayout>
  );
};

export default MemePage;
