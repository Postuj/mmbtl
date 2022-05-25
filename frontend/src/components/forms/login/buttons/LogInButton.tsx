import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React, { FC, ReactNode } from 'react';
import { ChildrenProps } from '../../../../common/types/common';

type LogInButtonProps = {
  logInHandler: Function;
  color?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning'
    | undefined;
};

const LogInButton: FC<LogInButtonProps & ChildrenProps> = ({
  logInHandler,
  color,
  children,
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Button
        sx={{ mt: 2, borderRadius: 2, maxWidth: 700 }}
        onClick={() => logInHandler()}
        variant="contained"
        color={color ? color : 'primary'}
        fullWidth
      >
        {children}
      </Button>
    </Box>
  );
};

export default LogInButton;
