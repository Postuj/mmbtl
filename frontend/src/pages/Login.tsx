import React, { FC } from 'react'
import Typography from '@mui/material/Typography'
import CenteredLayout from '../layouts/CenteredLayout'
import LoginForm from '../components/forms/LoginForm'

const Login: FC = () => {
  return (
    <CenteredLayout>
      <LoginForm />
    </CenteredLayout>
  )
}

export default Login
