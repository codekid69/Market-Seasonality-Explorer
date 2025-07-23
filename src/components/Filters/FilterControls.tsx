// filters

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
  TextField,
  Chip,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  CalendarMonth,
  Timeline,
  ShowChart,
  TrendingUp,
  WaterDrop,
  BarChart,
  ScatterPlot,
  Clear,
  FilterList,
} from '@mui/icons-material';
import { FilterState } from '../../types/market';
import { availableInstruments } from '../../data/mockData';

interface FilterControlsProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const timePeriods = ['1M', '3M', '6M', '1Y', '2Y', '5Y'] as const;
  
  const dataOverlays = [
    { value: 'heatmap', label: 'Heatmap', icon: <CalendarMonth fontSize="small" /> },
    { value: 'bars', label: 'Bars', icon: <BarChart fontSize="small" /> },
    { value: 'dots', label: 'Dots', icon: <ScatterPlot fontSize="small" /> },
    { value: 'performance', label: 'Performance', icon: <TrendingUp fontSize="small" /> },
    { value: 'liquidity', label: 'Liquidity', icon: <WaterDrop fontSize="small" /> },
    { value: 'volatility', label: 'Volatility', icon: <ShowChart fontSize="small" /> },
  ] as const;

  const calendarViews = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ] as const;

 
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const selectedInstrument = availableInstruments.find(
    (instrument) => instrument.value === filters.instrument
  );

  const activeFiltersCount = [
    filters.timePeriod !== '1Y',
    filters.calendarView !== 'daily',
    filters.instrument !== '',
    filters.dataOverlay !== 'heatmap',
  ].filter(Boolean).length;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
      <Card 
        sx={{ 
          width: '100%',
          maxWidth: 1400,
          mx: 2,
          borderRadius: 3,
          boxShadow: theme.palette.mode === 'light' 
            ? '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.12)' 
            : '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.4)',
          border: `1px solid ${theme.palette.mode === 'light' ? '#f0f0f0' : '#2a2a2a'}`,
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            mb: 4,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <FilterList sx={{ color: theme.palette.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
                Market Data Filters
              </Typography>
            </Box>
            {activeFiltersCount > 0 && (
              <Tooltip title="Clear all filters">
                <IconButton 
                  onClick={onClearFilters}
                  size="small"
                  sx={{ 
                    backgroundColor: theme.palette.error.main + '10',
                    color: theme.palette.error.main,
                    '&:hover': {
                      backgroundColor: theme.palette.error.main + '20',
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Clear fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {/* Main Filter Controls */}
          <Box
            sx={{
              display: 'grid',
              gap: { xs: 2, sm: 3, md: 4 },
              gridTemplateColumns: isMobile 
                ? '1fr'
                : isTablet
                ? 'repeat(2, 1fr)'
                : 'repeat(4, 1fr)',
              mb: 4,
            }}
          >
            {/* Time Period */}
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
                Time Period
              </Typography>
              <ToggleButtonGroup
                value={filters.timePeriod}
                exclusive
                onChange={(_, value) => value && handleFilterChange('timePeriod', value)}
                size="small"
                fullWidth
                sx={{
                  '& .MuiToggleButton-root': {
                    py: 1.5,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.main,
                      color: '#ffffff',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    },
                  },
                }}
              >
                {timePeriods.map((period) => (
                  <ToggleButton key={period} value={period}>
                    {period}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Box>

            {/* Calendar View */}
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
                Calendar View
              </Typography>
              <FormControl size="small" fullWidth>
                <Select
                  value={filters.calendarView}
                  onChange={(e) => handleFilterChange('calendarView', e.target.value)}
                  sx={{ 
                    fontSize: '0.875rem',
                    borderRadius: 2,
                  }}
                  displayEmpty
                >
                  {calendarViews.map((view) => (
                    <MenuItem key={view.value} value={view.value}>
                      {view.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Instrument Selector */}
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
                Instrument
              </Typography>
              <Autocomplete
                options={availableInstruments}
                groupBy={(option) => option.category}
                getOptionLabel={(option) => option.label}
                value={selectedInstrument || null}
                onChange={(_, value) => handleFilterChange('instrument', value?.value || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Select instrument..."
                    sx={{ 
                      '& .MuiInputBase-input': { fontSize: '0.875rem' },
                      '& .MuiOutlinedInput-root': { borderRadius: 2 },
                    }}
                  />
                )}
                size="small"
              />
            </Box>

            {/* Active Filters Count */}
            <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'center' }}>
              <Paper
                elevation={0}
                sx={{
                  px: 2,
                  py: 1,
                  backgroundColor: activeFiltersCount > 0 
                    ? theme.palette.primary.main + '10' 
                    : theme.palette.grey[100],
                  borderRadius: 2,
                  border: `1px solid ${
                    activeFiltersCount > 0 
                      ? theme.palette.primary.main + '30' 
                      : theme.palette.divider
                  }`,
                }}
              >
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: 600,
                    color: activeFiltersCount > 0 
                      ? theme.palette.primary.main 
                      : theme.palette.text.secondary,
                  }}
                >
                  {activeFiltersCount} active filter{activeFiltersCount !== 1 ? 's' : ''}
                </Typography>
              </Paper>
            </Box>
          </Box>

      
          {activeFiltersCount > 0 && (
            <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
                Active Filters
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                {filters.timePeriod !== '1Y' && (
                  <Chip
                    label={`Period: ${filters.timePeriod}`}
                    size="small"
                    onDelete={() => handleFilterChange('timePeriod', '1Y')}
                    sx={{ 
                      fontSize: '0.75rem',
                      borderRadius: 2,
                      '& .MuiChip-deleteIcon': {
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                )}
                {filters.calendarView !== 'daily' && (
                  <Chip
                    label={`View: ${filters.calendarView}`}
                    size="small"
                    onDelete={() => handleFilterChange('calendarView', 'daily')}
                    sx={{ 
                      fontSize: '0.75rem',
                      borderRadius: 2,
                      '& .MuiChip-deleteIcon': {
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                )}
                {filters.instrument && (
                  <Chip
                    label={selectedInstrument?.label || filters.instrument}
                    size="small"
                    onDelete={() => handleFilterChange('instrument', '')}
                    sx={{ 
                      fontSize: '0.75rem',
                      borderRadius: 2,
                      '& .MuiChip-deleteIcon': {
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                )}
                {filters.dataOverlay !== 'heatmap' && (
                  <Chip
                    label={`Overlay: ${filters.dataOverlay}`}
                    size="small"
                    onDelete={() => handleFilterChange('dataOverlay', 'heatmap')}
                    sx={{ 
                      fontSize: '0.75rem',
                      borderRadius: 2,
                      '& .MuiChip-deleteIcon': {
                        fontSize: '0.875rem',
                      },
                    }}
                  />
                )}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};