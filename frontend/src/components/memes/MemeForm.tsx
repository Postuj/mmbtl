import Box from '@mui/material/Box';
import React, { FC, useState } from 'react';
import memeImg from '../../assets/memes/bike.png';
import RateMemeField from './RateMemeField';

type MemeFormProps = {
  rating?: boolean;
};

const MemeForm: FC<MemeFormProps> = ({ rating }) => {
  const [score, setScore] = useState(4);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
  };

  return (
    <>
      <Box
        sx={{
          minHeight: 380,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img src={memeImg} alt="Meme" style={{ maxWidth: '100%', maxHeight: 550 }} />
      </Box>
      {rating && (
        <RateMemeField value={score} onRateChange={handleScoreChange} />
      )}
    </>
  );
};

export default MemeForm;
