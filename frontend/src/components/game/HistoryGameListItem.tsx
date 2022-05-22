import React, { FC } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import SentimentVeryDissatisfiedRoundedIcon from '@mui/icons-material/SentimentVeryDissatisfiedRounded';
import SentimentVerySatisfiedRoundedIcon from '@mui/icons-material/SentimentVerySatisfiedRounded';
import Typography from '@mui/material/Typography';
import { HistoryGame } from '../../common/types/game';

type HistoryGameListItemProps = {
  game: HistoryGame;
};

const HistoryGameListItem: FC<HistoryGameListItemProps> = ({ game }) => {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar
          sx={{
            bgcolor: 'transparent',
          }}
        >
          {game.victory ? (
            <SentimentVerySatisfiedRoundedIcon
              color="primary"
              style={{ fontSize: 40 }}
            />
          ) : (
            <SentimentVeryDissatisfiedRoundedIcon
              color="error"
              style={{ fontSize: 40 }}
            />
          )}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        sx={{
          color: 'secondary',
        }}
        primary={
          <Typography variant="subtitle1" color={game.victory ? 'primary' : 'error'}>
            {game.victory ? 'Victory' : 'Failure'}
          </Typography>
        }
        secondary={
          <Typography variant="body2" color="secondary">
            {game.date.toDateString()}
          </Typography>
        }
      ></ListItemText>
    </ListItem>
  );
};

export default HistoryGameListItem;
