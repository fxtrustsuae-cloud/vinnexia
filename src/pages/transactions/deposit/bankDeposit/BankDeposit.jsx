import { Container, Typography, Box, Paper, alpha, Stack, Button } from '@mui/material'
import Grid from '@mui/material/Grid2'
import BankDepositForm from './BankDepositForm'
import BankDepositDetails from './BankDepositDetails'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

// Dark theme color palette
const COLORS = {
  // Dark background colors
  background: '#121212',
  paper: '#1e1e1e',
  cardHeaderBg: '#2d2d2d',
  
  // Text colors for dark theme
  textPrimary: '#ffffff',
  textSecondary: '#b0b0b0',
  textDisabled: '#666666',
  
  // Border and divider colors
  border: '#333333',
  borderLight: '#404040',
  divider: '#2a2a2a',
  
  // Primary accent color (gold)
  primary: '#7E6233',
  primaryDark: '#5A4724',
  primaryLight: '#A68B5C',
  
  // Secondary colors
  secondary: '#3a7bd5',
  info: '#2196f3',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  
  // Additional colors
  white: '#ffffff',
  black: '#11191E',
};

function BankDeposit() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); 
    };

    return (
        <Container 
            maxWidth="lg" 
            sx={{ 
                py: 4,
                backgroundColor: COLORS.background,
                minHeight: '100vh'
            }}
        >
            {/* Header Section with Back Button */}
            <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                justifyContent="space-between" 
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={2}
                sx={{ mb: 4 }}
            >
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <AccountBalanceIcon sx={{ 
                            fontSize: '2.5rem', 
                            color: COLORS.primary,
                            backgroundColor: alpha(COLORS.primary, 0.1),
                            p: 1,
                            borderRadius: 2
                        }} />
                        <Box>
                            <Typography 
                                variant="h4" 
                                sx={{ 
                                    fontWeight: 700,
                                    color: COLORS.textPrimary,
                                    mb: 0.5
                                }}
                            >
                                Bank Deposit
                            </Typography>
                            <Typography variant="body1" color={COLORS.textSecondary}>
                                Securely deposit funds directly from your bank account
                            </Typography>
                        </Box>
                    </Box>
                    
                    {/* Status Banner */}
                    <Box
                        sx={{
                            mt: 2,
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: alpha(COLORS.success, 0.08),
                            border: `1px solid ${alpha(COLORS.success, 0.2)}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            maxWidth: 500
                        }}
                    >
                        <Box
                            sx={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: COLORS.success,
                                animation: 'pulse 2s infinite',
                                '@keyframes pulse': {
                                    '0%': { opacity: 1 },
                                    '50%': { opacity: 0.5 },
                                    '100%': { opacity: 1 }
                                }
                            }}
                        />
                        <Typography variant="body2" color={COLORS.textSecondary}>
                            All transactions are <strong style={{ color: COLORS.success }}>encrypted and protected</strong>
                        </Typography>
                    </Box>
                </Box>
                
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        px: 3,
                        py: 1.5,
                        borderColor: COLORS.border,
                        color: COLORS.textPrimary,
                        fontWeight: 500,
                        backgroundColor: alpha(COLORS.background, 0.5),
                        '&:hover': {
                            borderColor: COLORS.primary,
                            backgroundColor: alpha(COLORS.primary, 0.1),
                        }
                    }}
                >
                    Back to Deposit Methods
                </Button>
            </Stack>

            {/* Main Content Grid */}
            <Grid container spacing={3}>
                {/* Form Section */}
                <Grid size={{ xs: 12, lg: 7 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2, sm: 3 },
                            height: '100%',
                            borderRadius: 2,
                            border: `1px solid ${COLORS.border}`,
                            backgroundColor: COLORS.paper,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                        }}
                    >
                        <Box sx={{ mb: 3 }}>
                            <Typography 
                                variant="h6" 
                                fontWeight={600} 
                                gutterBottom 
                                sx={{ 
                                    color: COLORS.textPrimary,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <Box 
                                    sx={{ 
                                        width: '4px', 
                                        height: '20px', 
                                        bgcolor: COLORS.primary,
                                        borderRadius: '2px'
                                    }} 
                                />
                                Deposit Form
                            </Typography>
                            <Typography variant="body2" color={COLORS.textSecondary}>
                                Fill in your deposit details securely
                            </Typography>
                        </Box>
                        <BankDepositForm />
                    </Paper>
                </Grid>

                {/* Details Section */}
                <Grid size={{ xs: 12, lg: 5 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2, sm: 3 },
                            height: '100%',
                            borderRadius: 2,
                            border: `1px solid ${COLORS.border}`,
                            backgroundColor: COLORS.paper,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                        }}
                    >
                        <Box sx={{ mb: 3 }}>
                            <Typography 
                                variant="h6" 
                                fontWeight={600} 
                                gutterBottom 
                                sx={{ 
                                    color: COLORS.textPrimary,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1
                                }}
                            >
                                <Box 
                                    sx={{ 
                                        width: '4px', 
                                        height: '20px', 
                                        bgcolor: COLORS.info,
                                        borderRadius: '2px'
                                    }} 
                                />
                                Bank Details & Instructions
                            </Typography>
                            <Typography variant="body2" color={COLORS.textSecondary}>
                                Important information for your deposit
                            </Typography>
                        </Box>
                        <BankDepositDetails />
                    </Paper>
                </Grid>
            </Grid>

            {/* Additional Info Section */}
            <Box sx={{ mt: 4 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, sm: 3 },
                        borderRadius: 2,
                        border: `1px solid ${COLORS.border}`,
                        backgroundColor: COLORS.paper,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    }}
                >
                    <Typography 
                        variant="subtitle1" 
                        fontWeight={600} 
                        gutterBottom 
                        sx={{ 
                            color: COLORS.textPrimary,
                            mb: 2
                        }}
                    >
                        Deposit Guidelines
                    </Typography>
                    
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor: alpha(COLORS.primary, 0.08),
                                    border: `1px solid ${alpha(COLORS.primary, 0.2)}`,
                                    height: '100%'
                                }}
                            >
                                <Typography 
                                    variant="body2" 
                                    fontWeight={600} 
                                    color={COLORS.primary}
                                    gutterBottom
                                >
                                    Processing Time
                                </Typography>
                                <Typography variant="body2" color={COLORS.textSecondary}>
                                    Bank deposits typically process within 1-3 business days
                                </Typography>
                            </Box>
                        </Grid>
                        
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor: alpha(COLORS.success, 0.08),
                                    border: `1px solid ${alpha(COLORS.success, 0.2)}`,
                                    height: '100%'
                                }}
                            >
                                <Typography 
                                    variant="body2" 
                                    fontWeight={600} 
                                    color={COLORS.success}
                                    gutterBottom
                                >
                                    Security
                                </Typography>
                                <Typography variant="body2" color={COLORS.textSecondary}>
                                    256-bit SSL encryption for all transactions
                                </Typography>
                            </Box>
                        </Grid>
                        
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    backgroundColor: alpha(COLORS.info, 0.08),
                                    border: `1px solid ${alpha(COLORS.info, 0.2)}`,
                                    height: '100%'
                                }}
                            >
                                <Typography 
                                    variant="body2" 
                                    fontWeight={600} 
                                    color={COLORS.info}
                                    gutterBottom
                                >
                                    Support
                                </Typography>
                                <Typography variant="body2" color={COLORS.textSecondary}>
                                    24/7 customer support for deposit inquiries
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Container>
    )
}

export default BankDeposit;