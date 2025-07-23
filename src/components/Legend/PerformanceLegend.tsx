import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Grid,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Warning,
  Circle,
  FiberManualRecord,
  Today,
  Remove,
  ShowChart,
} from '@mui/icons-material';


export const PerformanceLegend: React.FC = () => {
  const theme = useTheme();

  const performanceColors = [
    {
      label: 'Strong Positive (>3%)',
      color: theme.palette.mode === 'light' ? '#1b5e20' : '#2e7d32',
      icon: <TrendingUp fontSize="small" />,
      description: 'Exceptional bullish performance'
    },
    {
      label: 'Positive (1-3%)',
      color: theme.palette.mode === 'light' ? '#2e7d32' : '#4caf50',
      icon: <TrendingUp fontSize="small" />,
      description: 'Strong upward movement'
    },
    {
      label: 'Neutral (±1%)',
      color: theme.palette.mode === 'light' ? '#f57c00' : '#ff9800',
      icon: <Circle fontSize="small" />,
      description: 'Sideways price action'
    },
    {
      label: 'Negative (-1 to -3%)',
      color: theme.palette.mode === 'light' ? '#d32f2f' : '#f44336',
      icon: <TrendingDown fontSize="small" />,
      description: 'Bearish price movement'
    },
    {
      label: 'Strong Negative (<-3%)',
      color: theme.palette.mode === 'light' ? '#b71c1c' : '#d32f2f',
      icon: <TrendingDown fontSize="small" />,
      description: 'Significant decline'
    },
    {
      label: 'No Data',
      color: theme.palette.mode === 'light' ? '#f5f5f5' : '#2a2a2a',
      icon: <Circle fontSize="small" />,
      description: 'Market closed or data unavailable'
    },
  ];

  const volatilityLevels = [
    { label: 'Low Volatility (<1.5%)', intensity: 0.1, color: '#4caf50' },
    { label: 'Medium Volatility (1.5-3%)', intensity: 0.4, color: '#ff9800' },
    { label: 'High Volatility (3-5%)', intensity: 0.7, color: '#f44336' },
    { label: 'Extreme Volatility (>5%)', intensity: 1.0, color: '#d32f2f' },
  ];

  const specialIndicators = [
    {
      icon: <Warning sx={{ color: theme.palette.warning.main }} />,
      label: 'High Volatility Alert',
      description: 'Volatility exceeds 5%'
    },
    {
      icon: <Today sx={{ color: theme.palette.primary.main }} />,
      label: 'Today\'s Date',
      description: 'Current date highlight'
    },
    {
      icon: <TrendingUp sx={{ color: theme.palette.success.main }} />,
      label: 'Performance Arrow',
      description: 'Significant daily movement'
    },
  ];

  return (
    <Card sx={{ position: 'sticky', top: 88, borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
       
        </Typography>

        {/* Performance Colors */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
            Daily Performance Colors
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 1.5 }}>

            {performanceColors.map((item, index) => (
              <Paper key={index} elevation={0} sx={{
                p: 2,
                backgroundColor: theme.palette.grey[50],
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 32 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: item.color,
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Box
                      sx={{
                        color: theme.palette.getContrastText(item.color),
                        fontSize: 12,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {React.cloneElement(item.icon, {
                        sx: { fontSize: 12 }
                      })}
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem' }}>
                    {item.description}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Volatility Indicators */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
            Volatility Levels
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {volatilityLevels.map((item, index) => (
              <Box key={index} sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 1.5,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}>
                <Box sx={{ minWidth: 32 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: theme.palette.grey[200],
                      borderRadius: 1.5,
                      position: 'relative',
                      overflow: 'hidden',
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: `${item.intensity * 100}%`,
                        backgroundColor: item.color,
                        opacity: 0.8,
                      }}
                    />
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Special Indicators */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
            Special Indicators
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {specialIndicators.map((item, index) => (
              <Box key={index} sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 1.5,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}>
                <Box sx={{ minWidth: 32, display: 'flex', justifyContent: 'center' }}>
                  {React.cloneElement(item.icon, { fontSize: 'small' })}
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6875rem' }}>
                    {item.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Quick Stats */}
        <Box sx={{
          mt: 3,
          pt: 3,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.primary.main + '08',
          borderRadius: 2,
          p: 2.5,
        }}>
          <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 1.5 }}>
            Market Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                {/* TODO: Calculate from actual market data */}
                Avg. Daily Performance: <Box component="span" sx={{ fontWeight: 700, color: theme.palette.success.main }}>+0.12%</Box>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                Avg. Volatility: <Box component="span" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>2.8%</Box>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                Data Coverage: <Box component="span" sx={{ fontWeight: 700, color: theme.palette.info.main }}>98.5%</Box>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};