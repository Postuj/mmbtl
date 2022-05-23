import Box from '@mui/material/Box';
import React, { FC } from 'react';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import styled from '@emotion/styled';
import { blueGrey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';

const TimeLinearProgress = styled(LinearProgress)(() => ({
  height: 30,
  borderRadius: 10,
  width: '100%',
  maxWidth: 1100,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: blueGrey[900],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 10,
    backgroundColor: 'primary',
  },
}));

type TimeBarProps = {
  currentTime: number;
  maxTime: number;
};

const TimeBar: FC<TimeBarProps> = ({ currentTime, maxTime }) => {
  return (
    <Box
      sx={{
        my: 2,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <TimeLinearProgress
        variant="determinate"
        value={(currentTime / maxTime) * 100}
      />
      <Box
        sx={{
          width: '100%',
          position: 'absolute',
          top: 0,
          zIndex: 2,
        }}
      >
        <Typography variant="subtitle1" color="secondary" align="center">
          {maxTime - currentTime} seconds left
        </Typography>
      </Box>
    </Box>
  );
};

export default TimeBar;
