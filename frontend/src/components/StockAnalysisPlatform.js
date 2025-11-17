import React, { useState } from 'react';
import { 
  Box, Container, Typography, TextField, Button, Card, CardContent, 
  Grid, Paper, CircularProgress, Alert, Chip, Divider, LinearProgress
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
    },
    secondary: {
      main: '#8b5cf6',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    success: {
      main: '#10b981',
    },
    error: {
      main: '#ef4444',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
          backdropFilter: 'blur(10px)',
        },
      },
    },
  },
});

export default function StockAnalysisPlatform() {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const analyzeStock = async () => {
    if (!ticker.trim()) {
      setError('Please enter a stock ticker symbol');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: ticker.toUpperCase() })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze stock');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      analyzeStock();
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)',
        py: 4
      }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
              <PsychologyIcon sx={{ fontSize: 60, color: 'primary.main' }} />
              <Typography variant="h2" component="h1" sx={{ fontWeight: 700, color: 'white' }}>
                AI Stock Analyzer
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ color: 'rgba(147, 197, 253, 0.9)' }}>
              Multi-Agent AI System for Deep Stock Analysis
            </Typography>
          </Box>

          {/* Search Bar */}
          <Card sx={{ maxWidth: 800, mx: 'auto', mb: 6 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter stock ticker (e.g., AAPL, TSLA, MSFT)"
                  variant="outlined"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1.1rem',
                    }
                  }}
                />
                <Button
                  variant="contained"
                  size="large"
                  onClick={analyzeStock}
                  disabled={loading}
                  endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ArrowForwardIcon />}
                  sx={{ 
                    minWidth: 150,
                    background: 'linear-gradient(45deg, #3b82f6 30%, #8b5cf6 90%)',
                    boxShadow: '0 3px 5px 2px rgba(59, 130, 246, .3)',
                  }}
                >
                  {loading ? 'Analyzing' : 'Analyze'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Alert severity="error" icon={<ErrorOutlineIcon />} sx={{ maxWidth: 900, mx: 'auto', mb: 4 }}>
              {error}
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <Card sx={{ maxWidth: 900, mx: 'auto' }}>
              <CardContent sx={{ p: 6, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ position: 'relative' }}>
                    <CircularProgress size={80} />
                    <PsychologyIcon sx={{ 
                      fontSize: 40, 
                      position: 'absolute', 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)',
                      color: 'primary.main'
                    }} />
                  </Box>
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                      AI Agents at Work
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Fetching data, analyzing trends, and generating predictions...
                    </Typography>
                  </Box>
                  <LinearProgress sx={{ width: '100%', mt: 2 }} />
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Analysis Results */}
          {analysis && !loading && (
            <Box>
              {/* Company Header */}
              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                        {analysis.company_name}
                      </Typography>
                      <Typography variant="h5" color="primary">
                        {analysis.ticker}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        ${analysis.current_price}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end', mt: 1 }}>
                        {analysis.price_change >= 0 ? (
                          <TrendingUpIcon sx={{ color: 'success.main', fontSize: 30 }} />
                        ) : (
                          <TrendingDownIcon sx={{ color: 'error.main', fontSize: 30 }} />
                        )}
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 600,
                            color: analysis.price_change >= 0 ? 'success.main' : 'error.main'
                          }}
                        >
                          {analysis.price_change >= 0 ? '+' : ''}{analysis.price_change}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Key Metrics Grid */}
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <AttachMoneyIcon sx={{ color: 'success.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            Market Cap
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {analysis.market_cap}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <ShowChartIcon sx={{ color: 'secondary.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            P/E Ratio
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {analysis.pe_ratio}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <AttachMoneyIcon sx={{ color: 'primary.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            Dividend Yield
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {analysis.dividend_yield}%
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <CalendarMonthIcon sx={{ color: 'warning.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            52W Range
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                          {analysis.week_52_range}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Charts Row */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Price History (6 Months)
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={analysis.price_history}>
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1e293b', 
                              border: '1px solid #475569',
                              borderRadius: '8px'
                            }} 
                          />
                          <Area type="monotone" dataKey="price" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPrice)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        Trading Volume
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analysis.volume_data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="date" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1e293b', 
                              border: '1px solid #475569',
                              borderRadius: '8px'
                            }} 
                          />
                          <Bar dataKey="volume" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* AI Analysis Sections */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <ShowChartIcon sx={{ color: 'primary.main' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Technical Analysis
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                        {analysis.technical_analysis.split('\n').map((line, i) => (
                          <span key={i}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <AttachMoneyIcon sx={{ color: 'success.main' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Fundamental Analysis
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                        {analysis.fundamental_analysis.split('\n').map((line, i) => (
                          <span key={i}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Prediction */}
              <Card sx={{ 
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <PsychologyIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      AI Prediction & Recommendation
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)' }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Predicted Price (6 Months)
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                          ${analysis.predicted_price}
                        </Typography>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: analysis.predicted_change >= 0 ? 'success.main' : 'error.main',
                            fontWeight: 600
                          }}
                        >
                          {analysis.predicted_change >= 0 ? '+' : ''}{analysis.predicted_change}% expected return
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)' }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Recommendation
                        </Typography>
                        <Chip 
                          label={analysis.recommendation}
                          size="large"
                          sx={{ 
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            height: 50,
                            mt: 1,
                            bgcolor: analysis.recommendation === 'BUY' ? 'success.main' :
                                     analysis.recommendation === 'SELL' ? 'error.main' : 'warning.main',
                            color: 'white'
                          }}
                        />
                      </Paper>
                    </Grid>
                  </Grid>

                  <Paper elevation={0} sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)' }}>
                    <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.primary' }}>
                      {analysis.ai_summary}
                    </Typography>
                  </Paper>
                </CardContent>
              </Card>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}