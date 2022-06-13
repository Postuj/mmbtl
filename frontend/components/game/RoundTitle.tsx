import Typography from '@mui/material/Typography';
import React, { FC } from 'react';

type RoundTitleProps = {
  primary?: string;
  secondary?: string;
};

const RoundTitle: FC<RoundTitleProps> = ({ primary, secondary }) => {
  return (
    <>
      {primary && (
        <Typography align="center" variant="h4" color="secondary">
          {primary}
        </Typography>
      )}
      {secondary && (
        <Typography
          align="center"
          variant="subtitle1"
          color="primary"
          textTransform="capitalize"
        >
          {secondary}
        </Typography>
      )}
    </>
  );
};

export default RoundTitle;
