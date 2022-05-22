import Box from '@mui/material/Box'
import React, { FC } from 'react'
import { LayoutProps } from '../common/types/layoutProps'

const CenteredLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      {children}
    </Box>
  )
}

export default CenteredLayout
