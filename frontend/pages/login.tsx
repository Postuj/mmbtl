import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import LoginForm from '../components/forms/login/LoginForm';
import useAuth from '../hooks/useAuth';
import CenteredLayout from '../layouts/CenteredLayout';

const LoginPage: NextPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  if (user) router.push('/');
  
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
