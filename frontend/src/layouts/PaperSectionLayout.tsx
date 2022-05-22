import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import { LayoutProps } from '../common/types/layoutProps';

type PaperSectionLayoutProps = {
  title: string;
  secondary?: string;
  sx?: SxProps<Theme> | undefined;
};

const PaperSectionLayout: FC<PaperSectionLayoutProps & LayoutProps> = ({
  children,
  title,
  secondary,
  sx,
}) => {
  return (
    <>
      <Box
        sx={
          sx
            ? sx
            : {
                mt: 2,
                display: 'flex',
                justifyContent: 'space-between',
              }
        }
      >
        <Typography variant="h6" color="secondary">
          {title}
        </Typography>
        {secondary && (
          <Typography
            textTransform="uppercase"
            variant="h6"
            color="primary"
            fontWeight={500}
          >
            {secondary}
          </Typography>
        )}
      </Box>
      {children && (
        <Paper
          variant="outlined"
          sx={{
            bgcolor: 'background.paper',
            p: 1,
          }}
        >
          {children}
        </Paper>
      )}
    </>
  );
};

export default PaperSectionLayout;
