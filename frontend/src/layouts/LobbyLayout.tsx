import Box from '@mui/material/Box';
import React, { FC, ReactNode } from 'react';
import { LayoutProps } from '../common/types/layoutProps';
import NavBar from '../components/navigation/NavBar';

type LobbyLayoutProps = {
  bottomSection?: ReactNode[];
};

const LobbyLayout: FC<LayoutProps & LobbyLayoutProps> = ({
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
