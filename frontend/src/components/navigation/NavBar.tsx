import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import SportsEsportsRoundedIcon from '@mui/icons-material/SportsEsportsRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'

const NavBar: React.FC = () => {
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: 'background.paper',
      }}
    >
      <Toolbar>
        <IconButton
          aria-label="navigation"
          size="large"
          edge="start"
          color="secondary"
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton aria-label="home" size="large" color="primary">
          <SportsEsportsRoundedIcon style={{ fontSize: 40 }}/>
        </IconButton>
        <Box component="div" sx={{ flexGrow: 1 }} />
        <IconButton
          aria-label="notifications"
          size="large"
          color="secondary"
          edge="end"
        >
          <Badge badgeContent={5} color="error">
            <NotificationsNoneRoundedIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default NavBar
