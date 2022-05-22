import Typography from '@mui/material/Typography';
import React, { FC } from 'react';

type RoundTitleProps = {
  roundIndex: number;
  memeTitle: string;
};

const RoundTitle: FC<RoundTitleProps> = ({ roundIndex, memeTitle }) => {
  return (
    <>
      <Typography align="center" variant="h4" color="secondary">
        Round {roundIndex}
      </Typography>
      <Typography align="center" variant="subtitle1" color="primary" textTransform="capitalize">
        {memeTitle}
      </Typography>
    </>
  );
};

export default RoundTitle;
