import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React, { FC } from 'react';
import leaveButtonStyle from '../../common/styles/LeaveButtonStyle';

const LeaveGameButton: FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Button sx={leaveButtonStyle} variant="contained" color="error" fullWidth>
        <Typography variant="h6" color="secondary">
          Leave
        </Typography>
      </Button>
    </Box>
  );
};

export default LeaveGameButton;
