import Box from '@mui/material/Box';
import React, { FC, useState } from 'react';
import RateMemeField from './RateMemeField';

type MemeFormProps = {
  isRating?: boolean;
};

const MemeForm: FC<MemeFormProps> = ({ isRating }) => {
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
        <img
          src="/assets/memes/bike.png"
          alt="Meme"
          style={{ maxWidth: '100%', maxHeight: 550 }}
        />
      </Box>
      {isRating && (
        <RateMemeField value={score} onRateChange={handleScoreChange} />
      )}
    </>
  );
};

export default MemeForm;
