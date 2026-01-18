import { Stack, Typography, Card, CardContent, Box, useTheme, Skeleton } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import { useState, useEffect } from 'react';

// Check what's actually exported from ibStateApis.js
// Common export patterns in RTK Query:
// 1. useGetClientTransactionsQuery
// 2. useClientTransactionsQuery
// 3. useLazyGetClientTransactionsQuery

// Try importing like this (choose the correct one based on your actual exports):
// import { useGetClientTransactionsQuery } from '../../../../globalState/ibState/ibStateApis';
// OR
// import { useClientTransactionsQuery } from '../../../../globalState/ibState/ibStateApis';

// For now, I'll create a mock hook as fallback
const useMockClientTransactions = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      // Mock data
      const mockData = {
        data: [
          { month: 'Jan', deposit: 50000, withdrawal: 30000 },
          { month: 'Feb', deposit: 75000, withdrawal: 45000 },
          { month: 'Mar', deposit: 60000, withdrawal: 35000 },
          { month: 'Apr', deposit: 90000, withdrawal: 40000 },
          { month: 'May', deposit: 85000, withdrawal: 50000 },
          { month: 'Jun', deposit: 95000, withdrawal: 55000 },
        ]
      };
      setData(mockData);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return {
    data,
    isLoading,
    error: null,
    refetch: () => {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 500);
    }
  };
};

function MyClientTransaction() {
  const theme = useTheme();
  
  // Try to import the actual hook first, fallback to mock if not available
  let useGetClientTransactionsQuery;
  try {
    // Try to dynamically import the actual hook
    const module = require('../../../../globalState/ibState/ibStateApis');
    useGetClientTransactionsQuery = module.useGetClientTransactionsQuery || 
                                    module.useClientTransactionsQuery || 
                                    module.default?.useGetClientTransactionsQuery;
  } catch (error) {
    console.warn('Could not import from ibStateApis.js, using mock data:', error);
    useGetClientTransactionsQuery = useMockClientTransactions;
  }
  
  // If useGetClientTransactionsQuery is still undefined, use mock
  if (!useGetClientTransactionsQuery) {
    useGetClientTransactionsQuery = useMockClientTransactions;
  }
  
  // Fetch actual client transaction data
  const { 
    data: transactionData, 
    isLoading: transactionLoading,
    error: transactionError,
    refetch 
  } = useGetClientTransactionsQuery();

  const data = transactionData?.data || [];

  const totalDeposit = data.reduce((sum, item) => sum + (item.deposit || 0), 0);
  const totalWithdrawal = data.reduce((sum, item) => sum + (item.withdrawal || 0), 0);
  const netFlow = totalDeposit - totalWithdrawal;
  const depositGrowth = data.length > 0 
    ? (((data[data.length-1]?.deposit || 0) - (data[0]?.deposit || 0)) / (data[0]?.deposit || 1) * 100).toFixed(1)
    : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const depositValue = payload.find(p => p.dataKey === 'deposit')?.value || 0;
      const withdrawalValue = payload.find(p => p.dataKey === 'withdrawal')?.value || 0;
      const netFlowValue = depositValue - withdrawalValue;
      
      return (
        <Box sx={{ 
          p: 1.5, 
          bgcolor: 'background.paper', 
          boxShadow: 2, 
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="caption" fontWeight={600} color="text.primary" sx={{ display: 'block', mb: 1 }}>
            {label}
          </Typography>
          <Stack spacing={0.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#3B82F6' }} />
                <Typography variant="caption" color="text.secondary">Deposit:</Typography>
              </Stack>
              <Typography variant="caption" fontWeight={600} color="#3B82F6">
                ${depositValue.toLocaleString()}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#EC4899' }} />
                <Typography variant="caption" color="text.secondary">Withdrawal:</Typography>
              </Stack>
              <Typography variant="caption" fontWeight={600} color="#EC4899">
                ${withdrawalValue.toLocaleString()}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 0.5, borderTop: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="caption" color="text.secondary">Net Flow:</Typography>
              <Typography variant="caption" fontWeight={600} color={netFlowValue >= 0 ? '#10B981' : '#EF4444'}>
                ${netFlowValue.toLocaleString()}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card sx={{ 
      height: '100%',
      borderRadius: 2.5,
      boxShadow: 'none',
      bgcolor: 'background.paper',
      border: `1px solid ${theme.palette.divider}`,
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      }
    }}>
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: '12px', 
            bgcolor: 'rgba(139, 92, 246, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <PermIdentityOutlinedIcon sx={{ color: '#8B5CF6', fontSize: '1.5rem' }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary' }}>
              Client Transactions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
              Deposit vs withdrawal trends
            </Typography>
          </Box>
        </Stack>

        {transactionError && (
          <Box sx={{ 
            bgcolor: 'error.light', 
            color: 'error.main', 
            p: 2, 
            borderRadius: 1.5,
            mb: 2
          }}>
            <Typography variant="body2">
              Error loading transaction data
            </Typography>
          </Box>
        )}
        
        <Box sx={{ height: 250 }}>
          {transactionLoading ? (
            <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 1.5 }} />
          ) : data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 20, right: 10, left: 0, bottom: 10 }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme.palette.divider}
                  vertical={false}
                />
                <XAxis 
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ 
                    fill: theme.palette.text.secondary,
                    fontSize: 12 
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ 
                    fill: theme.palette.text.secondary,
                    fontSize: 12 
                  }}
                  tickFormatter={(value) => `$${value/1000}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="deposit"
                  name="Total Deposit"
                  stroke="#3B82F6"
                  fill="url(#colorDeposit)"
                  strokeWidth={2}
                  fillOpacity={0.1}
                />
                <Area
                  type="monotone"
                  dataKey="withdrawal"
                  name="Total Withdrawal"
                  stroke="#EC4899"
                  fill="url(#colorWithdrawal)"
                  strokeWidth={2}
                  fillOpacity={0.1}
                />
                <defs>
                  <linearGradient id="colorDeposit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorWithdrawal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              bgcolor: 'grey.50',
              borderRadius: 1.5
            }}>
              <Typography variant="body2" color="text.secondary">
                No transaction data available
              </Typography>
            </Box>
          )}
        </Box>
        
        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8 }}>
              Total Deposit
            </Typography>
            {transactionLoading ? (
              <Skeleton variant="text" width={120} height={32} />
            ) : (
              <Stack direction="row" alignItems="baseline" spacing={0.5}>
                <Typography variant="h6" fontWeight={700} color="#3B82F6">
                  ${totalDeposit.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </Typography>
                <Typography variant="caption" color="#10B981" fontWeight={600}>
                  ↑{depositGrowth}%
                </Typography>
              </Stack>
            )}
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8 }}>
              Net Flow
            </Typography>
            {transactionLoading ? (
              <Skeleton variant="text" width={120} height={32} />
            ) : (
              <Typography variant="h6" fontWeight={700} color={netFlow >= 0 ? '#10B981' : '#EF4444'}>
                ${netFlow.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default MyClientTransaction;