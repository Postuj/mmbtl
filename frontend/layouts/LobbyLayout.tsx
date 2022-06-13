import Box from '@mui/material/Box';
import React, { FC, ReactNode } from 'react';
import { ChildrenProps } from '../common/types/common';
import NavBar from '../components/navigation/NavBar';

type LobbyChildrenProps = {
  bottomSection?: ReactNode[];
};

const LobbyLayout: FC<ChildrenProps & LobbyChildrenProps> = ({
  children,
  bottomSection,
}) => {
  return (
    <>
      <NavBar />
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          mx: 1,
        }}
      >
        <Box>{children}</Box>
        {bottomSection && (
          <Box sx={{ width: '100%' }} alignSelf="flex-end" flexShrink={1}>
            {bottomSection}
          </Box>
        )}
      </Box>
    </>
  );
};

export default LobbyLayout;
