/**
 * Professional calendar component with pixel-perfect Google Calendar layout
 * Implements responsive 7x6 grid with smooth navigation and market data visualization
 * Data flows from parent dashboard through props, user interactions bubble up via callbacks
 */

import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Grid,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Divider,
  Paper,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today,
  CalendarMonth,
} from '@mui/icons-material';
import { CalendarCell } from './CalendarCell';
import { CalendarDayData, MarketData } from '../../types/market';
import {
  getCalendarDays,
  formatDisplayDate,
  formatCalendarDate,
  formatWeekday,
  isTodayDate,
  isCurrentMonth,
  getWeekDays,
} from '../../utils/dateUtils';

interface CalendarViewProps {
  marketData: MarketData[];
  onDateClick: (date: Date, data?: MarketData) => void;
  selectedDate?: Date;
  viewMode: 'daily' | 'weekly' | 'monthly';
 
}

/**
 * CalendarView renders the main calendar grid with market data visualization
 * Data flow: Receives marketData array from parent, maps to calendar cells
 * User interaction: Date clicks bubble up to parent for detail modal
 * Layout: Perfect 7-column grid (Sun-Sat) with 5-6 rows depending on month
 * Responsive: Desktop shows full grid, mobile optimizes for touch interaction
 */
export const CalendarView: React.FC<CalendarViewProps> = ({
  marketData,
  onDateClick,
  selectedDate,
  viewMode
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');

  // TODO: Replace with API call when market data changes
  // Example: useEffect(() => { fetchMarketData(currentDate, filters) }, [currentDate, filters])
  const marketDataMap = useMemo(() => {
    const map = new Map<string, MarketData>();
    marketData.forEach((data) => {
      map.set(data.date, data);
    });
    return map;
  }, [marketData]);

  // Generate perfect 7x6 calendar grid matching Google Calendar
  const calendarDays = useMemo(() => {
    let days: Date[] = [];

    if (viewMode === 'daily') {
      days = [currentDate];
    } else if (viewMode === 'weekly') {
      days = getWeekDays(currentDate);
    } else {
      days = getCalendarDays(currentDate);
    }

    return days.map((date): CalendarDayData => {
      const dateKey = formatCalendarDate(date);
      const dayMarketData = marketDataMap.get(dateKey);

      return {
        date,
        marketData: dayMarketData,
        isToday: isTodayDate(date),
        isSelected: selectedDate ? date.getTime() === selectedDate.getTime() : false,
        isCurrentMonth: isCurrentMonth(date, currentDate),
      };
    });
  }, [currentDate, marketDataMap, selectedDate, viewMode]);

  const handlePreviousMonth = () => {
    setSlideDirection('right');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
      setIsTransitioning(false);
    }, 200);
  };

  const handleNextMonth = () => {
    setSlideDirection('left');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
      setIsTransitioning(false);
    }, 200);
  };

  const handleTodayClick = () => {
    const today = new Date();
    if (currentDate.getMonth() !== today.getMonth() || currentDate.getFullYear() !== today.getFullYear()) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentDate(today);
        setIsTransitioning(false);
      }, 200);
    }
  };

  const handleDateClick = (date: Date) => {
    const dateKey = formatCalendarDate(date);
    const dayMarketData = marketDataMap.get(dateKey);
    onDateClick(date, dayMarketData);
  };

  // Generate weekday headers for perfect 7-column alignment
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(2024, 0, 7); // Sunday
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return {
        short: formatWeekday(day, true),
        full: formatWeekday(day, false),
      };
    });
  }, []);

  // Calculate data availability statistics
  const dataAvailableCount = calendarDays.filter(day => day.marketData && day.isCurrentMonth).length;
  const totalCurrentMonthDays = calendarDays.filter(day => day.isCurrentMonth).length;
  const coveragePercentage = totalCurrentMonthDays > 0 ? (dataAvailableCount / totalCurrentMonthDays) * 100 : 0;

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: theme.palette.mode === 'light'
          ? '0 2px 12px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.12)'
          : '0 2px 12px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.4)',
        border: `1px solid ${theme.palette.mode === 'light' ? '#f0f0f0' : '#2a2a2a'}`,
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        {/* Calendar Header with Navigation */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 4,
            pb: 3,
            borderBottom: `2px solid ${theme.palette.divider}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CalendarMonth
              sx={{
                color: theme.palette.primary.main,
                fontSize: { xs: 28, sm: 32 },
              }}
            />
            <Box>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: theme.palette.text.primary,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
                  lineHeight: 1.2,
                }}
              >
                {formatDisplayDate(currentDate)}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontWeight: 500,
                  mt: 0.5,
                }}
              >
                {dataAvailableCount} of {totalCurrentMonthDays} days with data ({coveragePercentage.toFixed(0)}% coverage)
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton
              onClick={handlePreviousMonth}
              size="large"
              sx={{
                width: { xs: 44, sm: 48 },
                height: { xs: 44, sm: 48 },
                backgroundColor: theme.palette.grey[100],
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  backgroundColor: theme.palette.grey[200],
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <ChevronLeft sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>

            <IconButton
              onClick={handleTodayClick}
              size="large"
              color="primary"
              sx={{
                width: { xs: 44, sm: 48 },
                height: { xs: 44, sm: 48 },
                backgroundColor: theme.palette.primary.main + '15',
                border: `2px solid ${theme.palette.primary.main}40`,
                '&:hover': {
                  backgroundColor: theme.palette.primary.main + '25',
                  transform: 'scale(1.05)',
                  boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                },
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <Today sx={{ fontSize: { xs: 18, sm: 20 } }} />
            </IconButton>

            <IconButton
              onClick={handleNextMonth}
              size="large"
              sx={{
                width: { xs: 44, sm: 48 },
                height: { xs: 44, sm: 48 },
                backgroundColor: theme.palette.grey[100],
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  backgroundColor: theme.palette.grey[200],
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <ChevronRight sx={{ fontSize: { xs: 20, sm: 24 } }} />
            </IconButton>
          </Box>
        </Box>

        {/* Weekday Headers - Perfect 7-column alignment */}
        {/* Weekday Headers - Always 7 columns aligned */}
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={{ xs: 1, sm: 1.5 }}>
            {weekDays.map((day, index) => (
              <Grid item xs={12 / 7} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: { xs: 1.5, sm: 2 },
                    minHeight: { xs: 44, sm: 48 },
                    backgroundColor: theme.palette.grey[50],
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {isMobile ? day.short.charAt(0) : day.short}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>


        {/* Calendar Grid - Perfect 7x6 layout with smooth transitions */}
        <Slide
          direction={slideDirection}
          in={!isTransitioning}
          timeout={400}
          mountOnEnter
          unmountOnExit
        >
          <Box>
            {viewMode === 'weekly' ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(100, 1fr)',
                  gap: theme.spacing(1.5),
                }}
              >
                {calendarDays.map((dayData, index) => (
                  <Box key={index}>
                    <CalendarCell
                      dayData={dayData}
                      onClick={handleDateClick}
                      isHighlighted={dayData.isSelected}
                      showWeekday={false}
                      
                    />
                  </Box>
                ))}
              </Box>

            ) : (
              <Grid container spacing={{ xs: 1, sm: 1.5 }}>
                {calendarDays.map((dayData, index) => (
                  <Grid item xs={12 / 7} key={`${dayData.date.getTime()}-${index}`}>
                    <CalendarCell
                      dayData={dayData}
                      onClick={handleDateClick}
                      isHighlighted={dayData.isSelected}
                      showWeekday={false}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Slide>


        {/* Calendar Footer with Enhanced Statistics */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: `2px solid ${theme.palette.divider}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 3,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
              Data Coverage: {dataAvailableCount} of {totalCurrentMonthDays} days
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {coveragePercentage.toFixed(1)}% complete • Last updated: {new Date().toLocaleTimeString()}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.success.main,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Positive
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.error.main,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Negative
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.grey[400],
                }}
              />
              <Typography variant="caption" color="text.secondary">
                No Data
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};