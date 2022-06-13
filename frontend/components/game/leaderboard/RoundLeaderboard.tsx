import TableBody from '@mui/material/TableBody';
import React, { FC } from 'react';
import { Player } from '../../../common/types/player';
import Leaderboard from './Leaderboard';
import LeaderboardHead from './LeaderboardHead';
import RoundLeaderboardPlayerItem from './RoundLeaderboardPlayerItem';

type RoundLeaderboardProps = {
  players: Player[];
};

const RoundLeaderboard: FC<RoundLeaderboardProps> = ({ players }) => {
  return (
    <Leaderboard
      header={<LeaderboardHead headers={['#', 'Player', 'Score', 'Total']} />}
      body={
        <TableBody>
          {players.map((p, i) => (
            <RoundLeaderboardPlayerItem index={i} player={p} key={i} />
          ))}
        </TableBody>
      }
    />
  );
};

export default RoundLeaderboard;
