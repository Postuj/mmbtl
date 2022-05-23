import React, { FC } from 'react';
import Typography from '@mui/material/Typography';
import BottomLeaderboardText from '../game/leaderboard/BottomLeaderboardText';

type NextRoundTitleProps = {
  time: number;
};

const NextRoundTitle: FC<NextRoundTitleProps> = ({ time }) => {
  return (
    <BottomLeaderboardText>
      <Typography
        variant="h6"
        align="center"
        color={time > 5 ? 'secondary' : 'primary'}
      >
        Next round in {time}...
      </Typography>
    </BottomLeaderboardText>
  );
};

export default NextRoundTitle;
