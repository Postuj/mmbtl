import Typography from '@mui/material/Typography';
import React, { FC } from 'react';
import useAuth from '../../../../hooks/useAuth';
import LogInButton from './LogInButton';

type EmailLoginButtonType = {
  email: string;
  password: string;
};

const EmailLoginButton: FC<EmailLoginButtonType> = ({ email, password }) => {
  const { authService } = useAuth();
  const handleLogInClick = async () => {
    if (!email || !password) return;

    console.log('Loggin in');
    await authService.signInWithEmail!(email, password);
  };

  return (
    <LogInButton logInHandler={handleLogInClick}>
      <Typography variant="h6" color="secondary">
        Log in
      </Typography>
    </LogInButton>
  );
};

export default EmailLoginButton;
