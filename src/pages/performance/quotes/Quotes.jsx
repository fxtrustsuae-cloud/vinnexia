import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Chip,
  alpha,
  useMediaQuery,
  IconButton,
  Tooltip,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import InfoIcon from '@mui/icons-material/Info';

// Color palette
const COLORS = {
accentGold: "#7E6233",
whiteMain: "#FEFEFE",
blackDark: "#11191E",
greyLight: "#CACDCC",
greyMedium: "#B3B6B6",
greyDark: "#848F94",
darkBg: "#1a1f24",
};

// Styled Table Cell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: alpha("#2a2f34", 0.9),
  color: COLORS.whiteMain,
  borderBottom: `1px solid ${alpha(COLORS.greyDark, 0.2)}`,
  padding: '12px 16px',
  fontSize: '0.875rem',
}));

// Styled Table Header Cell
const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: alpha("#3a3f44", 0.9),
  color: COLORS.accentGold,
  fontWeight: 700,
  fontSize: '0.9rem',
  padding: '14px 16px',
  borderBottom: `2px solid ${alpha(COLORS.accentGold, 0.3)}`,
}));

// Styled Table Row
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
      backgroundColor: alpha("#2a2f34", 0.7),
  },
  '&:nth-of-type(odd)': {
      backgroundColor: alpha("#2a2f34", 0.9),
  },
  '&:hover': {
      backgroundColor: alpha(COLORS.accentGold, 0.1),
  },
}));

// Format number with commas and decimals
const formatNumber = (num) => {
  if (num === null || num === undefined) return '—';
  return parseFloat(num).toFixed(5);
};

// Get price change color and icon
const getPriceChangeProps = (change) => {
  if (change > 0) {
      return {
          color: "#4caf50",
          icon: <TrendingUpIcon fontSize="small" />,
          text: `+${change.toFixed(2)}%`
      };
  } else if (change < 0) {
      return {
          color: "#f44336",
          icon: <TrendingDownIcon fontSize="small" />,
          text: `${change.toFixed(2)}%`
      };
  } else {
      return {
          color: COLORS.greyMedium,
          icon: <TrendingFlatIcon fontSize="small" />,
          text: "0.00%"
      };
  }
};

function QuotesTable({ data }) {
  const isMobile = useMediaQuery('(max-width:600px)');
  
  // Dark mode color variables
  const borderColor = alpha(COLORS.greyDark, 0.2);
  const textPrimary = COLORS.whiteMain;
  const textSecondary = COLORS.greyMedium;

  // Use provided data or create mock data
  const tableData = data || {
      AUDJPY: { bid: 97.123, ask: 97.145, change: 0.12 },
      AUDNZD: { bid: 1.0812, ask: 1.0824, change: -0.05 },
      AUDUSD: { bid: 0.6589, ask: 0.6592, change: 0.18 },
      AUS200: { bid: 7694.3, ask: 7695.1, change: 0.42 },
      CADCHF: { bid: 0.6543, ask: 0.6551, change: 0.07 },
      CADJPY: { bid: 110.234, ask: 110.256, change: -0.12 },
      CHFJPY: { bid: 170.123, ask: 170.145, change: 0.25 },
      EURAUD: { bid: 1.6312, ask: 1.6324, change: -0.08 },
      EURCAD: { bid: 1.4567, ask: 1.4579, change: 0.15 },
      EURCHF: { bid: 0.9654, ask: 0.9662, change: 0.03 },
      EURGBP: { bid: 0.8567, ask: 0.8579, change: 0.22 },
      EURJPY: { bid: 160.234, ask: 160.256, change: 0.31 },
      EURNZD: { bid: 1.7654, ask: 1.7666, change: -0.14 },
      EURUSD: { bid: 1.0823, ask: 1.0825, change: 0.27 },
      GBPAUD: { bid: 1.9054, ask: 1.9066, change: 0.19 },
      GBPCAD: { bid: 1.7012, ask: 1.7024, change: -0.06 },
      GBPCHF: { bid: 1.1234, ask: 1.1246, change: 0.11 },
      GBPJPY: { bid: 187.123, ask: 187.145, change: 0.38 },
      GBPNZD: { bid: 2.0612, ask: 2.0624, change: 0.09 },
      GBPUSD: { bid: 1.2634, ask: 1.2646, change: 0.23 },
      NZDCAD: { bid: 0.8234, ask: 0.8246, change: -0.03 },
      NZDCHF: { bid: 0.5432, ask: 0.5444, change: 0.17 },
      NZDJPY: { bid: 90.123, ask: 90.145, change: 0.14 },
      NZDUSD: { bid: 0.6098, ask: 0.6102, change: 0.21 },
      US30: { bid: 38765.4, ask: 38766.2, change: 0.56 },
      USDCAD: { bid: 1.3456, ask: 1.3468, change: -0.09 },
      USDCHF: { bid: 0.8923, ask: 0.8935, change: 0.13 },
      USDJPY: { bid: 148.123, ask: 148.145, change: 0.34 },
      USDNOK: { bid: 10.4567, ask: 10.4579, change: -0.17 },
      XAGUSD: { bid: 24.123, ask: 24.145, change: 0.45 },
      XAUUSD: { bid: 2156.78, ask: 2157.12, change: 0.67 }
  };

  // Get all symbols
  const symbols = Object.keys(tableData);

  return (
      <Box sx={{ width: '100%', overflow: 'hidden' }}>
          {/* Table Header Info */}
          <Box sx={{ 
              p: 2, 
              borderBottom: `1px solid ${borderColor}`,
              backgroundColor: alpha("#3a3f44", 0.9),
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
          }}>
              <Box>
                  <Typography variant="subtitle1" fontWeight={600} color={textPrimary}>
                      Live Market Quotes
                  </Typography>
                  <Typography variant="caption" color={textSecondary}>
                      Bid/Ask prices with real-time percentage changes
                  </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: "#4caf50" }} />
                      <Typography variant="caption" color={textSecondary}>Rising</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: "#f44336" }} />
                      <Typography variant="caption" color={textSecondary}>Falling</Typography>
                  </Box>
                  <Tooltip title="Table information">
                      <IconButton size="small" sx={{ color: COLORS.accentGold }}>
                          <InfoIcon fontSize="small" />
                      </IconButton>
                  </Tooltip>
              </Box>
          </Box>

          <TableContainer sx={{ 
              maxHeight: '600px',
              backgroundColor: alpha("#2a2f34", 0.9),
              '&::-webkit-scrollbar': {
                  width: '8px',
                  height: '8px',
              },
              '&::-webkit-scrollbar-track': {
                  background: alpha(COLORS.greyDark, 0.1),
              },
              '&::-webkit-scrollbar-thumb': {
                  background: alpha(COLORS.greyDark, 0.3),
                  borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                  background: alpha(COLORS.greyDark, 0.5),
              }
          }}>
              <Table stickyHeader>
                  <TableHead>
                      <TableRow>
                          <StyledTableHeaderCell>
                              Symbol
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell align="right">
                              Bid Price
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell align="right">
                              Ask Price
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell align="right">
                              Spread
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell align="right">
                              24h Change
                          </StyledTableHeaderCell>
                          <StyledTableHeaderCell align="center">
                              Status
                          </StyledTableHeaderCell>
                      </TableRow>
                  </TableHead>
                  
                  <TableBody>
                      {symbols.map((symbol) => {
                          const symbolData = tableData[symbol];
                          if (!symbolData) return null;
                          
                          const spread = symbolData.ask - symbolData.bid;
                          const changeProps = getPriceChangeProps(symbolData.change || 0);
                          
                          return (
                              <StyledTableRow key={symbol}>
                                  <StyledTableCell>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <Typography 
                                              variant="body2" 
                                              fontWeight={600}
                                              sx={{ 
                                                  color: textPrimary,
                                                  fontFamily: 'monospace'
                                              }}
                                          >
                                              {symbol}
                                          </Typography>
                                          {(symbol === 'EURUSD' || symbol === 'GBPUSD' || symbol === 'USDJPY' || symbol === 'AUDUSD') && (
                                              <Chip
                                                  label="Major"
                                                  size="small"
                                                  sx={{
                                                      backgroundColor: alpha("#4caf50", 0.15),
                                                      color: "#4caf50",
                                                      fontSize: '0.65rem',
                                                      height: 20,
                                                      fontWeight: 500
                                                  }}
                                              />
                                          )}
                                      </Box>
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                      <Typography 
                                          variant="body2" 
                                          fontWeight={600}
                                          sx={{ color: textPrimary }}
                                      >
                                          {formatNumber(symbolData.bid)}
                                      </Typography>
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                      <Typography 
                                          variant="body2" 
                                          fontWeight={600}
                                          sx={{ color: textPrimary }}
                                      >
                                          {formatNumber(symbolData.ask)}
                                      </Typography>
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                      <Typography 
                                          variant="body2"
                                          sx={{ 
                                              color: spread > 0.0005 ? "#ff9800" : textSecondary,
                                              fontWeight: spread > 0.0005 ? 600 : 400
                                          }}
                                      >
                                          {spread.toFixed(5)}
                                      </Typography>
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                                          {changeProps.icon}
                                          <Typography 
                                              variant="body2" 
                                              fontWeight={600}
                                              sx={{ color: changeProps.color }}
                                          >
                                              {changeProps.text}
                                          </Typography>
                                      </Box>
                                  </StyledTableCell>
                                  <StyledTableCell align="center">
                                      <Chip
                                          label={changeProps.color === "#4caf50" ? "Bullish" : changeProps.color === "#f44336" ? "Bearish" : "Neutral"}
                                          size="small"
                                          sx={{
                                              backgroundColor: changeProps.color === "#4caf50" ? alpha("#4caf50", 0.15) : 
                                                            changeProps.color === "#f44336" ? alpha("#f44336", 0.15) : 
                                                            alpha(COLORS.greyDark, 0.15),
                                              color: changeProps.color === "#4caf50" ? "#4caf50" : 
                                                     changeProps.color === "#f44336" ? "#f44336" : 
                                                     COLORS.greyMedium,
                                              fontSize: '0.7rem',
                                              height: 22,
                                              fontWeight: 500,
                                              minWidth: '70px'
                                          }}
                                      />
                                  </StyledTableCell>
                              </StyledTableRow>
                          );
                      })}
                  </TableBody>
              </Table>
          </TableContainer>

          {/* Table Footer */}
          <Box sx={{ 
              p: 2, 
              borderTop: `1px solid ${borderColor}`,
              backgroundColor: alpha("#3a3f44", 0.9),
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
          }}>
              <Typography variant="caption" color={textSecondary}>
                  Showing {symbols.length} instruments
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                  <Typography variant="caption" color={textSecondary}>
                      Data updates in real-time
                  </Typography>
                  <Typography variant="caption" color={textSecondary}>
                      UTC: {new Date().toISOString().split('T')[1].split('.')[0]}
                  </Typography>
              </Box>
          </Box>
      </Box>
  );
}

export default QuotesTable;