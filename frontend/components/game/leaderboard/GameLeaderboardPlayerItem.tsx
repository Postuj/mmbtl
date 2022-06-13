import React, { FC } from 'react';
import { Player } from '../../../common/types/player';
import LeaderboardPlayerItem from './LeaderboardPlayerItem';

type GameLeaderboardPlayerItemProps = {
  player: Player;
  index: number;
};

const GameLeaderboardPlayerItem: FC<GameLeaderboardPlayerItemProps> = ({
  index,
  player,
}) => {
  const totalScore = player.scores.reduce((a, b) => a + b);
  return (
    <LeaderboardPlayerItem
      index={index}
      fields={[player.username, ...player.scores, totalScore]}
    />
  );
};

export default GameLeaderboardPlayerItem;
