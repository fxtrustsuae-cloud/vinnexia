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
import { transferWithdrawalMethodsData } from './transferWithdrawalMethodsData';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetUserDataQuery } from '../../../globalState/userState/userStateApis';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import WarningIcon from '@mui/icons-material/Warning';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import SecurityIcon from '@mui/icons-material/Security';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';

function TransferWithdrawalMethods() {
    const theme = useTheme();
    const { token } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const isKycVerified = !isLoading && data?.data?.userData?.isKycVerified;
    const isDesktop = useMediaQuery('(min-width:768px)');
    const isTablet = useMediaQuery('(min-width:600px)');
    
    // State for popover
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverContent, setPopoverContent] = useState('');

    // Filter methods based on verification status
    const getAvailableMethods = () => {
        return transferWithdrawalMethodsData.filter(method => {
            if (method.requiresKYC && !isKycVerified) return false;
            return true;
        });
    };

    const availableMethods = getAvailableMethods();
    const unavailableMethods = transferWithdrawalMethodsData.filter(m => !availableMethods.includes(m));

    // Popover handlers
    const handleInfoClick = (event, content) => {
        setAnchorEl(event.currentTarget);
        setPopoverContent(content);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const popoverId = open ? 'transfer-info-popover' : undefined;

    // Content for header info popup
    const headerInfoContent = `
        • Transfer funds between your accounts securely
        • All internal transfers are processed instantly
        • No fees for internal account transfers
        • Available 24/7 for your convenience
    `;

    // Content for verification info
    const verificationInfoContent = `
        Complete KYC verification to access all internal transfer options.
        This helps us ensure account security and prevent unauthorized transfers.
        
        KYC Verification: Verify your identity with government-issued ID
    `;

    // Content for available methods info
    const availableMethodsInfoContent = `
        These internal transfer methods are available based on your verification level.
        
        • Basic KYC verification required for all internal transfers
        • Some transfers may have daily limits
        • All transfers are processed instantly
    `;

    // Content for transfer info chips
    const transferInfoContent = `
        • All internal transfers are processed instantly
        • No transfer fees for internal transactions
        • Available 24/7 for your convenience
        • Ensure you have sufficient balance before transferring
        • Some transfers may require additional verification
    `;

    // Theme-aware colors
    const borderColor = theme.palette.mode === 'dark' 
        ? alpha(theme.palette.divider, 0.1)
        : theme.palette.divider;

    const cardBgColor = theme.palette.mode === 'dark'
        ? alpha(theme.palette.background.paper, 0.8)
        : theme.palette.background.paper;

    const infoCardBg = theme.palette.mode === 'dark'
        ? alpha(theme.palette.info.dark, 0.15)
        : alpha(theme.palette.info.light, 0.08);

    const infoCardBorder = theme.palette.mode === 'dark'
        ? alpha(theme.palette.info.main, 0.3)
        : alpha(theme.palette.info.main, 0.2);

    const helpSectionBg = theme.palette.mode === 'dark'
        ? alpha(theme.palette.grey[900], 0.5)
        : alpha(theme.palette.grey[100], 0.5);

    const unavailableBg = theme.palette.mode === 'dark'
        ? alpha(theme.palette.grey[900], 0.3)
        : alpha('#000', 0.02);

    const gradientBg = theme.palette.mode === 'dark'
        ? `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.2)} 0%, ${alpha(theme.palette.secondary.dark, 0.1)} 100%)`
        : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`;

    return (
        <Stack spacing={3}>
            {/* Welcome Header with Info Icon */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <SwapHorizIcon sx={{ 
                            fontSize: '2.5rem', 
                            color: 'primary.main',
                            filter: theme.palette.mode === 'dark' ? 'brightness(1.1)' : 'none'
                        }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography 
                                variant="h4" 
                                sx={{ 
                                    fontWeight: 700,
                                    background: theme.palette.mode === 'dark'
                                        ? `linear-gradient(45deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`
                                        : `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textShadow: theme.palette.mode === 'dark' 
                                        ? `0 2px 8px ${alpha(theme.palette.primary.main, 0.3)}`
                                        : 'none'
                                }}
                            >
                                Internal Transfer
                            </Typography>
                            <Tooltip title="More information about internal transfers">
                                <IconButton 
                                    size="small" 
                                    onClick={(e) => handleInfoClick(e, headerInfoContent)}
                                    sx={{ 
                                        color: 'primary.main',
                                        '&:hover': { 
                                            bgcolor: alpha(theme.palette.primary.main, 0.1) 
                                        }
                                    }}
                                >
                                    <InfoIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>
                    <Typography variant='body1' color="text.secondary">
                        Transfer funds between your accounts securely and instantly
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
                        boxShadow: theme.palette.mode === 'dark'
                            ? '0 8px 32px rgba(0,0,0,0.4)'
                            : '0 8px 32px rgba(0,0,0,0.1)',
                        border: `1px solid ${borderColor}`,
                        bgcolor: theme.palette.background.paper,
                        backgroundImage: theme.palette.mode === 'dark'
                            ? 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
                            : 'none',
                    }
                }}
            >
                <Stack spacing={1}>
                    <Typography variant="subtitle2" fontWeight={600} color="primary">
                        Internal Transfer Information
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                        {popoverContent}
                    </Typography>
                </Stack>
            </Popover>

            {/* Verification Alert */}
            {!isKycVerified && (
                <Alert 
                    severity="warning" 
                    icon={<WarningIcon />}
                    sx={{ 
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                        '& .MuiAlert-message': { width: '100%' },
                        bgcolor: alpha(theme.palette.warning.main, 0.05),
                    }}
                >
                    <Stack spacing={1}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle2" fontWeight={600} color={theme.palette.mode === 'dark' ? 'warning.light' : 'warning.dark'}>
                                KYC Verification Required
                            </Typography>
                            <Tooltip title="Verification information">
                                <IconButton 
                                    size="small" 
                                    onClick={(e) => handleInfoClick(e, verificationInfoContent)}
                                    sx={{ 
                                        p: 0.5,
                                        color: 'warning.main',
                                        '&:hover': { 
                                            bgcolor: alpha(theme.palette.warning.main, 0.1) 
                                        }
                                    }}
                                >
                                    <InfoIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Typography variant="body2" color="text.primary">
                            Complete KYC verification to access all internal transfer methods.
                        </Typography>
                        <Button 
                            variant="outlined" 
                            color="warning"
                            component={Link}
                            to="/verification/kyc"
                            size="small"
                            sx={{ 
                                alignSelf: 'flex-start', 
                                mt: 1,
                                borderColor: theme.palette.mode === 'dark' 
                                    ? alpha(theme.palette.warning.main, 0.5)
                                    : 'warning.main',
                                color: 'warning.main',
                                '&:hover': {
                                    borderColor: 'warning.main',
                                    bgcolor: alpha(theme.palette.warning.main, 0.05)
                                }
                            }}
                        >
                            Complete KYC Verification
                        </Button>
                    </Stack>
                </Alert>
            )}

            {/* Important Information - Compact Chips */}
            <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                        Important Information
                    </Typography>
                    <Tooltip title="Click for detailed information">
                        <IconButton 
                            size="small" 
                            onClick={(e) => handleInfoClick(e, transferInfoContent)}
                            sx={{ 
                                color: 'info.main',
                                p: 0.5,
                                '&:hover': { 
                                    bgcolor: alpha(theme.palette.info.main, 0.1) 
                                }
                            }}
                        >
                            <InfoIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    <Chip
                        icon={<AccessTimeIcon fontSize="small" />}
                        label="Instant processing"
                        size="small"
                        variant="outlined"
                        color="success"
                        sx={{ 
                            fontSize: '0.75rem',
                            borderColor: theme.palette.mode === 'dark' ? alpha(theme.palette.success.main, 0.3) : undefined,
                            color: theme.palette.mode === 'dark' ? 'success.light' : undefined,
                        }}
                        onClick={(e) => handleInfoClick(e, "All internal transfers are processed instantly, 24/7.")}
                    />
                    <Chip
                        icon={<MoneyOffIcon fontSize="small" />}
                        label="No fees"
                        size="small"
                        variant="outlined"
                        color="success"
                        sx={{ 
                            fontSize: '0.75rem',
                            borderColor: theme.palette.mode === 'dark' ? alpha(theme.palette.success.main, 0.3) : undefined,
                            color: theme.palette.mode === 'dark' ? 'success.light' : undefined,
                        }}
                        onClick={(e) => handleInfoClick(e, "No transfer fees for internal transactions between your accounts.")}
                    />
                    <Chip
                        icon={<SecurityIcon fontSize="small" />}
                        label="Secure"
                        size="small"
                        variant="outlined"
                        color="success"
                        sx={{ 
                            fontSize: '0.75rem',
                            borderColor: theme.palette.mode === 'dark' ? alpha(theme.palette.success.main, 0.3) : undefined,
                            color: theme.palette.mode === 'dark' ? 'success.light' : undefined,
                        }}
                        onClick={(e) => handleInfoClick(e, "All transfers are encrypted and secured with multiple verification layers.")}
                    />
                    <Chip
                        icon={<AccountBalanceWalletIcon fontSize="small" />}
                        label="24/7 Available"
                        size="small"
                        variant="outlined"
                        color="info"
                        sx={{ 
                            fontSize: '0.75rem',
                            borderColor: theme.palette.mode === 'dark' ? alpha(theme.palette.info.main, 0.3) : undefined,
                            color: theme.palette.mode === 'dark' ? 'info.light' : undefined,
                        }}
                        onClick={(e) => handleInfoClick(e, "Internal transfers are available 24/7, including weekends and holidays.")}
                    />
                </Stack>
            </Box>

            {/* Available Methods */}
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Typography variant="h6" fontWeight={600} color="text.primary">
                        Available Transfer Methods ({availableMethods.length})
                    </Typography>
                    <Tooltip title="Transfer methods available">
                        <IconButton 
                            size="small" 
                            onClick={(e) => handleInfoClick(e, availableMethodsInfoContent)}
                            sx={{ 
                                color: 'primary.main',
                                '&:hover': { 
                                    bgcolor: alpha(theme.palette.primary.main, 0.1) 
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
                                    backgroundColor: cardBgColor,
                                    boxShadow: theme.palette.mode === 'dark'
                                        ? '0 4px 20px rgba(0,0,0,0.2)'
                                        : '0 4px 20px rgba(0,0,0,0.05)',
                                    '&:hover': {
                                        boxShadow: theme.palette.mode === 'dark'
                                            ? '0 8px 32px rgba(0,0,0,0.3)'
                                            : '0 8px 32px rgba(0,0,0,0.1)',
                                        borderColor: 'primary.main',
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
                                                bgcolor: alpha(theme.palette.primary.main, 0.1)
                                            }}
                                        >
                                            <img 
                                                src={item.img} 
                                                alt={item.methodName} 
                                                style={{ width: 32, height: 32, objectFit: 'contain' }}
                                            />
                                        </Box>
                                        <Box>
                                            <Typography fontWeight={700} variant="h6" color="text.primary">
                                                {item.methodName}
                                            </Typography>
                                            {item.specification && (
                                                <Chip
                                                    label={item.specification}
                                                    size="small"
                                                    color="primary"
                                                    variant="filled"
                                                    sx={{ 
                                                        mt: 0.5, 
                                                        fontSize: '0.7rem', 
                                                        height: 20,
                                                        bgcolor: theme.palette.mode === 'dark' 
                                                            ? alpha(theme.palette.primary.main, 0.2)
                                                            : undefined
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </Stack>
                                    
                                    <ArrowForwardIcon 
                                        className="arrow-icon"
                                        color="primary"
                                        sx={{ 
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
                                            <Typography variant="body2" color="text.secondary">
                                                {key}
                                            </Typography>
                                            <Typography variant="body2" fontWeight={600} color="primary.main">
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
                                        bgcolor: theme.palette.mode === 'dark' 
                                            ? alpha(theme.palette.primary.main, 0.9)
                                            : undefined,
                                        '&:hover': {
                                            bgcolor: theme.palette.mode === 'dark' 
                                                ? alpha(theme.palette.primary.main, 1)
                                                : undefined,
                                        }
                                    }}
                                >
                                    Transfer {item.methodName}
                                </Button>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Unavailable Methods */}
            {unavailableMethods.length > 0 && (
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography variant="h6" fontWeight={600} color="text.secondary">
                            Unavailable Methods ({unavailableMethods.length})
                        </Typography>
                        <Tooltip title="Complete verification to unlock these methods">
                            <IconButton 
                                size="small" 
                                onClick={(e) => handleInfoClick(e, "These transfer methods require KYC verification. Complete verification to access them.")}
                                sx={{ 
                                    color: 'info.main',
                                    '&:hover': { 
                                        bgcolor: alpha(theme.palette.info.main, 0.1) 
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
                            color: theme.palette.mode === 'dark' ? 'info.light' : 'info.dark',
                        }}
                    >
                        Complete KYC verification to unlock these transfer methods
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
                                        opacity: 0.7,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 2,
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            opacity: 0.9,
                                            borderColor: theme.palette.divider,
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
                                            bgcolor: theme.palette.mode === 'dark'
                                                ? alpha(theme.palette.grey[800], 0.5)
                                                : alpha('#000', 0.05)
                                        }}
                                    >
                                        <img 
                                            src={item.img} 
                                            alt={item.methodName} 
                                            style={{ width: 24, height: 24, objectFit: 'contain' }}
                                        />
                                    </Box>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography fontWeight={600} color="text.secondary">
                                            {item.methodName}
                                        </Typography>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                            <LockIcon fontSize="small" color="action" />
                                            <Typography variant="caption" color="text.secondary">
                                                Requires KYC Verification
                                            </Typography>
                                        </Stack>
                                    </Box>
                                    <IconButton 
                                        size="small" 
                                        component={Link}
                                        to="/verification/kyc"
                                        sx={{ 
                                            color: 'primary.main',
                                            '&:hover': { 
                                                bgcolor: alpha(theme.palette.primary.main, 0.1) 
                                            }
                                        }}
                                    >
                                        <ArrowForwardIcon fontSize="small" />
                                    </IconButton>
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
                    <Typography variant="body1" fontWeight={500} color="text.primary">
                        Need help with internal transfers?
                    </Typography>
                    <Tooltip title="Get assistance with internal transfers">
                        <IconButton 
                            size="small" 
                            onClick={(e) => handleInfoClick(e, "Contact our 24/7 support team for help with:\n• Transferring between accounts\n• Troubleshooting transfer issues\n• Understanding transfer limits\n• Verification assistance\n• Account linking questions")}
                            sx={{ 
                                color: 'primary.main',
                                '&:hover': { 
                                    bgcolor: alpha(theme.palette.primary.main, 0.1) 
                                }
                            }}
                        >
                            <InfoIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Our support team is available 24/7 to assist you with internal transfer queries
                </Typography>
                <Button 
                    variant="outlined" 
                    component={Link}
                    to="/support/internal-transfer-help"
                    sx={{
                        borderColor: theme.palette.mode === 'dark' 
                            ? alpha(theme.palette.primary.main, 0.5)
                            : 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: alpha(theme.palette.primary.main, 0.05)
                        }
                    }}
                >
                    Get Transfer Support
                </Button>
            </Paper>

            {/* Transfer Stats Section */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.03),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    backgroundImage: theme.palette.mode === 'dark' ? gradientBg : 'none',
                }}
            >
                <Grid container spacing={2}>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                            <Typography variant="h6" fontWeight={700} color="primary.main">
                                {availableMethods.length}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Available Methods
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                            <Typography variant="h6" fontWeight={700} color="primary.main">
                                {isKycVerified ? '✓' : '—'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                KYC Verified
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                            <Typography variant="h6" fontWeight={700} color="primary.main">
                                Instant
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Processing
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Box sx={{ textAlign: 'center', p: 1 }}>
                            <Typography variant="h6" fontWeight={700} color="primary.main">
                                $0
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Transfer Fees
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Stack>
    )
}

export default TransferWithdrawalMethods;