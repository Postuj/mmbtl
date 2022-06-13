import Box from '@mui/material/Box'
import React, { FC } from 'react'
import { ChildrenProps } from '../common/types/common'

const CenteredLayout: FC<ChildrenProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'background.paper'
      }}
    >
      {children}
    </Box>
  )
}

export default CenteredLayout
