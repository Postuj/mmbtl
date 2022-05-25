import React, { FC } from 'react';
import Box from '@mui/material/Box';
import { ChildrenProps } from '../../../common/types/common';

const BottomLeaderboardText: FC<ChildrenProps> = ({ children }) => {
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
