

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
} from '@mui/material';
import {
  CalendarMonth,
  Timeline,
  ShowChart,
  TrendingUp,
  WaterDrop,
  BarChart,
} from '@mui/icons-material';
import { FilterState } from '../../types/market';
import { availableInstruments } from '../../data/mockData';

interface MarketFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

export const MarketFilters: React.FC<MarketFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const timePeriods = ['1M', '3M', '6M', '1Y', '2Y', '5Y'] as const;
  
  const dataOverlays = [
    { value: 'heatmap', label: 'Heatmap', icon: <CalendarMonth /> },
    { value: 'bars', label: 'Bars', icon: <BarChart /> },
    { value: 'dots', label: 'Dots', icon: <Timeline /> },
    { value: 'performance', label: 'Performance', icon: <TrendingUp /> },
    { value: 'liquidity', label: 'Liquidity', icon: <WaterDrop /> },
    { value: 'volatility', label: 'Volatility', icon: <ShowChart /> },
  ] as const;

  const calendarViews = ['daily', 'weekly', 'monthly'] as const;

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const selectedInstrument = availableInstruments.find(
    (instrument) => instrument.value === filters.instrument
  );

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Market Data Filters
          </Typography>
          <Chip
            label={`${activeFiltersCount} active`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: isMobile 
              ? '1fr'
              : 'repeat(auto-fit, minmax(200px, 1fr))',
          }}
        >
          {/* Time Period Toggle */}
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Time Period
            </Typography>
            <ToggleButtonGroup
              value={filters.timePeriod}
              exclusive
              onChange={(_, value) => value && handleFilterChange('timePeriod', value)}
              size="small"
              fullWidth={isMobile}
            >
              {timePeriods.map((period) => (
                <ToggleButton key={period} value={period}>
                  {period}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          {/* Calendar View */}
          <FormControl size="small">
            <InputLabel>Calendar View</InputLabel>
            <Select
              value={filters.calendarView}
              label="Calendar View"
              onChange={(e) => handleFilterChange('calendarView', e.target.value)}
            >
              {calendarViews.map((view) => (
                <MenuItem key={view} value={view}>
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Instrument Selector */}
          <Autocomplete
            options={availableInstruments}
            groupBy={(option) => option.category}
            getOptionLabel={(option) => option.label}
            value={selectedInstrument || null}
            onChange={(_, value) => handleFilterChange('instrument', value?.value || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Instrument"
                size="small"
                placeholder="Select instrument..."
              />
            )}
            size="small"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Data Overlay Options */}
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Data Overlay
          </Typography>
          <ToggleButtonGroup
            value={filters.dataOverlay}
            exclusive
            onChange={(_, value) => value && handleFilterChange('dataOverlay', value)}
            size="small"
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              '& .MuiToggleButton-root': {
                flex: isMobile ? '1 1 calc(50% - 4px)' : 'none',
                minWidth: 'auto',
              },
            }}
          >
            {dataOverlays.map((overlay) => (
              <ToggleButton key={overlay.value} value={overlay.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {overlay.icon}
                  <Typography variant="caption">
                    {overlay.label}
                  </Typography>
                </Box>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Active Filters
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label={`Period: ${filters.timePeriod}`}
                size="small"
                onDelete={() => handleFilterChange('timePeriod', '1Y')}
              />
              <Chip
                label={`View: ${filters.calendarView}`}
                size="small"
                onDelete={() => handleFilterChange('calendarView', 'daily')}
              />
              {filters.instrument && (
                <Chip
                  label={`Instrument: ${selectedInstrument?.label}`}
                  size="small"
                  onDelete={() => handleFilterChange('instrument', '')}
                />
              )}
              <Chip
                label={`Overlay: ${filters.dataOverlay}`}
                size="small"
                onDelete={() => handleFilterChange('dataOverlay', 'heatmap')}
              />
              <Chip
                label="Clear All"
                size="small"
                variant="outlined"
                onClick={onClearFilters}
              />
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};