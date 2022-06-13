import Box from '@mui/material/Box'
import React, { FC } from 'react'
import { ChildrenProps } from '../common/types/common'
import NavBar from '../components/navigation/NavBar'

const DefaultLayout: FC<ChildrenProps> = ({ children }) => {
  return (
    <>
      <NavBar />
      <Box
        sx={{
          px: 2,
          mx: 'auto',
          mt: 1,
          maxWidth: 1700,
        }}
      >
        {children}
      </Box>
    </>
  )
}

export default DefaultLayout
