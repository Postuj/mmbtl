import Typography from '@mui/material/Typography';
import React, { FC } from 'react';
import LogInButton from './LogInButton';

const EmailLoginButton: FC = () => {
  const handleLogIn = () => {};

  return (
    <LogInButton logInHandler={handleLogIn}>
      <Typography variant="h6" color="secondary">
        Log in
      </Typography>
    </LogInButton>
  );
};

export default EmailLoginButton;
