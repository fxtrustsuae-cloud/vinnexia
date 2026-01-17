import { Stack, Typography, Card, CardContent, Box, Avatar, Chip } from "@mui/material";
import Grid from "@mui/material/Grid2";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { useState } from 'react';

// Sample data - Replace with API data
const performanceData = [
  {
    id: 1,
    name: "Abdul Faiz Mohammed",
    email: "faizabdul2002@gmail.com",
    level: 1,
    lots: 10048.47,
    commissionEarned: 25639.76,
    change: +12.5,
    avatarColor: "#699d89"
  },
  {
    id: 2,
    name: "John Smith",
    email: "john.smith@example.com",
    level: 2,
    lots: 8500.25,
    commissionEarned: 18950.50,
    change: -3.2,
    avatarColor: "#4a90e2"
  },
  {
    id: 3,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    level: 1,
    lots: 12450.75,
    commissionEarned: 31225.90,
    change: +25.8,
    avatarColor: "#e74c3c"
  },
  {
    id: 4,
    name: "Michael Brown",
    email: "m.brown@example.com",
    level: 3,
    lots: 7500.30,
    commissionEarned: 15750.25,
    change: +5.3,
    avatarColor: "#2ecc71"
  },
  {
    id: 5,
    name: "Emily Wilson",
    email: "emily.w@example.com",
    level: 2,
    lots: 9200.45,
    commissionEarned: 20700.60,
    change: -1.5,
    avatarColor: "#9b59b6"
  }
];

function PerformanceAnalytics() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Box>
      <Stack direction="row" spacing={1} mb={3} alignItems="center">
        {['all', 'level-1', 'level-2', 'level-3'].map((filter) => (
          <Chip
            key={filter}
            label={filter === 'all' ? 'All Levels' : `Level ${filter.split('-')[1]}`}
            onClick={() => setSelectedFilter(filter)}
            size="small"
            sx={{
              bgcolor: selectedFilter === filter ? 'primary.main' : 'transparent',
              color: selectedFilter === filter ? 'white' : 'text.secondary',
              borderColor: selectedFilter === filter ? 'primary.main' : 'divider',
              borderWidth: 1,
              borderStyle: 'solid',
              borderRadius: 1,
              fontSize: '0.75rem',
              height: 28,
              '&:hover': {
                bgcolor: selectedFilter === filter ? 'primary.main' : 'action.hover',
              }
            }}
          />
        ))}
      </Stack>

      <Stack spacing={1.5}>
        {performanceData
          .filter(item => 
            selectedFilter === 'all' || 
            selectedFilter === `level-${item.level}`
          )
          .map((item) => (
            <Card 
              key={item.id}
              sx={{ 
                borderRadius: 2,
                boxShadow: 'none',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                }
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar sx={{ 
                        bgcolor: item.avatarColor, 
                        width: 40, 
                        height: 40,
                        fontSize: '0.875rem',
                        fontWeight: 600
                      }}>
                        {getInitials(item.name)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.25, fontSize: '0.875rem' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
                          {item.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  
                  <Grid size={{ xs: 4, md: 1.5 }}>
                    <Box textAlign="center">
                      <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
                        Level
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color="#8B5CF6" sx={{ fontSize: '1.25rem' }}>
                        {item.level}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 4, md: 2.5 }}>
                    <Box textAlign="center">
                      <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
                        Lots
                      </Typography>
                      <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.875rem' }}>
                        {item.lots.toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 4, md: 3 }}>
                    <Box textAlign="center">
                      <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
                        Commission Earned
                      </Typography>
                      <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                        <Typography variant="body2" fontWeight={700} color="#10B981" sx={{ fontSize: '0.875rem' }}>
                          ${item.commissionEarned.toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </Typography>
                        <Chip
                          size="small"
                          icon={item.change >= 0 ? <TrendingUpIcon sx={{ fontSize: '0.75rem' }} /> : <TrendingDownIcon sx={{ fontSize: '0.75rem' }} />}
                          label={`${item.change >= 0 ? '+' : ''}${item.change}%`}
                          sx={{ 
                            height: 20,
                            fontSize: '0.65rem',
                            bgcolor: item.change >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: item.change >= 0 ? '#10B981' : '#EF4444',
                            border: 'none',
                            '& .MuiChip-icon': {
                              margin: '0 2px 0 0'
                            }
                          }}
                        />
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
      </Stack>
    </Box>
  );
}

export default PerformanceAnalytics;