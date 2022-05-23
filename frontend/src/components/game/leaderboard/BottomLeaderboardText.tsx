import React, { FC } from 'react';
import Box from '@mui/material/Box';
import { LayoutProps } from '../../../common/types/layoutProps';

const BottomLeaderboardText: FC<LayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        mt: 3,
      }}
    >
      {children}
    </Box>
  );
};

export default BottomLeaderboardText;
