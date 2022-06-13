import React, { FC } from 'react';
import Typography from '@mui/material/Typography';
import BottomLeaderboardText from '../game/leaderboard/BottomLeaderboardText';

type LobbyGameStatusProps = {
  timeToStart?: number;
};

const LobbyGameStatus: FC<LobbyGameStatusProps> = ({ timeToStart }) => {
  return (
    <BottomLeaderboardText>
      <Typography
        align="center"
        variant="h6"
        color={timeToStart ? 'primary' : 'secondary'}
      >
        {timeToStart
          ? `Starting in ${timeToStart}...`
          : 'Waiting for players...'}
      </Typography>
    </BottomLeaderboardText>
  );
};

export default LobbyGameStatus;
