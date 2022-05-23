import Box from '@mui/material/Box';
import React, { FC, ReactNode } from 'react';
import { LayoutProps } from '../common/types/layoutProps';
import NavBar from '../components/navigation/NavBar';

type MemeLayoutProps = {
  title?: ReactNode;
};

const MemeLayout: FC<LayoutProps & MemeLayoutProps> = ({ children, title }) => {
  return (
    <>
      <NavBar />
      <Box sx={{ px: 1, pt: 2 }}>{children}</Box>
    </>
  );
};

export default MemeLayout;
