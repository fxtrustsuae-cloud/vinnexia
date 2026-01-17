import { Stack, Typography, Box, Card, CardContent } from "@mui/material";
import Grid from "@mui/material/Grid2";
import IBTeamPerformance from './IBTeamPerformance';
import PerformanceAnalytics from "./PerformanceAnalytics ";
import AssessmentIcon from '@mui/icons-material/Assessment';

function IBPerformaneAndPerformanceAnalytics() {
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <AssessmentIcon sx={{ fontSize: '2rem', color: 'primary.main' }} />
        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary' }}>
            Performance Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.8 }}>
            Track and analyze team performance metrics
          </Typography>
        </Box>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ 
            height: '100%',
            borderRadius: 2.5,
            boxShadow: 'none',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <IBTeamPerformance />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ 
            height: '100%',
            borderRadius: 2.5,
            boxShadow: 'none',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <PerformanceAnalytics />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default IBPerformaneAndPerformanceAnalytics;