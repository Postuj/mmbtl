import React, { FC, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const LoginForm: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Box
      sx={{
        mx: 3,
      }}
    >
      <Typography variant="h3" color="primary">
        Login
      </Typography>
      <TextField
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
      <TextField
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
    </Box>
  );
};

export default LoginForm;
