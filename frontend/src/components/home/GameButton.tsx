import React, { ReactNode } from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

type GameButtonProps = {
  title: string
  icon: ReactNode
}

const GameButtonElement = styled(Button)({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  height: 90,
})

const GameButton: React.FC<GameButtonProps> = ({ title, icon }) => {
  return (
    <GameButtonElement variant="contained" color="primary" fullWidth>
      {icon}
      <Typography variant="subtitle1" color="secondary">
        {title}
      </Typography>
    </GameButtonElement>
  )
}

export default GameButton
