import TableBody from '@mui/material/TableBody';
import React, { FC } from 'react';
import { Player } from '../../../common/types/player';
import GameLeaderboardPlayerItem from './GameLeaderboardPlayerItem';
import Leaderboard from './Leaderboard';
import LeaderboardHead from './LeaderboardHead';

type GameLeaderboardProps = {
  players: Player[];
  rounds: number;
};

const GameLeaderboard: FC<GameLeaderboardProps> = ({ players, rounds }) => {
  const roundTitles: string[] = [];
  for (let i = 0; i < rounds; i++) {
    roundTitles.push(`@${i + 1}`);
  }
  return (
    <Leaderboard
      header={<LeaderboardHead headers={['#', 'Player', ...roundTitles, 'Total']} />}
      body={
        <TableBody>
          {players.map((p, i) => (
            <GameLeaderboardPlayerItem index={i} player={p} key={i} />
          ))}
        </TableBody>
      }
    />
  );
};

export default GameLeaderboard;
