import Box from '@mui/material/Box';
import React, { FC, ReactNode } from 'react';
import { LayoutProps } from '../common/types/layoutProps';

type MemeLayoutProps = {
  title?: ReactNode;
};

const MemeLayout: FC<LayoutProps & MemeLayoutProps> = ({ children, title }) => {
  return (
      <Box>{children}</Box>
  );
};

export default MemeLayout;
