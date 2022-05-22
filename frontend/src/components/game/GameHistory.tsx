import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { FC } from 'react';
import PaperSectionLayout from '../../layouts/PaperSectionLayout';
import SentimentDissatisfiedRoundedIcon from '@mui/icons-material/SentimentDissatisfiedRounded';
import Typography from '@mui/material/Typography';
import { HistoryGame } from '../../common/types/game';
import HistoryGameListItem from './HistoryGameListItem';

const pastGames: HistoryGame[] = [
    { date: new Date(), victory: true, score: 21 },
    { date: new Date(), victory: false, score: 11 },
    { date: new Date(), victory: false, score: 16 },
    { date: new Date(), victory: true, score: 23 },
    { date: new Date(), victory: false, score: 10 },
];

const GameHistory: FC = () => {
  const hasMoreThan3Games = pastGames.length > 3;
  const hasAnyGames = pastGames.length > 0;
  return (
    <PaperSectionLayout title="Game history">
      {hasAnyGames && (
        <List sx={{ width: '100%', py: 0 }} dense>
          {pastGames
            .slice(0, hasMoreThan3Games ? 3 : pastGames.length)
            .map((g, i) => (
              <HistoryGameListItem game={g} key={i} />
            ))}
        </List>
      )}
      {!hasAnyGames && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Typography align="center" variant="subtitle1" color="secondary">
            Your history is empty
          </Typography>
          <SentimentDissatisfiedRoundedIcon
            sx={{
              mt: 0.5,
              ml: 0.5,
            }}
            color="secondary"
            fontSize="small"
          />
        </Box>
      )}
      {hasMoreThan3Games && (
        <Typography align="center" variant="subtitle1" color="primary">
          Show more
        </Typography>
      )}
    </PaperSectionLayout>
  );
};

export default GameHistory;
