import { useSelector } from 'react-redux'
import { 
    Container, 
    Typography, 
    Box, 
    Paper, 
    Stack, 
    Button,
    IconButton,
    Tooltip,
    Popover,
    alpha
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import CryptoDepositForm from './CryptoDepositForm'
import CryptoDepositQR from './CryptoDepositQR'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import QrCodeIcon from '@mui/icons-material/QrCode';
import InfoIcon from '@mui/icons-material/Info';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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

function CryptoDeposit() {
    const navigate = useNavigate();
    const { depositQRData } = useSelector(state => state.payment);
    
    // State for popover
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverContent, setPopoverContent] = useState('');

    const handleBack = () => {
        navigate(-1); 
    };

    // Popover handlers
    const handleInfoClick = (event, content) => {
        setAnchorEl(event.currentTarget);
        setPopoverContent(content);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const popoverId = open ? 'crypto-deposit-info-popover' : undefined;

    // Content variables for different info sections
    const headerInfoContent = `
        • Crypto deposits are secure and irreversible
        • Funds typically appear in your account within 1-6 confirmations
        • Network fees apply and vary based on blockchain congestion
        • Always double-check the deposit address before sending
        • Contact support if your deposit doesn't appear after 30 minutes
    `;

    const depositFormInfoContent = `
        • Select the cryptocurrency you want to deposit
        • Choose the network - make sure it matches your wallet
        • Enter the amount you wish to deposit
        • Minimum deposit amounts vary by cryptocurrency
        • Maximum limits apply for security reasons
    `;

    const qrCodeInfoContent = `
        • Scan this QR code with your crypto wallet
        • The QR contains the deposit address and amount
        • Do not share this QR code with others
        • Each QR code is unique to this deposit
        • Expires after 1 hour for security
    `;

    const generalInfoContent = `
        IMPORTANT SAFETY TIPS:
        
        1. Always verify the deposit address
        2. Send a small test amount first for large deposits
        3. Keep your transaction ID for reference
        4. Deposits are processed automatically
        5. Contact support if you encounter any issues
    `;

    // Dark theme color variables
    const pageBgColor = COLORS.darkBg;
    const cardBgColor = alpha("#2a2f34", 0.9);
    const borderColor = alpha(COLORS.greyDark, 0.2);
    const textPrimary = COLORS.whiteMain;
    const textSecondary = COLORS.greyMedium;
    
    const infoCardBg = alpha("#1976d2", 0.15);
    const infoCardBorder = alpha("#1976d2", 0.3);
    const helpSectionBg = alpha(COLORS.greyDark, 0.1);
    const emptyStateBg = alpha(COLORS.greyDark, 0.2);
    const emptyStateBorder = `1px dashed ${borderColor}`;
    
    const qrInstructionsBg = alpha(COLORS.accentGold, 0.1);
    const qrInstructionsBorder = alpha(COLORS.accentGold, 0.2);
    
    const metricCardBg = alpha(COLORS.accentGold, 0.08);
    const metricCardHoverBg = alpha(COLORS.accentGold, 0.15);
    const metricCardBorder = alpha(COLORS.accentGold, 0.1);

    return (
        <Box sx={{ 
            bgcolor: pageBgColor, 
            minHeight: '100vh',
            p: { xs: 2, md: 3 }
        }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
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
                            <CurrencyExchangeIcon sx={{ 
                                fontSize: '2.5rem', 
                                color: COLORS.accentGold,
                            }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography 
                                    variant="h4" 
                                    sx={{ 
                                        fontWeight: 700,
                                        color: textPrimary,
                                        textShadow: `0 2px 8px ${alpha(COLORS.accentGold, 0.3)}`
                                    }}
                                >
                                    Crypto Deposit
                                </Typography>
                                <Tooltip title="Crypto deposit information">
                                    <IconButton 
                                        size="small" 
                                        onClick={(e) => handleInfoClick(e, headerInfoContent)}
                                        sx={{ 
                                            color: COLORS.accentGold,
                                            '&:hover': { 
                                                bgcolor: alpha(COLORS.accentGold, 0.2) 
                                            }
                                        }}
                                    >
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                        <Typography variant="body1" color={textSecondary}>
                            Deposit cryptocurrency directly to your account. Secure, fast, and with minimal fees.
                        </Typography>
                    </Box>
                    
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={handleBack}
                        sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 3,
                            borderWidth: 2,
                            borderColor: alpha(COLORS.accentGold, 0.5),
                            color: COLORS.accentGold,
                            '&:hover': {
                                borderWidth: 2,
                                borderColor: COLORS.accentGold,
                                bgcolor: alpha(COLORS.accentGold, 0.1)
                            }
                        }}
                    >
                        Back to Deposit Methods
                    </Button>
                </Stack>

                {/* Information Popover */}
                <Popover
                    id={popoverId}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    PaperProps={{
                        sx: {
                            p: 2,
                            maxWidth: 400,
                            borderRadius: 2,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                            border: `1px solid ${borderColor}`,
                            bgcolor: cardBgColor,
                        }
                    }}
                >
                    <Stack spacing={1}>
                        <Typography variant="subtitle2" fontWeight={600} color={COLORS.accentGold}>
                            Crypto Deposit Information
                        </Typography>
                        <Typography variant="body2" color={textSecondary} sx={{ whiteSpace: 'pre-line' }}>
                            {popoverContent}
                        </Typography>
                    </Stack>
                </Popover>

                {/* General Information Card */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        mb: 4,
                        borderRadius: 2,
                        bgcolor: infoCardBg,
                        border: `1px solid ${infoCardBorder}`,
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                        <InfoIcon sx={{ mt: 0.5, color: "#42a5f5" }} />
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="body2" fontWeight={500} color={COLORS.accentGold}>
                                    Important Crypto Deposit Guidelines
                                </Typography>
                                <Tooltip title="Click for detailed safety tips">
                                    <IconButton 
                                        size="small" 
                                        onClick={(e) => handleInfoClick(e, generalInfoContent)}
                                        sx={{ 
                                            p: 0.5,
                                            color: "#42a5f5",
                                            '&:hover': { 
                                                bgcolor: alpha("#42a5f5", 0.2) 
                                            }
                                        }}
                                    >
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Typography variant="caption" color={textSecondary}>
                                • Verify addresses carefully • Send test amounts first • Keep transaction IDs • Network fees apply • Contact support for help
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>

                {/* Main Content Grid */}
                <Grid container spacing={4}>
                    {/* Form Section */}
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 2, sm: 3 },
                                height: '100%',
                                borderRadius: 2,
                                border: `1px solid ${borderColor}`,
                                backgroundColor: cardBgColor,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                position: 'relative',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                }
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" fontWeight={600} color={textPrimary}>
                                    Deposit Form
                                </Typography>
                                <Tooltip title="Form instructions">
                                    <IconButton 
                                        size="small" 
                                        onClick={(e) => handleInfoClick(e, depositFormInfoContent)}
                                        sx={{ 
                                            color: COLORS.accentGold,
                                            '&:hover': { 
                                                bgcolor: alpha(COLORS.accentGold, 0.2) 
                                            }
                                        }}
                                    >
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <CryptoDepositForm />
                        </Paper>
                    </Grid>

                    {/* QR Code Section */}
                    <Grid size={{ xs: 12, lg: 6 }}>
                        {depositQRData ? (
                            <Paper
                                elevation={0}
                                sx={{
                                    p: { xs: 2, sm: 3 },
                                    height: '100%',
                                    borderRadius: 2,
                                    border: `1px solid ${borderColor}`,
                                    backgroundColor: cardBgColor,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                    position: 'relative',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                    }
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <QrCodeIcon sx={{ color: COLORS.accentGold }} />
                                        <Typography variant="h6" fontWeight={600} color={textPrimary}>
                                            Deposit QR Code
                                        </Typography>
                                    </Stack>
                                    <Tooltip title="QR code instructions">
                                        <IconButton 
                                            size="small" 
                                            onClick={(e) => handleInfoClick(e, qrCodeInfoContent)}
                                            sx={{ 
                                                color: COLORS.accentGold,
                                                '&:hover': { 
                                                    bgcolor: alpha(COLORS.accentGold, 0.2) 
                                                }
                                            }}
                                        >
                                            <InfoIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                                <CryptoDepositQR />
                                
                                {/* QR Code Instructions */}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        mt: 3,
                                        p: 2,
                                        borderRadius: 1,
                                        bgcolor: qrInstructionsBg,
                                        border: `1px solid ${qrInstructionsBorder}`,
                                    }}
                                >
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <InfoIcon sx={{ color: COLORS.accentGold }} fontSize="small" />
                                        <Typography variant="caption" color={textPrimary}>
                                            Scan this QR code with your crypto wallet app to make the deposit
                                        </Typography>
                                    </Stack>
                                </Paper>
                            </Paper>
                        ) : (
                            <Paper
                                elevation={0}
                                sx={{
                                    p: { xs: 2, sm: 3 },
                                    height: '100%',
                                    borderRadius: 2,
                                    border: emptyStateBorder,
                                    backgroundColor: emptyStateBg,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                    minHeight: 400,
                                    position: 'relative',
                                }}
                            >
                                <QrCodeIcon sx={{ 
                                    fontSize: 64, 
                                    color: COLORS.greyDark, 
                                    mb: 2 
                                }} />
                                <Typography variant="h6" color={textSecondary} gutterBottom>
                                    QR Code Will Appear Here
                                </Typography>
                                <Typography variant="body2" color={textSecondary} sx={{ mb: 3 }}>
                                    Fill out the deposit form on the left to generate a QR code for your deposit.
                                </Typography>
                                
                                {/* Info button for empty state */}
                                <Tooltip title="How to generate QR code">
                                    <IconButton 
                                        size="small" 
                                        onClick={(e) => handleInfoClick(e, "Complete the deposit form to generate a QR code. The QR code will contain:\n• Deposit address\n• Deposit amount\n• Network information\n• Expiry timestamp")}
                                        sx={{ 
                                            position: 'absolute',
                                            top: 16,
                                            right: 16,
                                            color: COLORS.greyMedium,
                                            '&:hover': { 
                                                bgcolor: alpha(COLORS.accentGold, 0.2) 
                                            }
                                        }}
                                    >
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Paper>
                        )}
                    </Grid>
                </Grid>

                {/* Additional Information Section */}
                <Paper
                    elevation={0}
                    sx={{
                        mt: 4,
                        p: 3,
                        borderRadius: 2,
                        bgcolor: helpSectionBg,
                        border: `1px solid ${borderColor}`,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" fontWeight={600} color={textPrimary}>
                            Need Help with Crypto Deposits?
                        </Typography>
                        <Tooltip title="Get assistance with crypto deposits">
                            <IconButton 
                                size="small" 
                                onClick={(e) => handleInfoClick(e, "Our support team can help with:\n• Deposit issues\n• Address verification\n• Transaction troubleshooting\n• Network fee explanations\n• Security concerns")}
                                sx={{ 
                                    color: COLORS.accentGold,
                                    '&:hover': { 
                                        bgcolor: alpha(COLORS.accentGold, 0.2) 
                                    }
                                }}
                            >
                                <InfoIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    textAlign: 'center',
                                    borderRadius: 2,
                                    bgcolor: metricCardBg,
                                    border: `1px solid ${metricCardBorder}`,
                                    transition: 'all 0.3s ease',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&:hover': {
                                        bgcolor: metricCardHoverBg,
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 4px 20px ${alpha(COLORS.accentGold, 0.2)}`,
                                    }
                                }}
                            >
                                <SpeedIcon sx={{ color: COLORS.accentGold, fontSize: 32, mb: 1 }} />
                                <Typography variant="body2" fontWeight={600} color={COLORS.accentGold} gutterBottom>
                                    Fast Processing
                                </Typography>
                                <Typography variant="caption" color={textSecondary}>
                                    1-6 confirmations typically
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    textAlign: 'center',
                                    borderRadius: 2,
                                    bgcolor: metricCardBg,
                                    border: `1px solid ${metricCardBorder}`,
                                    transition: 'all 0.3s ease',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&:hover': {
                                        bgcolor: metricCardHoverBg,
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 4px 20px ${alpha(COLORS.accentGold, 0.2)}`,
                                    }
                                }}
                            >
                                <AttachMoneyIcon sx={{ color: COLORS.accentGold, fontSize: 32, mb: 1 }} />
                                <Typography variant="body2" fontWeight={600} color={COLORS.accentGold} gutterBottom>
                                    Low Fees
                                </Typography>
                                <Typography variant="caption" color={textSecondary}>
                                    Network fees only
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    textAlign: 'center',
                                    borderRadius: 2,
                                    bgcolor: metricCardBg,
                                    border: `1px solid ${metricCardBorder}`,
                                    transition: 'all 0.3s ease',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&:hover': {
                                        bgcolor: metricCardHoverBg,
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 4px 20px ${alpha(COLORS.accentGold, 0.2)}`,
                                    }
                                }}
                            >
                                <SecurityIcon sx={{ color: COLORS.accentGold, fontSize: 32, mb: 1 }} />
                                <Typography variant="body2" fontWeight={600} color={COLORS.accentGold} gutterBottom>
                                    Secure
                                </Typography>
                                <Typography variant="caption" color={textSecondary}>
                                    Blockchain security
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    textAlign: 'center',
                                    borderRadius: 2,
                                    bgcolor: metricCardBg,
                                    border: `1px solid ${metricCardBorder}`,
                                    transition: 'all 0.3s ease',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    '&:hover': {
                                        bgcolor: metricCardHoverBg,
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 4px 20px ${alpha(COLORS.accentGold, 0.2)}`,
                                    }
                                }}
                            >
                                <SupportAgentIcon sx={{ color: COLORS.accentGold, fontSize: 32, mb: 1 }} />
                                <Typography variant="body2" fontWeight={600} color={COLORS.accentGold} gutterBottom>
                                    24/7 Support
                                </Typography>
                                <Typography variant="caption" color={textSecondary}>
                                    Always available
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                    
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Button 
                            variant="outlined" 
                            sx={{ 
                                textTransform: 'none',
                                borderRadius: 2,
                                px: 3,
                                borderColor: alpha(COLORS.accentGold, 0.5),
                                color: COLORS.accentGold,
                                '&:hover': {
                                    borderColor: COLORS.accentGold,
                                    bgcolor: alpha(COLORS.accentGold, 0.1)
                                }
                            }}
                            onClick={() => navigate('/support/crypto-deposit-help')}
                        >
                            Contact Support for Crypto Deposit Help
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}

export default CryptoDeposit;