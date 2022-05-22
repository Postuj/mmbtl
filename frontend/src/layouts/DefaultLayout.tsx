import Box from '@mui/material/Box'
import React, { FC } from 'react'
import { LayoutProps } from '../common/types/layoutProps'
import NavBar from '../components/navigation/NavBar'

const DefaultLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <NavBar />
      <Box
        sx={{
          mx: 2,
          mt: 1,
        }}
      >
        {children}
      </Box>
    </>
  )
}

export default DefaultLayout
