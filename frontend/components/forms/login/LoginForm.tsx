import React, { FC, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import EmailLoginButton from './buttons/EmailLoginButton';
import GoogleLogInButton from './buttons/GoogleLogInButton';
import styled from '@emotion/styled';

const StyledTextField = styled(TextField)({
  input: {
    color: '#EEEEEE',
  },
  '& label': {
    color: '#EEEEEE',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#EEEEEE',
    },
  },
});

const LoginForm: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Box
      sx={{
        mx: 3,
      }}
    >
      <Typography variant="h2" color="primary" sx={{ mb: 2, ml: 1 }}>
        Login
      </Typography>
      <StyledTextField
        sx={{
          my: 1,
        }}
        fullWidth
        type="email"
        id="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        variant="outlined"
        color="primary"
      />
      <StyledTextField
        sx={{
          my: 1,
        }}
        fullWidth
        type="password"
        id="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        variant="outlined"
        color="primary"
      />
      <EmailLoginButton email={email} password={password} />
      <Divider
        sx={{
          my: 3,
          color: 'secondary.main',
          '&::before, &::after': {
            borderColor: 'secondary.main',
          },
        }}
      >
        OR
      </Divider>
      <GoogleLogInButton />
    </Box>
  );
};

export default LoginForm;
