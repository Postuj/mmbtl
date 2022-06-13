import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import { ChildrenProps } from '../../common/types/common';

type PaperSectionProps = {
  title?: string;
  secondary?: string;
  sx?: SxProps<Theme> | undefined;
};

const PaperSection: FC<PaperSectionProps & ChildrenProps> = ({
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
                mx: 1,
              }
        }
      >
        {title && (
          <Typography variant="h6" color="secondary">
            {title}
          </Typography>
        )}
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
          className="hidden-scroll"
          variant="outlined"
          sx={{
            bgcolor: 'background.paper',
            p: 1,
            borderRadius: 3,
            overflowX: 'scroll',
          }}
        >
          {children}
        </Paper>
      )}
    </>
  );
};

export default PaperSection;
