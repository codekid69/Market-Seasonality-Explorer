

import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import { MarketDashboard } from './components/Dashboard/MarketDashboard';
import { createCustomTheme } from './theme/theme';
import { ThemeMode } from './types/market';


const globalStyles = (
  <GlobalStyles
    styles={(theme) => ({
      '*': {
        boxSizing: 'border-box',
      },
      html: {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        scrollBehavior: 'smooth',
      },
      body: {
        margin: 0,
        padding: 0,
        fontFamily: theme.typography.fontFamily,
        backgroundColor: theme.palette.background.default,
        transition: 'background-color 0.3s ease',
      },

      '::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '::-webkit-scrollbar-track': {
        backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#2c2c2c',
        borderRadius: '4px',
      },
      '::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.mode === 'light' ? '#c1c1c1' : '#6c6c6c',
        borderRadius: '4px',
        '&:hover': {
          backgroundColor: theme.palette.mode === 'light' ? '#a8a8a8' : '#8c8c8c',
        },
      },

      '*:focus-visible': {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: '2px',
        borderRadius: '4px',
      },

      'button, .MuiButton-root, .MuiIconButton-root, .MuiToggleButton-root': {
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      },

      '.MuiCard-root': {
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },

      '.MuiButton-root, .MuiIconButton-root, .MuiToggleButton-root, .MuiChip-root': {
        userSelect: 'none',
      },
    })}
  />
);

function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {

    const savedTheme = localStorage.getItem('market-dashboard-theme') as ThemeMode;
    if (savedTheme) return savedTheme;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });


  const theme = useMemo(() => createCustomTheme(themeMode), [themeMode]);


  useEffect(() => {
    localStorage.setItem('market-dashboard-theme', themeMode);
  }, [themeMode]);


  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('market-dashboard-theme')) {
        setThemeMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleThemeToggle = () => {
    setThemeMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {globalStyles}
      <MarketDashboard
        themeMode={themeMode}
        onThemeToggle={handleThemeToggle}
      />
    </ThemeProvider>
  );
}

export default App;