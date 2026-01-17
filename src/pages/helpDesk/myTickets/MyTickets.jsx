import { Container, Box, Typography, Paper, Stack, alpha } from '@mui/material';
import TicketsTable from './ticketsTable/TicketsTable';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

// Color palette - DARK THEME
const COLORS = {
    accentGold: "#7E6233",
    whiteMain: "#FEFEFE",
    blackDark: "#11191E",
    greyLight: "#CACDCC",
    greyMedium: "#B3B6B6",
    greyDark: "#848F94",
    darkBg: "#1a1f24",
};

function MyTickets() {
    // Get tickets data from state if available (assuming you have it in Redux)
    const ticketsData = useSelector(state => state.support?.tickets?.data || {});
    
    // Calculate stats
    const ticketStats = useMemo(() => {
        const tickets = ticketsData?.ticketList || [];
        return {
            total: tickets.length,
            open: tickets.filter(t => t.status === 'OPEN').length,
            closed: tickets.filter(t => t.status === 'CLOSED').length,
            processing: tickets.filter(t => t.status === 'PROCESSING').length,
        };
    }, [ticketsData]);

    // Dark theme color variables
    const pageBgColor = COLORS.darkBg;
    const cardBgColor = alpha("#2a2f34", 0.9);
    const borderColor = alpha(COLORS.greyDark, 0.2);
    const textPrimary = COLORS.whiteMain;
    const textSecondary = COLORS.greyMedium;

    return (
        <Box sx={{ 
            bgcolor: pageBgColor, 
            minHeight: '100vh',
            p: { xs: 2, md: 3 }
        }}>
            <Container maxWidth="xl" sx={{ py: { xs: 2, md: 3 } }}>
                {/* Header Section */}
                <Box sx={{ mb: { xs: 3, md: 4 } }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box
                                sx={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '14px',
                                    backgroundColor: alpha(COLORS.accentGold, 0.15),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <SupportAgentIcon 
                                    sx={{ 
                                        color: COLORS.accentGold,
                                        fontSize: '2rem'
                                    }} 
                                />
                            </Box>
                            <Box>
                                <Typography 
                                    variant="h4" 
                                    fontWeight={700}
                                    sx={{ 
                                        fontSize: { xs: '1.5rem', md: '2rem' },
                                        color: textPrimary
                                    }}
                                >
                                    My Support Tickets
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        color: textSecondary,
                                        fontSize: { xs: '0.875rem', md: '1rem' }
                                    }}
                                >
                                    Track and manage all your support requests
                                </Typography>
                            </Box>
                        </Stack>
                        
                        {/* Quick Stats */}
                        <Stack direction="row" spacing={2}>
                            <Paper
                                sx={{
                                    p: 1.5,
                                    borderRadius: '10px',
                                    backgroundColor: alpha(COLORS.accentGold, 0.08),
                                    border: `1px solid ${alpha(COLORS.accentGold, 0.2)}`,
                                    minWidth: '80px'
                                }}
                            >
                                <Typography variant="caption" sx={{ color: textSecondary, display: 'block' }}>
                                    Total
                                </Typography>
                                <Typography variant="h6" fontWeight={600} sx={{ color: COLORS.accentGold }}>
                                    {ticketStats.total}
                                </Typography>
                            </Paper>
                            <Paper
                                sx={{
                                    p: 1.5,
                                    borderRadius: '10px',
                                    backgroundColor: alpha("#42a5f5", 0.08),
                                    border: `1px solid ${alpha("#42a5f5", 0.2)}`,
                                    minWidth: '80px'
                                }}
                            >
                                <Typography variant="caption" sx={{ color: textSecondary, display: 'block' }}>
                                    Open
                                </Typography>
                                <Typography variant="h6" fontWeight={600} sx={{ color: "#42a5f5" }}>
                                    {ticketStats.open}
                                </Typography>
                            </Paper>
                        </Stack>
                    </Stack>
                </Box>

                {/* Table Section */}
                <Paper 
                    elevation={0}
                    sx={{
                        p: { xs: 2, md: 3 },
                        borderRadius: '16px',
                        backgroundColor: cardBgColor,
                        border: `1px solid ${borderColor}`,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                        overflow: 'hidden'
                    }}
                >
                    <TicketsTable />
                </Paper>
            </Container>
        </Box>
    )
}

export default MyTickets;