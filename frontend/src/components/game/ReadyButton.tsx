import Button from '@mui/material/Button';
import React, { FC } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

type ReadyButtonProps = {};

const ReadyButton: FC<ReadyButtonProps> = () => {
  return (
    <Box sx={{ px: 1, display: 'flex', justifyContent: 'center' }}>
      <Button
        fullWidth
        color="primary"
        variant="contained"
        sx={{ my: 3, borderRadius: 3, maxWidth: 700 }}
      >
        <Typography variant="h6" color="secondary">
          ready
        </Typography>
      </Button>
    </Box>
  );
};

export default ReadyButton;
