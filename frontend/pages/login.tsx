import { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import LoginForm from '../components/forms/login/LoginForm';
import CenteredLayout from '../layouts/CenteredLayout';

const LoginPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>MemeBattle - Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CenteredLayout>
        <LoginForm />
      </CenteredLayout>
    </>
  );
};

export default LoginPage;
