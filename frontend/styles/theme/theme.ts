import { createTheme } from '@mui/material/styles';
import { red, blueGrey } from '@mui/material/colors';

const theme = createTheme({
  typography: {
    fontFamily: ['Ubuntu'].join(','),
  },
  palette: {
    primary: {
      main: '#42B883',
    },
    secondary: {
      main: '#EEEEEE',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: blueGrey[800],
      paper: blueGrey[900],
    },
  },
});

export default theme;
