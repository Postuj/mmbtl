import Box from '@mui/material/Box';
import React, { FC } from 'react';
import Typography from '@mui/material/Typography';

type LobbyGameStatusProps = {
  timeToStart?: number;
};

const LobbyGameStatus: FC<LobbyGameStatusProps> = ({ timeToStart }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography align="center" variant="h6" color="secondary">
        {timeToStart
          ? `Starting in ${timeToStart}...`
          : 'Waiting for players...'}
      </Typography>
    </Box>
  );
};

export default LobbyGameStatus;
