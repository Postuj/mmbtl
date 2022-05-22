import React from 'react'
import Grid from '@mui/material/Grid'
import GameButton from './GameButton'
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded'

const QuickActions: React.FC = () => {
  return (
    <Grid container spacing={1}>
      <Grid item>
        <GameButton
          title="play"
          icon={<SportsEsportsRoundedIcon style={{ fontSize: 40 }} />}
        />
      </Grid>
    </Grid>
  )
}

export default QuickActions
