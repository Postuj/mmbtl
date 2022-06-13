import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import leaveButtonStyle from '../../common/styles/LeaveButtonStyle';

const LeaveLobbyButton = () => {
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

export default LeaveLobbyButton;
