import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import { FC, ReactNode } from 'react';
import PaperSection from '../../common/PaperSection';

type LeaderboardProps = {
  header: ReactNode;
  body: ReactNode;
};

const Leaderboard: FC<LeaderboardProps> = ({ header, body }) => {
  return (
    <Box sx={{ mt: 5, maxWidth: 1100, mx: 'auto' }}>
      <PaperSection>
        <Table>
          {header}
          {body}
        </Table>
      </PaperSection>
    </Box>
  );
};

export default Leaderboard;
