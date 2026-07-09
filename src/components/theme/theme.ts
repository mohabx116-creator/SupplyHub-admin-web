import { createTheme } from '@mui/material/styles';

export const adminTheme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'light',
    primary: {
      main: '#153a55',
      dark: '#0b2236',
      light: '#2d5878',
    },
    secondary: {
      main: '#c78a2b',
    },
    background: {
      default: '#f4f7fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#102033',
      secondary: '#5d6b7c',
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: 'var(--font-sans), var(--font-arabic), sans-serif',
    h4: {
      fontWeight: 800,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'var(--shadow-lg)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
  },
});
