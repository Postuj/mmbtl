import React, { FC } from 'react';
import PaperSectionLayout from '../../layouts/PaperSectionLayout';
import { Player } from '../../common/types/player';
import List from '@mui/material/List';
import PlayerListItem from '../player/PlayerListItem';

type LobbyPlayerListProps = {
  players: Player[];
  maxPlayers: number;
};

const LobbyPlayerList: FC<LobbyPlayerListProps> = ({ players, maxPlayers }) => {
  return (
    <PaperSectionLayout
      title="Players"
      secondary={`${players.length}/${maxPlayers}`}
    >
      <List dense sx={{ width: '100%', py: 0 }}>
        {players.map((p, i) => (
          <PlayerListItem player={p} key={i} />
        ))}
      </List>
    </PaperSectionLayout>
  );
};

export default LobbyPlayerList;
