import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GoogleIcon from '@mui/icons-material/Google';
// import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { FC } from 'react';
import LogInButton from './LogInButton';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import firebaseApp from '../../../../firebase/client';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';

const GoogleLogInButton: FC = () => {
  const auth = getAuth(firebaseApp);
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  return (
    <LogInButton logInHandler={signInWithGoogle}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" color="secondary">
          Log in with
        </Typography>
        <GoogleIcon sx={{ ml: 0.5 }} color="secondary" />
      </Box>
    </LogInButton>
  );
};

export default GoogleLogInButton;
