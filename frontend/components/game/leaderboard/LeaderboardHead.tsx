import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { FC } from 'react';
import Typography from '@mui/material/Typography';

type LeaderboardHeadProps = {
  headers: string[];
}

const LeaderboardHead: FC<LeaderboardHeadProps> = ({headers}) => {
  return (
    <TableHead>
      <TableRow>
        {headers.map((text) => (
          <TableCell key={text}>
            <Typography variant="subtitle1" color="secondary">
              {text}
            </Typography>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default LeaderboardHead;
