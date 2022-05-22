import Box from '@mui/material/Box';
import React, { FC } from 'react';
import memeImg from '../../assets/memes/bike.png';

type MemeFormProps = {};

const MemeForm: FC<MemeFormProps> = () => {
  return (
    <Box sx={{ minHeight: 380 }}>
      <img src={memeImg} alt="Meme" width='100%'/>
    </Box>
  );
};

export default MemeForm;
