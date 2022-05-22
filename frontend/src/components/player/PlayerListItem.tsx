import React, { FC } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Player } from '../../common/types/player';

type PlayerListItem = {
  player: Player;
};

const PlayerListItem: FC<PlayerListItem> = ({ player }) => {
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar
          sx={{
            bgcolor: 'transparent',
          }}
        >
          <AccountCircleOutlinedIcon color="primary" fontSize="large" />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        sx={{
          color: 'secondary',
        }}
        primary={
          <Typography variant="h6" color="primary">
            {player.username}
          </Typography>
        }
        secondary={
          <Typography variant="body2" color="secondary">
            Score: {player.score}
          </Typography>
        }
      ></ListItemText>
    </ListItem>
  );
};

export default PlayerListItem;
