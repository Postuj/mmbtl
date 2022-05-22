import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const LeaveLobbyButton = () => {
  return (
    <Button sx={{ mt: 1 }} variant="contained" color="error" fullWidth>
      <Typography variant="h6" color="secondary">
        Leave
      </Typography>
    </Button>
  );
};

export default LeaveLobbyButton;
