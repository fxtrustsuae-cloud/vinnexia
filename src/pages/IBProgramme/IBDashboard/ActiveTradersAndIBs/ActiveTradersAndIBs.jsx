import { Stack, Typography, Card, CardContent, Box, Skeleton, useTheme } from '@mui/material'
import Grid from "@mui/material/Grid2"
import { useSelector } from 'react-redux'
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useLiveAccountQuery } from '../../../../globalState/ibState/ibStateApis';

function ActiveTradersAndIBs() {
    const theme = useTheme();
    const { selectedTheme } = useSelector((state) => state.themeMode)
    const { data: liveAccount, isLoading: liveAccountLoading } = useLiveAccountQuery()

    const totalAccount = !liveAccountLoading && liveAccount?.data
    const totalActiveTraders = totalAccount?.activeTraders?.length || 0

    const statusOverviewData = [
        {
            name: "Active Traders",
            icon: GroupIcon,
            iconColor: "#10B981",
            bgColor: "rgba(16, 185, 129, 0.1)",
            total: totalActiveTraders,
            isLoading: liveAccountLoading,
            description: "Currently trading on platform"
        },
        {
            name: "Active IBs",
            icon: PersonIcon,
            iconColor: "#3B82F6",
            bgColor: "rgba(59, 130, 246, 0.1)",
            total: 24,
            isLoading: false,
            description: "Active Introducing Brokers"
        },
    ]

    return (
        <Box>
            <Typography variant="h6" fontWeight={700} mb={2.5} sx={{ color: 'text.primary' }}>
                Active Traders & IBs
            </Typography>
            <Grid container spacing={2.5}>
                {statusOverviewData.map((item) => (
                    <Grid key={item.name} size={{ xs: 12, sm: 6 }}>
                        <Card sx={{
                            height: '100%',
                            borderRadius: 2.5,
                            boxShadow: 'none',
                            bgcolor: 'background.paper',
                            border: `1px solid ${theme.palette.divider}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                            }
                        }}>
                            <CardContent sx={{ p: 2.5 }}>
                                <Stack spacing={2}>
                                    {/* Icon and Title */}
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <Box sx={{
                                            p: 1.5,
                                            borderRadius: '12px',
                                            bgcolor: item.bgColor,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <item.icon sx={{ 
                                                color: item.iconColor, 
                                                fontSize: '1.5rem' 
                                            }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'text.primary', mb: 0.5 }}>
                                                {item.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', opacity: 0.8 }}>
                                                {item.description}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    {/* Main Stat */}
                                    <Box>
                                        {item.isLoading ? (
                                            <Skeleton width="60%" height={42} sx={{ borderRadius: 1 }} />
                                        ) : (
                                            <Typography variant="h3" fontWeight={800} sx={{ 
                                                color: item.iconColor,
                                                fontSize: { xs: '2.5rem', sm: '3rem' },
                                                lineHeight: 1.2
                                            }}>
                                                {item.total}
                                            </Typography>
                                        )}
                                    </Box>

                                    {/* Additional Info */}
                                    {!item.isLoading && (
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 1 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', opacity: 0.7 }}>
                                                Last 30 days
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <TrendingUpIcon sx={{ fontSize: '1rem', color: '#10B981' }} />
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                        color: '#10B981',
                                                        fontWeight: 600,
                                                        fontSize: '0.75rem'
                                                    }}
                                                >
                                                    +{Math.round(item.total * 0.15)} new
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export default ActiveTradersAndIBs;