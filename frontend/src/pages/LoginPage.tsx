import React, { FC } from 'react';
import LoginForm from '../components/forms/login/LoginForm';
import CenteredLayout from '../layouts/CenteredLayout';

const LoginPage: FC = () => {
  return (
    <CenteredLayout>
      <LoginForm />
    </CenteredLayout>
  );
};

export default LoginPage;
