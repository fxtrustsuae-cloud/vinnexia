import { 
    Card, 
    Stack, 
    Typography, 
    useMediaQuery, 
    Box, 
    Chip, 
    Alert, 
    Paper, 
    Button, 
    alpha, 
    IconButton, 
    Tooltip, 
    Popover 
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { DepositMethodsData } from './DepositMethodsData';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useGetUserDataQuery } from '../../../../globalState/userState/userStateApis';
import { useState } from 'react';

// Color palette - USING DARK COLORS
const COLORS = {
  accentGold: "#7E6233",
  whiteMain: "#FEFEFE",
  blackDark: "#11191E", // Dark text on light background
  greyLight: "#CACDCC",
  greyMedium: "#B3B6B6",
  greyDark: "#848F94",
  darkBg: "#1a1f24", // Dark background color
};

function DepositMethods() {
    const { token } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const isKycVerified = !isLoading && data?.data?.userData?.isKycVerified;
    const isBankVerified = !isLoading && data?.data?.userData?.isBankVerified;

    const isDesktop = useMediaQuery('(min-width:768px)');
    const isTablet = useMediaQuery('(min-width:600px)');
    
    // State for popover
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverContent, setPopoverContent] = useState('');

    // Filter methods based on verification status
    const getAvailableMethods = () => {
        return DepositMethodsData.filter(method => {
            if (method.requiresKYC && !isKycVerified) return false;
            if (method.requiresBankVerification && !isBankVerified) return false;
            return true;
        });
    };

    const availableMethods = getAvailableMethods();
    const unavailableMethods = DepositMethodsData.filter(m => !availableMethods.includes(m));

    // Get verification progress
    const verificationProgress = () => {
        let completed = 0;
        let total = 2; // KYC + Bank Verification
        
        if (isKycVerified) completed++;
        if (isBankVerified) completed++;
        
        return { completed, total, percentage: (completed / total) * 100 };
    };

    const progress = verificationProgress();

    // Popover handlers
    const handleInfoClick = (event, content) => {
        setAnchorEl(event.currentTarget);
        setPopoverContent(content);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const popoverId = open ? 'deposit-info-popover' : undefined;

    // Content for header info popup
    const headerInfoContent = `
        • All deposit methods are secure and encrypted
        • Funds are typically available within minutes
        • Contact support if you experience any delays
        • Review processing times for each method
    `;

    // Content for verification info
    const verificationInfoContent = `
        Complete KYC and Bank verification to unlock all deposit methods. 
        This process helps us ensure account security and compliance with regulations.
        
        KYC Verification: Verify your identity with government-issued ID
        Bank Verification: Add and verify your bank account details
    `;

    // Content for available methods info
    const availableMethodsInfoContent = `
        These methods are available based on your current verification level. 
        Complete verification to unlock more options.
        
        • Basic verification unlocks standard methods
        • Full verification unlocks all payment methods
        • Some methods have higher deposit limits
    `;

    // Content for unavailable methods info
    const unavailableMethodsInfoContent = `
        These methods require additional verification. 
        Complete KYC and/or Bank verification to access them.
        
        • KYC Verification unlocks more deposit options
        • Bank Verification enables bank transfer methods
        • Complete both for full access
    `;

    // Content for deposit info chips
    const depositInfoContent = `
        • Minimum deposit amount varies by method
        • Most deposits are processed instantly
        • Some methods may require additional verification
        • No deposit fees from our side
        • Contact support for any issues
    `;

    // DARK MODE COLOR VARIABLES
    const pageBgColor = COLORS.darkBg; // Dark background #1a1f24
    const cardBgColor = alpha("#2a2f34", 0.8); // Slightly lighter dark for cards
    const borderColor = alpha(COLORS.greyDark, 0.2); // Dark borders
    const textPrimary = COLORS.whiteMain; // White text for primary
    const textSecondary = COLORS.greyMedium; // Grey text for secondary
    
    const infoCardBg = alpha("#1976d2", 0.15);
    const infoCardBorder = alpha("#1976d2", 0.3);
    const warningBg = alpha("#ed6c02", 0.15);
    const warningBorder = alpha("#ed6c02", 0.3);
    const successBg = alpha("#2e7d32", 0.15);
    const successBorder = alpha("#2e7d32", 0.3);
    
    const helpSectionBg = alpha(COLORS.greyDark, 0.1);
    const unavailableBg = alpha(COLORS.greyDark, 0.2);
    const gradientBg = `linear-gradient(135deg, ${alpha(COLORS.accentGold, 0.15)} 0%, ${alpha(COLORS.darkBg, 0.3)} 100%)`;

    return (
        <Box sx={{ 
            bgcolor: pageBgColor, 
            minHeight: '100vh',
            p: { xs: 2, md: 3 }
        }}>
            <Stack spacing={3} maxWidth="1200px" mx="auto">
                {/* Welcome Header with Info Icon */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography 
                                variant='h4' 
                                fontWeight={700}
                                color={textPrimary}
                            >
                                Deposit Funds
                            </Typography>
                            <Tooltip title="More information about deposits">
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
                        <Typography variant='body1' color={textSecondary}>
                            Choose your preferred deposit method. Your funds will be available instantly for trading.
                        </Typography>
                    </Box>
                </Box>

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
                            Deposit Information
                        </Typography>
                        <Typography variant="body2" color={textSecondary} sx={{ whiteSpace: 'pre-line' }}>
                            {popoverContent}
                        </Typography>
                    </Stack>
                </Popover>

                {/* Verification Status Banner */}
                {progress.percentage < 100 && (
                    <Alert 
                        severity="warning" 
                        icon={<WarningIcon />}
                        sx={{ 
                            borderRadius: 2,
                            border: `1px solid ${warningBorder}`,
                            '& .MuiAlert-message': { width: '100%' },
                            bgcolor: warningBg,
                        }}
                    >
                        <Stack spacing={1}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle2" fontWeight={600} color="#ff9800">
                                    Complete Verification to Access All Payment Methods
                                </Typography>
                                <Tooltip title="Verification helps secure your account">
                                    <IconButton 
                                        size="small" 
                                        onClick={(e) => handleInfoClick(e, verificationInfoContent)}
                                        sx={{ 
                                            p: 0.5,
                                            color: "#ff9800",
                                            '&:hover': { 
                                                bgcolor: alpha("#ff9800", 0.2) 
                                            }
                                        }}
                                    >
                                        <InfoIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            
                            {/* Progress Bar */}
                            <Box sx={{ width: '100%', mt: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" color={textSecondary}>
                                        Verification Progress
                                    </Typography>
                                    <Typography variant="caption" fontWeight={600} color="#ff9800">
                                        {progress.completed}/{progress.total} Complete
                                    </Typography>
                                </Box>
                                <Box sx={{ 
                                    width: '100%', 
                                    height: 8, 
                                    bgcolor: alpha(COLORS.greyDark, 0.3), 
                                    borderRadius: 4,
                                    overflow: 'hidden'
                                }}>
                                    <Box sx={{ 
                                        width: `${progress.percentage}%`, 
                                        height: '100%', 
                                        bgcolor: progress.percentage === 100 ? "#4caf50" : "#ff9800",
                                        transition: 'width 0.5s ease'
                                    }} />
                                </Box>
                            </Box>

                            {/* Verification Items */}
                            <Stack spacing={1} sx={{ mt: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {isKycVerified ? (
                                        <CheckCircleIcon sx={{ color: "#4caf50" }} fontSize="small" />
                                    ) : (
                                        <LockIcon sx={{ color: "#ff9800" }} fontSize="small" />
                                    )}
                                    <Typography variant="body2" color={textPrimary}>
                                        KYC Verification: {isKycVerified ? 'Verified' : 'Pending'}
                                    </Typography>
                                    {!isKycVerified && (
                                        <Button 
                                            size="small" 
                                            variant="text" 
                                            component={Link}
                                            to="/verification/kyc"
                                            sx={{ 
                                                ml: 'auto', 
                                                fontSize: '0.75rem',
                                                color: "#ff9800",
                                                '&:hover': {
                                                    bgcolor: alpha("#ff9800", 0.2)
                                                }
                                            }}
                                        >
                                            Complete Now
                                        </Button>
                                    )}
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {isBankVerified ? (
                                        <CheckCircleIcon sx={{ color: "#4caf50" }} fontSize="small" />
                                    ) : (
                                        <LockIcon sx={{ color: "#ff9800" }} fontSize="small" />
                                    )}
                                    <Typography variant="body2" color={textPrimary}>
                                        Bank Verification: {isBankVerified ? 'Verified' : 'Pending'}
                                    </Typography>
                                    {!isBankVerified && (
                                        <Button 
                                            size="small" 
                                            variant="text" 
                                            component={Link}
                                            to="/verification/bank"
                                            sx={{ 
                                                ml: 'auto', 
                                                fontSize: '0.75rem',
                                                color: "#ff9800",
                                                '&:hover': {
                                                    bgcolor: alpha("#ff9800", 0.2)
                                                }
                                            }}
                                        >
                                            Complete Now
                                        </Button>
                                    )}
                                </Box>
                            </Stack>
                        </Stack>
                    </Alert>
                )}

                {/* Important Information - Compact Chips */}
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600} color={textSecondary}>
                            Important Information
                        </Typography>
                        <Tooltip title="Click for detailed information">
                            <IconButton 
                                size="small" 
                                onClick={(e) => handleInfoClick(e, depositInfoContent)}
                                sx={{ 
                                    color: "#42a5f5",
                                    p: 0.5,
                                    '&:hover': { 
                                        bgcolor: alpha("#42a5f5", 0.2) 
                                    }
                                }}
                            >
                                <InfoIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        <Chip
                            icon={<AttachMoneyIcon fontSize="small" />}
                            label="Min deposit varies"
                            size="small"
                            variant="outlined"
                            sx={{ 
                                fontSize: '0.75rem',
                                borderColor: alpha("#42a5f5", 0.4),
                                color: "#42a5f5",
                                bgcolor: alpha("#42a5f5", 0.15),
                            }}
                            onClick={(e) => handleInfoClick(e, "Minimum deposit amount varies by method. Check each method for specific limits.")}
                        />
                        <Chip
                            icon={<CheckCircleIcon fontSize="small" />}
                            label="Instant processing"
                            size="small"
                            variant="outlined"
                            sx={{ 
                                fontSize: '0.75rem',
                                borderColor: alpha("#4caf50", 0.4),
                                color: "#4caf50",
                                bgcolor: alpha("#4caf50", 0.15),
                            }}
                            onClick={(e) => handleInfoClick(e, "Most deposits are processed instantly. Some methods may take up to 24 hours.")}
                        />
                        <Chip
                            icon={<LockIcon fontSize="small" />}
                            label="Verification needed"
                            size="small"
                            variant="outlined"
                            sx={{ 
                                fontSize: '0.75rem',
                                borderColor: alpha("#ff9800", 0.4),
                                color: "#ff9800",
                                bgcolor: alpha("#ff9800", 0.15),
                            }}
                            onClick={(e) => handleInfoClick(e, "Some methods require additional verification. Complete KYC for full access.")}
                        />
                        <Chip
                            icon={<MoneyOffIcon fontSize="small" />}
                            label="No deposit fees"
                            size="small"
                            variant="outlined"
                            sx={{ 
                                fontSize: '0.75rem',
                                borderColor: alpha("#4caf50", 0.4),
                                color: "#4caf50",
                                bgcolor: alpha("#4caf50", 0.15),
                            }}
                            onClick={(e) => handleInfoClick(e, "No deposit fees from our side. Your payment provider may charge fees.")}
                        />
                    </Stack>
                </Box>

                {/* Available Methods */}
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="h6" fontWeight={600} color={textPrimary}>
                            Available Deposit Methods ({availableMethods.length})
                        </Typography>
                        <Tooltip title="Methods available based on your verification status">
                            <IconButton 
                                size="small" 
                                onClick={(e) => handleInfoClick(e, availableMethodsInfoContent)}
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
                    <Grid container spacing={3}>
                        {availableMethods.map((item, i) => (
                            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                                <Card
                                    component={Link}
                                    to={item.to}
                                    sx={{
                                        p: 3,
                                        borderRadius: 2,
                                        border: `1px solid ${borderColor}`,
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        backgroundColor: cardBgColor, // Dark card background
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                        '&:hover': {
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                            borderColor: COLORS.accentGold,
                                            transform: 'translateY(-4px)',
                                            '& .arrow-icon': {
                                                transform: 'translateX(4px)',
                                            }
                                        }
                                    }}
                                >
                                    {/* Method Header */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Box
                                                sx={{
                                                    width: 48,
                                                    height: 48,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: 2,
                                                    bgcolor: alpha(COLORS.accentGold, 0.2)
                                                }}
                                            >
                                                <img 
                                                    src={item.img} 
                                                    alt={item.methodName} 
                                                    style={{ width: 32, height: 32, objectFit: 'contain' }}
                                                />
                                            </Box>
                                            <Box>
                                                <Typography fontWeight={700} variant="h6" color={textPrimary}>
                                                    {item.methodName}
                                                </Typography>
                                                {item.specification && (
                                                    <Chip
                                                        label={item.specification}
                                                        size="small"
                                                        sx={{ 
                                                            mt: 0.5, 
                                                            fontSize: '0.7rem', 
                                                            height: 20,
                                                            bgcolor: alpha(COLORS.accentGold, 0.25),
                                                            color: COLORS.accentGold,
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        </Stack>
                                        
                                        <ArrowForwardIcon 
                                            className="arrow-icon"
                                            sx={{ 
                                                color: COLORS.accentGold,
                                                transition: 'transform 0.3s ease',
                                                opacity: 0.7 
                                            }}
                                        />
                                    </Box>

                                    {/* Method Details */}
                                    <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
                                        {Object.entries(item?.details).map(([key, value], idx) => (
                                            <Box 
                                                key={idx} 
                                                sx={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    py: 0.5
                                                }}
                                            >
                                                <Typography variant="body2" color={textSecondary}>
                                                    {key}
                                                </Typography>
                                                <Typography variant="body2" fontWeight={600} color={COLORS.accentGold}>
                                                    {value}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>

                                    {/* Action Button */}
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{ 
                                            mt: 2, 
                                            borderRadius: 1,
                                            bgcolor: COLORS.accentGold,
                                            color: COLORS.whiteMain,
                                            '&:hover': {
                                                bgcolor: alpha(COLORS.accentGold, 0.8),
                                            }
                                        }}
                                    >
                                        Deposit with {item.methodName}
                                    </Button>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* Unavailable Methods (Collapsible) */}
                {unavailableMethods.length > 0 && (
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Typography variant="h6" fontWeight={600} color={textSecondary}>
                                Unavailable Methods ({unavailableMethods.length})
                            </Typography>
                            <Tooltip title="Complete verification to unlock these methods">
                                <IconButton 
                                    size="small" 
                                    onClick={(e) => handleInfoClick(e, unavailableMethodsInfoContent)}
                                    sx={{ 
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
                        <Alert 
                            severity="info"
                            sx={{ 
                                borderRadius: 2,
                                bgcolor: infoCardBg,
                                border: `1px solid ${infoCardBorder}`,
                                color: "#42a5f5",
                            }}
                        >
                            Complete verification to unlock these deposit methods
                        </Alert>
                        
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            {unavailableMethods.map((item, i) => (
                                <Grid key={i} size={{ xs: 12, sm: 6 }}>
                                    <Paper 
                                        sx={{ 
                                            p: 2, 
                                            borderRadius: 2,
                                            border: `1px solid ${borderColor}`,
                                            bgcolor: unavailableBg,
                                            opacity: 0.8,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                opacity: 0.9,
                                                borderColor: alpha(COLORS.greyMedium, 0.3),
                                            }
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: 1,
                                                bgcolor: alpha(COLORS.greyDark, 0.3)
                                            }}
                                        >
                                            <img 
                                                src={item.img} 
                                                alt={item.methodName} 
                                                style={{ width: 24, height: 24, objectFit: 'contain' }}
                                            />
                                        </Box>
                                        <Box>
                                            <Typography fontWeight={600} color={textSecondary}>
                                                {item.methodName}
                                            </Typography>
                                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                                <LockIcon fontSize="small" sx={{ color: COLORS.greyMedium }} />
                                                <Typography variant="caption" color={textSecondary}>
                                                    {item.requiresKYC && !isKycVerified ? 'Requires KYC Verification' : ''}
                                                    {item.requiresBankVerification && !isBankVerified ? 'Requires Bank Verification' : ''}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {/* Need Help Section */}
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 3, 
                        borderRadius: 2,
                        bgcolor: helpSectionBg,
                        border: `1px solid ${borderColor}`,
                        textAlign: 'center'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="body1" fontWeight={500} color={textPrimary}>
                            Need help choosing a deposit method?
                        </Typography>
                        <Tooltip title="Get assistance with deposit methods">
                            <IconButton 
                                size="small" 
                                onClick={(e) => handleInfoClick(e, "Contact our 24/7 support team for help with:\n• Choosing the right deposit method\n• Troubleshooting deposit issues\n• Understanding deposit limits\n• Verification assistance")}
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
                    <Typography variant="body2" color={textSecondary} sx={{ mb: 2 }}>
                        Our support team is available 24/7 to assist you
                    </Typography>
                    <Button 
                        variant="outlined" 
                        component={Link}
                        to="/client/helpDesk/newTicket"
                        sx={{
                            borderColor: alpha(COLORS.accentGold, 0.4),
                            color: COLORS.accentGold,
                            '&:hover': {
                                borderColor: COLORS.accentGold,
                                bgcolor: alpha(COLORS.accentGold, 0.15)
                            }
                        }}
                    >
                        Get Help with Deposits
                    </Button>
                </Paper>

                {/* Stats Section */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: alpha(COLORS.accentGold, 0.1),
                        border: `1px solid ${alpha(COLORS.accentGold, 0.2)}`,
                        backgroundImage: gradientBg,
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <Box sx={{ textAlign: 'center', p: 1 }}>
                                <Typography variant="h6" fontWeight={700} color={COLORS.accentGold}>
                                    {availableMethods.length}
                                </Typography>
                                <Typography variant="caption" color={textSecondary}>
                                    Available Methods
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <Box sx={{ textAlign: 'center', p: 1 }}>
                                <Typography variant="h6" fontWeight={700} color={COLORS.accentGold}>
                                    {isKycVerified ? '✓' : '—'}
                                </Typography>
                                <Typography variant="caption" color={textSecondary}>
                                    KYC Verified
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <Box sx={{ textAlign: 'center', p: 1 }}>
                                <Typography variant="h6" fontWeight={700} color={COLORS.accentGold}>
                                    {isBankVerified ? '✓' : '—'}
                                </Typography>
                                <Typography variant="caption" color={textSecondary}>
                                    Bank Verified
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                            <Box sx={{ textAlign: 'center', p: 1 }}>
                                <Typography variant="h6" fontWeight={700} color={COLORS.accentGold}>
                                    {Math.round(progress.percentage)}%
                                </Typography>
                                <Typography variant="caption" color={textSecondary}>
                                    Verification Complete
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Stack>
        </Box>
    )
}

export default DepositMethods;