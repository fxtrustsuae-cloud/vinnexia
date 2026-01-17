import { Stack, Typography, Card, CardContent, Box, Avatar, LinearProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from 'react';

// Sample data - Replace with API data
const teamPerformanceData = [
  {
    id: 1,
    name: "Abdul Faiz Mohammed",
    type: "Sub IB",
    affiliateCode: "683292",
    commission: 25639.76,
    lots: 10048.47,
    progress: 85,
    avatarColor: "#699d89"
  },
  {
    id: 2,
    name: "John Trader",
    type: "Trader",
    affiliateCode: "683293",
    commission: 18950.50,
    lots: 8500.25,
    progress: 70,
    avatarColor: "#4a90e2"
  },
  {
    id: 3,
    name: "Sarah Wilson",
    type: "Sub IB",
    affiliateCode: "683294",
    commission: 31225.90,
    lots: 12450.75,
    progress: 95,
    avatarColor: "#e74c3c"
  },
  {
    id: 4,
    name: "Michael Brown",
    type: "Trader",
    affiliateCode: "683295",
    commission: 15750.25,
    lots: 7500.30,
    progress: 60,
    avatarColor: "#2ecc71"
  },
  {
    id: 5,
    name: "Emily Johnson",
    type: "Sub IB",
    affiliateCode: "683296",
    commission: 20700.60,
    lots: 9200.45,
    progress: 78,
    avatarColor: "#9b59b6"
  }
];

function IBTeamPerformance() {
  const [sortBy, setSortBy] = useState('commission');

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sortedData = [...teamPerformanceData].sort((a, b) => {
    if (sortBy === 'commission') return b.commission - a.commission;
    if (sortBy === 'lots') return b.lots - a.lots;
    return 0;
  });

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: 'text.primary', mb: 0.5 }}>
            Team Performance
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
            Showing top 5 performers
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          {['commission', 'lots'].map((sort) => (
            <Typography
              key={sort}
              variant="caption"
              sx={{
                cursor: 'pointer',
                color: sortBy === sort ? 'primary.main' : 'text.secondary',
                fontWeight: sortBy === sort ? 700 : 400,
                textTransform: 'capitalize',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                bgcolor: sortBy === sort ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                fontSize: '0.75rem',
                '&:hover': {
                  bgcolor: 'action.hover',
                }
              }}
              onClick={() => setSortBy(sort)}
            >
              Sort by {sort}
            </Typography>
          ))}
        </Stack>
      </Stack>

      <Stack spacing={1.5}>
        {sortedData.map((item) => (
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
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: item.type === 'Sub IB' ? '#10B981' : '#3B82F6',
                          fontWeight: 600,
                          bgcolor: item.type === 'Sub IB' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                          px: 0.75,
                          py: 0.25,
                          borderRadius: 0.5,
                          fontSize: '0.7rem'
                        }}
                      >
                        {item.type}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                
                <Grid size={{ xs: 6, md: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
                      Affiliate Code
                    </Typography>
                    <Typography variant="body2" fontWeight={600} color="#8B5CF6" sx={{ fontSize: '0.875rem' }}>
                      {item.affiliateCode}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 6, md: 2.5 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
                      Commission
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.875rem' }}>
                      ${item.commission.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, md: 2.5 }}>
                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                      <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
                        Lots
                      </Typography>
                      <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.7rem' }}>
                        {item.progress}%
                      </Typography>
                    </Stack>
                    <Typography variant="body2" fontWeight={600} color="success.main" mb={0.5} sx={{ fontSize: '0.875rem' }}>
                      {item.lots.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={item.progress} 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        bgcolor: 'action.hover',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: item.progress > 80 ? '#10B981' : 
                                  item.progress > 60 ? '#3B82F6' : '#F59E0B',
                          borderRadius: 3
                        }
                      }}
                    />
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

export default IBTeamPerformance;