import { createTheme } from '@mui/material/styles';

export const darkM3Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#D0BCFF',
      surfaceTint: '#D0BCFF',
      onPrimary: '#381E72',
    },
    secondary: {
      main: '#CCC2DC',
      onSecondary: '#332D41',
    },
    background: {
      default: '#141218',
      paper: '#1D1B20',
    },
    error: {
      main: '#F2B8B5',
    },
    warning: {
      main: '#E6C435',
    },
    success: {
      main: '#A6D39F',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Vazirmatn", "Inter", "Roboto", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});
