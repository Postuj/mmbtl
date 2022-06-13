import { FC } from 'react';
import { Player } from '../../../common/types/player';
import LeaderboardPlayerItem from './LeaderboardPlayerItem';

type RoundLeaderboardPlayerItemProps = {
  player: Player;
  roundScore?: number;
  totalScore?: number;
  index: number;
};

const RoundLeaderboardPlayerItem: FC<RoundLeaderboardPlayerItemProps> = ({
  player,
  roundScore,
  totalScore,
  index,
}) => {
  const currentRoundScore =
    player.scores.length > 0 ? player.scores[player.scores.length - 1] : 0;
  const totalGameScore = player.scores.reduce((a, b) => a + b);
  return (
    <LeaderboardPlayerItem
      index={index}
      fields={[player.username, currentRoundScore, totalGameScore]}
    />
  );
};

export default RoundLeaderboardPlayerItem;
