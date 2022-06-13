import Box from '@mui/material/Box';
import React, { FC } from 'react';
import { ChildrenProps } from '../common/types/common';
import NavBar from '../components/navigation/NavBar';

type HomeChildrenProps = {};

const HomeLayout: FC<HomeChildrenProps & ChildrenProps> = ({children}) => {
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
  );
};

export default HomeLayout;
