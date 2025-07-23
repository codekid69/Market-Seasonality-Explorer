

import { createTheme, ThemeOptions } from '@mui/material/styles';
import { ThemeMode, ColorScheme } from '../types/market';

const getColorPalette = (mode: ThemeMode, colorScheme: ColorScheme) => {
  const isLight = mode === 'light';

  // Base color definitions following Material Design 3
  const baseColors = {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#0097a7',
      light: '#4fc3f7',
      dark: '#00838f',
    },
    accent: {
      main: '#f57c00',
      light: '#ffb74d',
      dark: '#ef6c00',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    error: {
      main: '#d32f2f',
      light: '#f44336',
      dark: '#c62828',
    },
  };

  if (colorScheme === 'high-contrast') {
    return {
      ...baseColors,
      primary: { main: isLight ? '#000000' : '#ffffff', light: '#333333', dark: '#000000' },
      text: {
        primary: isLight ? '#000000' : '#ffffff',
        secondary: isLight ? '#333333' : '#cccccc',
      },
    };
  }

  if (colorScheme === 'colorblind') {
    return {
      ...baseColors,
      success: { main: '#0077bb', light: '#33aadd', dark: '#004488' },
      error: { main: '#cc3311', light: '#ee6644', dark: '#aa1100' },
      warning: { main: '#ee7733', light: '#ffaa66', dark: '#cc5500' },
    };
  }

  return baseColors;
};

export const createCustomTheme = (mode: ThemeMode, colorScheme: ColorScheme = 'default') => {
  const colors = getColorPalette(mode, colorScheme);
  
  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      ...colors,
      background: {
        default: mode === 'light' ? '#fafafa' : '#0a0a0a',
        paper: mode === 'light' ? '#ffffff' : '#1a1a1a',
      },
      divider: mode === 'light' ? '#e0e0e0' : '#333333',
    },
    typography: {
      fontFamily: '"Inter", "SF Pro Display", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: '-0.01em',
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h5: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      body1: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
        fontWeight: 400,
      },
      body2: {
        fontSize: '0.75rem',
        lineHeight: 1.5,
        fontWeight: 400,
      },
      caption: {
        fontSize: '0.6875rem',
        lineHeight: 1.4,
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
            fontWeight: 500,
            fontSize: '0.875rem',
            padding: '8px 16px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: mode === 'light' 
              ? '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.12)' 
              : '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.4)',
            border: `1px solid ${mode === 'light' ? '#f0f0f0' : '#2a2a2a'}`,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontSize: '0.75rem',
            fontWeight: 500,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#1a1a1a',
            color: mode === 'light' ? '#1a1a1a' : '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            borderBottom: `1px solid ${mode === 'light' ? '#f0f0f0' : '#2a2a2a'}`,
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.75rem',
            padding: '6px 12px',
            border: `1px solid ${mode === 'light' ? '#e0e0e0' : '#404040'}`,
            '&.Mui-selected': {
              backgroundColor: colors.primary.main,
              color: '#ffffff',
              '&:hover': {
                backgroundColor: colors.primary.dark,
              },
            },
          },
        },
      },
    },
  };

  return createTheme(themeOptions);
};