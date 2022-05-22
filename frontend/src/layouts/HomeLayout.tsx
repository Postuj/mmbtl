import Box from '@mui/material/Box'
import React, { FC } from 'react'
import { LayoutProps } from '../common/types/props'
import NavBar from '../components/navigation/NavBar'

const HomeLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <NavBar />
      <Box
        sx={{
          mx: 2,
          mt: 2,
        }}
      >
        {children}
      </Box>
    </>
  )
}

export default HomeLayout
