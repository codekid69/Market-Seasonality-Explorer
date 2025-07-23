// navbar

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Tooltip,
  Switch,
} from '@mui/material';
import {
  Settings,
  Refresh,
  DarkMode,
  LightMode,
  Palette,
} from '@mui/icons-material';
import { ThemeMode } from '../../types/market';

interface TopAppBarProps {
  themeMode: ThemeMode;
  onThemeToggle: () => void;
  onRefresh: () => void;
  onSettingsClick: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  themeMode,
  onThemeToggle,
  onRefresh,
  onSettingsClick,
}) => {
  return (
    <AppBar position="fixed" elevation={0}>
      <Toolbar sx={{ minHeight: '64px !important' }}>
        <Typography 
          variant="h6" 
          component="h1" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 700,
            fontSize: '1.125rem',
            letterSpacing: '-0.01em',
          }}
        >
          Market Seasonality Explorer
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Theme Toggle */}
          <Tooltip title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton
              onClick={onThemeToggle}
              size="small"
              sx={{ 
                width: 40, 
                height: 40,
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
              }}
            >
              {themeMode === 'light' ? <DarkMode fontSize="small" /> : <LightMode fontSize="small" />}
            </IconButton>
          </Tooltip>
          
          {/* Refresh Button */}
          <Tooltip title="Refresh market data">
            <IconButton
              onClick={onRefresh}
              size="small"
              sx={{ 
                width: 40, 
                height: 40,
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
              }}
            >
              <Refresh fontSize="small" />
            </IconButton>
          </Tooltip>
          
          {/* Settings Button */}
          <Tooltip title="Settings">
            <IconButton
              onClick={onSettingsClick}
              size="small"
              sx={{ 
                width: 40, 
                height: 40,
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
              }}
            >
              <Settings fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};