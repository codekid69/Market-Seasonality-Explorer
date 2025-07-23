
import React from 'react';
import {
  Box,
  Typography,
  Tooltip,
  useTheme,
  Fade,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Warning,
  Remove,
} from '@mui/icons-material';
import { CalendarDayData } from '../../types/market';
import { 
  formatDayNumber, 
  formatWeekday,
  isTodayDate,
  getPerformanceColor,
  getVolatilityIntensity 
} from '../../utils/dateUtils';

interface CalendarCellProps {
  dayData: CalendarDayData;
  onClick: (date: Date) => void;
  isHighlighted?: boolean;
  showWeekday?: boolean;
}

export const CalendarCell: React.FC<CalendarCellProps> = ({
  dayData,
  onClick,
  isHighlighted = false,
  showWeekday = false,
}) => {
  const theme = useTheme();
  const { date, marketData, isCurrentMonth } = dayData;
  
  const isToday = isTodayDate(date);
  const hasData = !!marketData;
  
  // Professional color scheme for financial data visualization
  const performanceColor = hasData 
    ? getPerformanceColor(marketData.performance, theme.palette.mode)
    : theme.palette.mode === 'light' ? '#f8fafc' : '#1e293b';
    
  const volatilityIntensity = hasData 
    ? getVolatilityIntensity(marketData.volatility)
    : 0;

  // Performance indicator with proper formatting
  const performanceDisplay = hasData ? (
    marketData.performance > 0 ? `+${marketData.performance.toFixed(1)}%` : `${marketData.performance.toFixed(1)}%`
  ) : null;

  // Volatility level text
  const volatilityLevel = hasData ? (
    marketData.volatility > 5 ? 'Extreme' :
    marketData.volatility > 3 ? 'High' :
    marketData.volatility > 1.5 ? 'Medium' : 'Low'
  ) : null;


  const tooltipContent = hasData ? (
    <Box sx={{ p: 2, minWidth: 240 }}>
      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1.5 }}>
        {date.toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 1.5 }}>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Daily Performance
          </Typography>
          <Typography variant="body2" fontWeight="bold" 
            sx={{ color: marketData.performance > 0 ? theme.palette.success.main : theme.palette.error.main }}>
            {performanceDisplay}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Volatility
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {marketData.volatility.toFixed(1)}% ({volatilityLevel})
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Volume
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {(marketData.volume / 1000000).toFixed(1)}M
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Close Price
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            ${marketData.close.toLocaleString()}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ 
        pt: 1.5, 
        borderTop: `1px solid ${theme.palette.divider}`,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 1,
      }}>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Open: ${marketData.open.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            High: ${marketData.high.toLocaleString()}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Low: ${marketData.low.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            RSI: {marketData.technicalIndicators.rsi.toFixed(1)}
          </Typography>
        </Box>
      </Box>
    </Box>
  ) : (
    <Box sx={{ p: 1.5 }}>
      <Typography variant="body2" color="text.secondary">
        No market data available for this date
      </Typography>
    </Box>
  );

  return (
    <Tooltip 
      title={tooltipContent} 
      arrow 
      placement="top"
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            fontSize: '0.875rem',
          },
        },
        arrow: {
          sx: {
            color: theme.palette.background.paper,
            '&::before': {
              border: `1px solid ${theme.palette.divider}`,
            },
          },
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          height: { xs: 80, sm: 90, md: 100 }, 
          minHeight: 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          cursor: hasData ? 'pointer' : 'default',
          backgroundColor: performanceColor,
          opacity: isCurrentMonth ? 1 : 0.4,
          borderRadius: 2,
          border: isToday 
            ? `3px solid ${theme.palette.primary.main}` 
            : isHighlighted
            ? `2px solid ${theme.palette.primary.light}`
            : `1px solid ${theme.palette.mode === 'light' ? '#e2e8f0' : '#334155'}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHighlighted ? 'scale(1.02)' : 'scale(1)',
          boxShadow: isHighlighted 
            ? `0 8px 24px ${theme.palette.primary.main}30`
            : isToday
            ? `0 0 0 1px ${theme.palette.primary.main}, 0 4px 12px rgba(0,0,0,0.15)`
            : hasData 
            ? '0 2px 8px rgba(0,0,0,0.08)'
            : '0 1px 3px rgba(0,0,0,0.05)',
          '&:hover': hasData ? {
            transform: 'scale(1.05)',
            zIndex: 10,
            boxShadow: `0 12px 32px ${theme.palette.primary.main}25`,
          } : {},
          // Minimum touch target size for accessibility
          minWidth: { xs: 48, sm: 60 },
        }}
        onClick={() => hasData && onClick(date)}
      >
        {/* Weekday header for mobile/compact view */}
        {showWeekday && (
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '0.6875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              mt: 0.5,
              opacity: isCurrentMonth ? 1 : 0.6,
            }}
          >
            {formatWeekday(date, true)}
          </Typography>
        )}

        {/* Day Number - Primary content */}
        <Typography
          variant="h5"
          sx={{
            color: theme.palette.getContrastText(performanceColor),
            fontWeight: isToday ? 800 : 700,
            fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
            zIndex: 2,
            mt: showWeekday ? 0.5 : 1,
            mb: 0.5,
            opacity: isCurrentMonth ? 1 : 0.6,
          }}
        >
          {formatDayNumber(date)}
        </Typography>

        {/* Performance Display - Center section */}
        {hasData && (
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            zIndex: 2,
            mb: 1,
          }}>
            {/* Performance Percentage */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {Math.abs(marketData.performance) > 0.5 && (
                <>
                  {marketData.performance > 0 ? (
                    <TrendingUp 
                      sx={{ 
                        fontSize: 14, 
                        color: theme.palette.getContrastText(performanceColor),
                        opacity: 0.9,
                      }} 
                    />
                  ) : (
                    <TrendingDown 
                      sx={{ 
                        fontSize: 14, 
                        color: theme.palette.getContrastText(performanceColor),
                        opacity: 0.9,
                      }} 
                    />
                  )}
                </>
              )}
              <Typography
                variant="caption"
                sx={{
                  color: theme.palette.getContrastText(performanceColor),
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  opacity: 0.95,
                }}
              >
                {performanceDisplay}
              </Typography>
            </Box>

            {/* Volatility Indicator */}
            {volatilityIntensity > 0.4 && (
              <Chip
                label={volatilityLevel}
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  backgroundColor: volatilityIntensity > 0.7 
                    ? theme.palette.error.main + '20'
                    : theme.palette.warning.main + '20',
                  color: volatilityIntensity > 0.7 
                    ? theme.palette.error.main
                    : theme.palette.warning.main,
                  border: `1px solid ${
                    volatilityIntensity > 0.7 
                      ? theme.palette.error.main + '40'
                      : theme.palette.warning.main + '40'
                  }`,
                  '& .MuiChip-label': {
                    px: 1,
                  },
                }}
              />
            )}
          </Box>
        )}

        {/* No Data State */}
        {!hasData && isCurrentMonth && (
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            zIndex: 2,
            opacity: 0.6,
          }}>
            <Remove sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '0.6875rem',
                fontWeight: 500,
              }}
            >
              No data
            </Typography>
          </Box>
        )}

        {/* High Volatility Alert */}
        {hasData && marketData.volatility > 5 && (
          <Box
            sx={{
              position: 'absolute',
              top: 6,
              right: 6,
              zIndex: 3,
            }}
          >
            <Warning 
              sx={{ 
                fontSize: 16, 
                color: theme.palette.error.main,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
              }} 
            />
          </Box>
        )}

        {/* Today Highlight Ring Animation */}
        {isToday && (
          <Box
            sx={{
              position: 'absolute',
              inset: -4,
              borderRadius: 3,
              background: `conic-gradient(from 0deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
              zIndex: -1,
              animation: 'pulse 4s infinite',
              '@keyframes pulse': {
                '0%, 100%': { opacity: 0.3 },
                '50%': { opacity: 0.6 },
              },
            }}
          />
        )}

        {/* Volatility Background Gradient */}
        {hasData && volatilityIntensity > 0.2 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: `${Math.min(volatilityIntensity * 40, 20)}%`,
              background: `linear-gradient(to top, ${
                theme.palette.mode === 'light' 
                  ? 'rgba(0,0,0,0.08)' 
                  : 'rgba(255,255,255,0.08)'
              }, transparent)`,
              borderRadius: '0 0 8px 8px',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
        )}
      </Box>
    </Tooltip>
  );
};