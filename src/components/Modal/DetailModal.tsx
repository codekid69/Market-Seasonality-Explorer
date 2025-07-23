// detailed view of intraday price
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  Close,
  GetApp,
  Share,
  TrendingUp,
  TrendingDown,
  BarChart,
  Timeline,
  PictureAsPdf,
  TableChart,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
} from 'recharts';
import { MarketData } from '../../types/market';

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  date: Date | null;
  marketData: MarketData | null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

import { exportToCSV } from '../../utils/exportToCSV';
import { exportToPDF } from '../../utils/exportToPDF';
const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`detail-tabpanel-${index}`}
      aria-labelledby={`detail-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
};

export const DetailModal: React.FC<DetailModalProps> = ({
  open,
  onClose,
  date,
  marketData,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentTab, setCurrentTab] = useState(0);

  if (!date || !marketData) return null;

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleExport = async (format: 'pdf' | 'csv' | 'image') => {
    if (format === 'csv') {
      exportToCSV(`intraday_${marketData.date}`, intradayData);
    } if (format === 'pdf') {
      await exportToPDF(
        ['export-overview', 'export-chart', 'export-technical'],
        `market_analysis_${date.toISOString().split('T')[0]}`
      );
    } else if (format === 'image') {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };



  const intradayData = [
    { time: '09:30', price: marketData.open, volume: marketData.volume * 0.08 },
    { time: '10:00', price: marketData.open * 1.005, volume: marketData.volume * 0.12 },
    { time: '11:00', price: marketData.high * 0.98, volume: marketData.volume * 0.15 },
    { time: '12:00', price: marketData.high, volume: marketData.volume * 0.25 },
    { time: '13:00', price: marketData.high * 0.96, volume: marketData.volume * 0.18 },
    { time: '14:00', price: marketData.low * 1.02, volume: marketData.volume * 0.22 },
    { time: '15:00', price: marketData.low, volume: marketData.volume * 0.35 },
    { time: '16:00', price: marketData.close, volume: marketData.volume * 0.28 },
  ];

  const performanceColor = marketData.performance > 0
    ? theme.palette.success.main
    : theme.palette.error.main;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          minHeight: isMobile ? '100%' : '85vh',
          maxHeight: '95vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Market Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {date.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            width: 40,
            height: 40,
            backgroundColor: theme.palette.grey[100],
            '&:hover': {
              backgroundColor: theme.palette.grey[200],
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant={isMobile ? 'fullWidth' : 'standard'}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
            },
          }}
        >
          <Tab label="Overview" />
          <Tab label="Price Chart" />
          <Tab label="Technical Analysis" />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 0, overflow: 'auto' }}>
        {/* Overview Tab */}
        <TabPanel value={currentTab} index={0}>
          <Box id="export-overview" sx={{ p: 3 }}>
            {/* Key Performance Metrics */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={8}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Price Action Summary
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary">Open</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          ${marketData.open.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary">High</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          ${marketData.high.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary">Low</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          ${marketData.low.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="caption" color="text.secondary">Close</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          ${marketData.close.toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Daily Performance
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      {marketData.performance > 0 ?
                        <TrendingUp sx={{ color: performanceColor }} /> :
                        <TrendingDown sx={{ color: performanceColor }} />
                      }
                      <Typography
                        variant="h4"
                        sx={{
                          color: performanceColor,
                          fontWeight: 700,
                        }}
                      >
                        {marketData.performance.toFixed(2)}%
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      ${Math.abs(marketData.close - marketData.open).toLocaleString()} change
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Volume and Volatility */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Volume Analysis
                    </Typography>
                    <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
                      {(marketData.volume / 1000000).toFixed(1)}M
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Trading volume
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {/* TODO: Calculate from historical data */}
                        Volume rank: 78th percentile
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Volatility Metrics
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {marketData.volatility.toFixed(2)}%
                      </Typography>
                      <Chip
                        label={
                          marketData.volatility > 5 ? 'Extreme' :
                            marketData.volatility > 3 ? 'High' :
                              marketData.volatility > 1.5 ? 'Medium' : 'Low'
                        }
                        size="small"
                        color={
                          marketData.volatility > 5 ? 'error' :
                            marketData.volatility > 3 ? 'warning' :
                              marketData.volatility > 1.5 ? 'info' : 'success'
                        }
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Daily volatility
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Market Context */}
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Market Context
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">Price Range</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      ${(marketData.high - marketData.low).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">Market Trend</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {marketData.performance > 2 ? 'Strong Bullish' :
                        marketData.performance > 0.5 ? 'Bullish' :
                          marketData.performance < -2 ? 'Strong Bearish' :
                            marketData.performance < -0.5 ? 'Bearish' : 'Neutral'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">Session Type</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {/* TODO: Determine from actual market hours */}
                      Regular Trading
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">Data Quality</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Complete
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>

        {/* Price Chart Tab */}
        <TabPanel value={currentTab} index={1}>
          <Box id="export-chart" sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Intraday Price Movement
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={intradayData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 12 }}
                      stroke={theme.palette.text.secondary}
                    />
                    <YAxis
                      domain={['dataMin - 50', 'dataMax + 50']}
                      tick={{ fontSize: 12 }}
                      stroke={theme.palette.text.secondary}
                    />
                    <Tooltip
                      formatter={(value: any, name: string) => [
                        name === 'price' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                        name === 'price' ? 'Price' : 'Volume'
                      ]}
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={theme.palette.primary.main}
                      strokeWidth={3}
                      dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: theme.palette.primary.main, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>

            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Volume Distribution
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Box sx={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={intradayData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 12 }}
                      stroke={theme.palette.text.secondary}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      stroke={theme.palette.text.secondary}
                    />
                    <Tooltip
                      formatter={(value: any) => [value.toLocaleString(), 'Volume']}
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                      }}
                    />
                    <Bar
                      dataKey="volume"
                      fill={theme.palette.secondary.main}
                      radius={[2, 2, 0, 0]}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Box>
        </TabPanel>

        {/* Technical Analysis Tab */}
        <TabPanel value={currentTab} index={2}>
          <Box id="export-technical" sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Technical Indicators
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                      Momentum Indicators
                    </Typography>
                    <List dense>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary="RSI (14)"
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2">
                                {marketData.technicalIndicators.rsi.toFixed(1)}
                              </Typography>
                              <Chip
                                label={
                                  marketData.technicalIndicators.rsi > 70 ? 'Overbought' :
                                    marketData.technicalIndicators.rsi < 30 ? 'Oversold' : 'Neutral'
                                }
                                size="small"
                                color={
                                  marketData.technicalIndicators.rsi > 70 ? 'error' :
                                    marketData.technicalIndicators.rsi < 30 ? 'success' : 'default'
                                }
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary="MACD"
                          secondary={marketData.technicalIndicators.macd.toFixed(2)}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                      Moving Averages
                    </Typography>
                    <List dense>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary="SMA (20)"
                          secondary={`$${marketData.technicalIndicators.sma20.toLocaleString()}`}
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText
                          primary="SMA (50)"
                          secondary={`$${marketData.technicalIndicators.sma50.toLocaleString()}`}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                      Bollinger Bands
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="text.secondary">Upper Band</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          ${marketData.technicalIndicators.bollinger.upper.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="text.secondary">Middle Band (SMA 20)</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          ${marketData.technicalIndicators.bollinger.middle.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="caption" color="text.secondary">Lower Band</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          ${marketData.technicalIndicators.bollinger.lower.toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 2, p: 2, backgroundColor: theme.palette.grey[50], borderRadius: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Band Position: {
                          marketData.close > marketData.technicalIndicators.bollinger.upper ? 'Above upper band' :
                            marketData.close < marketData.technicalIndicators.bollinger.lower ? 'Below lower band' :
                              'Within bands'
                        }
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', flex: 1 }}>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdf />}
            onClick={() => handleExport('pdf')}
            size="small"
          >
            Export PDF
          </Button>
          <Button
            variant="outlined"
            startIcon={<TableChart />}
            onClick={() => handleExport('csv')}
            size="small"
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={<Share />}
            onClick={() => handleExport('image')}
            size="small"
          >
            Share
          </Button>
        </Box>
        <Button onClick={onClose} variant="contained" size="large">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};