import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import React, { FC } from 'react';

type LeaderboardPlayerItemProps = {
  index: number;
  fields: (string | number)[];
};

const lastRowStyle = {
  '&:last-child th, &:last-child td': {
    borderBottom: 0,
  },
};

const LeaderboardPlayerItem: FC<LeaderboardPlayerItemProps> = ({
  fields,
  index,
}) => {
  const color = index + 1 === 1 ? 'primary' : 'secondary';
  return (
    <TableRow sx={lastRowStyle}>
      {[`${index + 1}.`, ...fields].map((text, i) => (
        <TableCell key={i}>
          <Typography variant="subtitle1" color={color}>
            {text ? text : 0}
          </Typography>
        </TableCell>
      ))}
    </TableRow>
  );
};

export default LeaderboardPlayerItem;
