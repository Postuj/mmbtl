import styled from '@emotion/styled';
import Button from '@mui/material/Button';
import React, { FC } from 'react';
import Typography from '@mui/material/Typography';

type ReadyButtonProps = {};

const ReadyButton: FC<ReadyButtonProps> = () => {
  return (
    <Button
      fullWidth
      color="primary"
      variant="contained"
      sx={{ my: 2, borderRadius: 3, border: '2px #111 solid' }}
    >
      <Typography variant="h6" color="secondary">
        ready
      </Typography>
    </Button>
  );
};

export default ReadyButton;
