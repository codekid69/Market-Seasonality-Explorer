import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Fade,
  Typography,
} from '@mui/material';
import { TopAppBar } from '../AppBar/TopAppBar';
import { FilterControls } from '../Filters/FilterControls';
import { CalendarView } from '../Calendar/CalendarView';
import { PerformanceLegend } from '../Legend/PerformanceLegend';
import { DetailModal } from '../Modal/DetailModal';
import { FilterState, MarketData, ThemeMode } from '../../types/market';
import { fetchMarketDataFromAPI } from '../../utils/marketData';

import { availableInstruments } from '../../data/mockData';

const getInstrumentMeta = (symbol: string) => 
  availableInstruments.find(i => i.value === symbol);


interface MarketDashboardProps {
  themeMode: ThemeMode;
  onThemeToggle: () => void;
}

export const MarketDashboard: React.FC<MarketDashboardProps> = ({
  themeMode,
  onThemeToggle,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const [filters, setFilters] = useState<FilterState>({
    timePeriod: '1Y',
    dataOverlay: 'heatmap',
    calendarView: 'monthly',
    instrument: 'BTC',
  });

  const [rawMarketData, setRawMarketData] = useState<MarketData[]>([]);
  const [filteredMarketData, setFilteredMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMarketData, setSelectedMarketData] = useState<MarketData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');

  const fetchData = async () => {
  setIsLoading(true);
  try {
    const instrumentMeta = getInstrumentMeta(filters.instrument);

    if (!instrumentMeta) throw new Error('Invalid instrument');

    let data: MarketData[];

    if (instrumentMeta.apiSource === 'coingecko') {
      data = await fetchMarketDataFromAPI(instrumentMeta.apiId, filters.timePeriod);
    } else {
      // Replace or simulate with mock data
      data = []; // TODO: implement mock fetch
    }

    setRawMarketData(data);
    setSnackbarMessage(`Loaded ${filters.instrument} market data`);
    setSnackbarSeverity('success');
  } catch (error) {
    console.error('Market data fetch failed:', error);
    setSnackbarMessage('Failed to load market data');
    setSnackbarSeverity('error');
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => {
    fetchData();
  }, [filters.instrument, filters.timePeriod]);


  useEffect(() => {
    let filtered = [...rawMarketData];

    // Optional filtering based on overlay type
    if (filters.dataOverlay === 'performance') {
      filtered = filtered.filter(data => typeof data.performance === 'number');
    }

    setFilteredMarketData(filtered);
  }, [rawMarketData, filters.dataOverlay, filters.calendarView]);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setSnackbarMessage(`Loading ${newFilters.instrument} data for ${newFilters.timePeriod}...`);
    setSnackbarSeverity('info');
  };

  const handleClearFilters = () => {
    const defaultFilters: FilterState = {
      timePeriod: '1Y',
      dataOverlay: 'heatmap',
      calendarView: 'monthly',
      instrument: 'BTC',
    };
    setFilters(defaultFilters);
    setSnackbarMessage('Filters reset to default');
    setSnackbarSeverity('success');
  };

  const handleDateClick = (date: Date, marketData?: MarketData) => {
    setSelectedDate(date);
    setSelectedMarketData(marketData || null);
    if (marketData) {
      setIsDetailModalOpen(true);
    } else {
      setSnackbarMessage('No market data available for this date');
      setSnackbarSeverity('warning');
    }
  };

  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setTimeout(() => {
      setSelectedDate(null);
      setSelectedMarketData(null);
    }, 300);
  };

  const handleRefresh = async () => {
    setSnackbarMessage('Refreshing market data...');
    setSnackbarSeverity('info');
    await fetchData();
  };
  const handleSettingsClick = () => {
    setSnackbarMessage('Settings panel coming soon');
    setSnackbarSeverity('info');
  };

  const handleSnackbarClose = () => {
    setSnackbarMessage(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      <TopAppBar
        themeMode={themeMode}
        onThemeToggle={onThemeToggle}
        onRefresh={handleRefresh}
        onSettingsClick={handleSettingsClick}
      />

      <Box sx={{ pt: '64px' }}>
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Fade in timeout={500}>
            <Box>
              <FilterControls
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />

              <Grid container spacing={3}>
                <Grid item xs={12} lg={isMobile ? 12 : 8}>
                  {isLoading ? (
                    <Box sx={{ textAlign: 'center', mt: 5 }}>
                      <Typography variant="h6">Loading market data...</Typography>
                    </Box>
                  ) : (
                    <CalendarView
                      marketData={filteredMarketData}
                      onDateClick={handleDateClick}
                      selectedDate={selectedDate}
                      viewMode={filters.calendarView}
                      
                    />
                  )}
                </Grid>

                {!isMobile && (
                  <Grid item lg={4}>
                    <PerformanceLegend />
                  </Grid>
                )}
              </Grid>

              {isMobile && (
                <Box sx={{ mt: 3 }}>
                  <PerformanceLegend />
                </Box>
              )}
            </Box>
          </Fade>
        </Container>
      </Box>

      <DetailModal
        open={isDetailModalOpen}
        onClose={handleDetailModalClose}
        date={selectedDate}
        marketData={selectedMarketData}
      />

      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%', borderRadius: 2, fontWeight: 500 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
