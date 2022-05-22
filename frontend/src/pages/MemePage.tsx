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
};

const MemePage: FC<MemePageProps> = () => {
  return (
    <MemeLayout>
      <Box
        sx={{
          py: 2,
          px: 1,
          bgcolor: 'background.paper',
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        <RoundTitle memeTitle="house fire" roundIndex={1} />
        <TimeBar currentTime={30} maxTime={60} />
        <MemeForm />
      </Box>
      <ReadyButton />
    </MemeLayout>
  );
};

export default MemePage;
