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
})

const GameButton: React.FC<GameButtonProps> = ({ title, icon }) => {
  return (
    <GameButtonElement variant="contained" color="primary">
      {icon}
      <Typography variant="h6" color="secondary">
        {title}
      </Typography>
    </GameButtonElement>
  )
}

export default GameButton
