import React, { FC } from 'react';
import PaperSection from '../common/PaperSection';
import { Player } from '../../common/types/player';
import List from '@mui/material/List';
import PlayerListItem from '../player/PlayerListItem';
import Box from '@mui/material/Box';

type LobbyPlayerListProps = {
  players: Player[];
  maxPlayers: number;
};

const LobbyPlayerList: FC<LobbyPlayerListProps> = ({ players, maxPlayers }) => {
  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
      <PaperSection
        title="Players"
        secondary={`${players.length}/${maxPlayers}`}
      >
        <List dense sx={{ width: '100%', py: 0 }}>
          {players.map((p, i) => (
            <PlayerListItem player={p} key={i} />
          ))}
        </List>
      </PaperSection>
    </Box>
  );
};

export default LobbyPlayerList;
