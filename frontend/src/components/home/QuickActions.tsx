import React from 'react'
import GameButton from './GameButton'
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import PaperSection from '../common/PaperSection'
import Grid from '@mui/material/Grid'

const iconTheme = { fontSize: 40, color: 'eeeeee' }

const buttons = [
  <GameButton
    title="host"
    icon={<DnsRoundedIcon style={iconTheme} />}
  />,
  <GameButton
    title="join"
    icon={<PersonAddAlt1RoundedIcon style={iconTheme} />}
  />,
  <GameButton title="custom" icon={<CreateOutlinedIcon style={iconTheme} />} />,
]

const QuickActions: React.FC = () => {
  return (
    <PaperSection title="Quick actions">
      <Grid container spacing={2}>
        {buttons.map((b, i) => (
          <Grid key={i} item xs={6}>
            {b}
          </Grid>
        ))}
      </Grid>
    </PaperSection>
  )
}

export default QuickActions
