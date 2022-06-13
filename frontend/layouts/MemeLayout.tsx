import Box from '@mui/material/Box';
import React, { FC, ReactNode } from 'react';
import { ChildrenProps } from '../common/types/common';
import NavBar from '../components/navigation/NavBar';

type MemeChildrenProps = {
  title?: ReactNode;
};

const MemeLayout: FC<ChildrenProps & MemeChildrenProps> = ({ children, title }) => {
  return (
    <>
      <NavBar />
      <Box sx={{ px: 1, pt: 2 }}>{children}</Box>
    </>
  );
};

export default MemeLayout;
