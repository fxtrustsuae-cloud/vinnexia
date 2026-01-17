import { 
  Card, 
  Typography, 
  Box, 
  Stack, 
  useTheme, 
  useMediaQuery,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  alpha
} from "@mui/material"
import { 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Bar, 
  ResponsiveContainer,
  Cell
} from "recharts"
import DonutSmallOutlinedIcon from '@mui/icons-material/DonutSmallOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import { useState } from 'react'

// Sample data - replace with actual API data
const monthlyData = [
  { month: "Jan", commission: 4200, target: 5000 },
  { month: "Feb", commission: 3200, target: 5000 },
  { month: "Mar", commission: 5200, target: 5000 },
  { month: "Apr", commission: 3800, target: 5000 },
  { month: "May", commission: 4500, target: 5000 },
  { month: "Jun", commission: 4800, target: 5000 },
  { month: "Jul", commission: 5100, target: 5000 },
  { month: "Aug", commission: 3900, target: 5000 },
  { month: "Sep", commission: 4700, target: 5000 },
  { month: "Oct", commission: 5300, target: 5000 },
  { month: "Nov", commission: 4900, target: 5000 },
  { month: "Dec", commission: 5600, target: 5000 }
]

const quarterlyData = [
  { quarter: "Q1", commission: 12600, target: 15000 },
  { quarter: "Q2", commission: 13100, target: 15000 },
  { quarter: "Q3", commission: 13700, target: 15000 },
  { quarter: "Q4", commission: 15800, target: 15000 }
]

function MonthlyCommission() {
  const theme = useTheme()
  const isMobile = useMediaQuery('(max-width:600px)')
  const [timeFrame, setTimeFrame] = useState('monthly')
  const [anchorEl, setAnchorEl] = useState(null)
  const selectedTheme = theme.palette.mode

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleTimeFrameChange = (value) => {
    setTimeFrame(value)
    handleMenuClose()
  }

  const data = timeFrame === 'monthly' ? monthlyData : quarterlyData
  const xAxisKey = timeFrame === 'monthly' ? 'month' : 'quarter'

  // Calculate stats
  const totalCommission = data.reduce((sum, item) => sum + item.commission, 0)
  const avgCommission = Math.round(totalCommission / data.length)
  const highestMonth = data.reduce((max, item) => item.commission > max.commission ? item : max, data[0])
  const growth = data.length > 1 
    ? ((data[data.length - 1].commission - data[0].commission) / data[0].commission * 100).toFixed(1)
    : 0

  const getBarColor = (value, target) => {
    const percentage = (value / target) * 100
    if (percentage >= 100) return theme.palette.success.main
    if (percentage >= 80) return theme.palette.info.main
    if (percentage >= 60) return theme.palette.warning.main
    return theme.palette.error.main
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card sx={{ 
          p: 1.5, 
          bgcolor: selectedTheme === 'dark' ? 'grey.900' : 'white',
          border: `1px solid ${selectedTheme === 'dark' ? 'grey.800' : 'grey.200'}`,
          boxShadow: theme.shadows[3]
        }}>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
            {label}
          </Typography>
          <Stack spacing={0.5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Commission:
              </Typography>
              <Typography variant="caption" fontWeight={600}>
                ${payload[0].value.toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Target:
              </Typography>
              <Typography variant="caption" fontWeight={600}>
                ${payload[0].payload.target.toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Achievement:
              </Typography>
              <Typography variant="caption" fontWeight={600}>
                {((payload[0].value / payload[0].payload.target) * 100).toFixed(1)}%
              </Typography>
            </Box>
          </Stack>
        </Card>
      )
    }
    return null
  }

  return (
    <Card
      sx={{
        width: '100%',
        borderRadius: '12px',
        bgcolor: selectedTheme === 'dark' ? 'grey.900' : '#ffffff',
        border: `1px solid ${selectedTheme === 'dark' ? 'grey.800' : 'grey.200'}`,
        boxShadow: selectedTheme === 'dark' 
          ? '0 2px 12px rgba(0,0,0,0.15)' 
          : '0 2px 8px rgba(0,0,0,0.05)',
        p: { xs: 1.5, sm: 2.5 },
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: selectedTheme === 'dark' 
            ? '0 4px 20px rgba(0,0,0,0.25)' 
            : '0 4px 16px rgba(0,0,0,0.1)',
        }
      }}
    >
      {/* Header Section */}
      <Stack 
        direction="row" 
        alignItems="center" 
        justifyContent="space-between"
        sx={{ mb: 2.5 }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              bgcolor: theme.palette.primary.main,
              borderRadius: '10px',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DonutSmallOutlinedIcon sx={{ color: 'white', fontSize: isMobile ? 20 : 24 }} />
          </Box>
          <Box>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              fontWeight={700}
              color="text.primary"
            >
              Commission Overview
            </Typography>
            <Typography 
              variant="body2"
              sx={{ 
                color: selectedTheme === "dark" ? "grey.400" : "text.secondary",
                mt: 0.25
              }}
            >
              Track your commission earnings over time
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Chip
            label={`$${totalCommission.toLocaleString()} total`}
            size="small"
            color="primary"
            sx={{
              fontSize: '0.75rem',
              height: 24,
              display: { xs: 'none', sm: 'flex' }
            }}
          />
          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{
              border: `1px solid ${selectedTheme === 'dark' ? 'grey.700' : 'grey.300'}`,
              p: 0.75
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleTimeFrameChange('monthly')}>
              Monthly View
            </MenuItem>
            <MenuItem onClick={() => handleTimeFrameChange('quarterly')}>
              Quarterly View
            </MenuItem>
          </Menu>
        </Stack>
      </Stack>

      {/* Stats Summary */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2}
        sx={{ 
          mb: 3,
          p: 2,
          borderRadius: '8px',
          bgcolor: selectedTheme === 'dark' ? 'grey.800' : 'grey.50',
          border: `1px solid ${selectedTheme === 'dark' ? 'grey.700' : 'grey.200'}`
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Total Commission
          </Typography>
          <Typography variant="h4" fontWeight={700} color="text.primary">
            ${totalCommission.toLocaleString()}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Average Monthly
          </Typography>
          <Typography variant="h6" fontWeight={600} color="text.primary">
            ${avgCommission.toLocaleString()}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Highest {timeFrame === 'monthly' ? 'Month' : 'Quarter'}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography variant="h6" fontWeight={600} color="text.primary">
              {highestMonth[xAxisKey]}
            </Typography>
            <Typography variant="body2" color="success.main" fontWeight={600}>
              ${highestMonth.commission.toLocaleString()}
            </Typography>
          </Stack>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Growth Rate
          </Typography>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            {growth >= 0 ? (
              <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
            ) : (
              <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
            )}
            <Typography 
              variant="h6" 
              fontWeight={600} 
              color={growth >= 0 ? 'success.main' : 'error.main'}
            >
              {growth}%
            </Typography>
          </Stack>
        </Box>
      </Stack>

      {/* Chart Container */}
      <Box sx={{ width: '100%', height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={selectedTheme === 'dark' ? 'grey.700' : 'grey.300'}
              vertical={false}
            />
            <XAxis 
              dataKey={xAxisKey} 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fill: selectedTheme === 'dark' ? 'grey.400' : 'grey.600',
                fontSize: isMobile ? 10 : 12
              }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fill: selectedTheme === 'dark' ? 'grey.400' : 'grey.600',
                fontSize: isMobile ? 10 : 12
              }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{
                paddingTop: 20,
                fontSize: isMobile ? 12 : 14
              }}
            />
            <Bar 
              dataKey="commission" 
              name="Commission Earned"
              radius={[4, 4, 0, 0]}
              barSize={isMobile ? 30 : 40}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getBarColor(entry.commission, entry.target)}
                />
              ))}
            </Bar>
            <Bar 
              dataKey="target" 
              name="Target"
              fill={selectedTheme === 'dark' ? 'grey.700' : 'grey.300'}
              opacity={0.3}
              radius={[4, 4, 0, 0]}
              barSize={isMobile ? 30 : 40}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Chart Controls */}
      <Stack 
        direction="row" 
        alignItems="center" 
        justifyContent="space-between"
        sx={{ mt: 2, pt: 2, borderTop: `1px solid ${selectedTheme === 'dark' ? 'grey.800' : 'grey.200'}` }}
      >
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Frame</InputLabel>
          <Select
            value={timeFrame}
            label="Time Frame"
            onChange={(e) => setTimeFrame(e.target.value)}
            size="small"
          >
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="quarterly">Quarterly</MenuItem>
          </Select>
        </FormControl>
        
        <Stack direction="row" spacing={1}>
          <Chip
            label="On Target"
            size="small"
            sx={{ 
              bgcolor: alpha(theme.palette.success.main, 0.1),
              color: theme.palette.success.main,
              fontSize: '0.75rem'
            }}
          />
          <Chip
            label="Below Target"
            size="small"
            sx={{ 
              bgcolor: alpha(theme.palette.error.main, 0.1),
              color: theme.palette.error.main,
              fontSize: '0.75rem'
            }}
          />
        </Stack>
      </Stack>
    </Card>
  )
}

export default MonthlyCommission