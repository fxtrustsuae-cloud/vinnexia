import {
    Stack,
    Typography,
    Box,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    Chip,
    alpha,
    IconButton,
    Snackbar,
    Alert,
    Button
} from "@mui/material";
import Grid from '@mui/material/Grid2';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MailIcon from '@mui/icons-material/Mail';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import SecurityIcon from '@mui/icons-material/Security';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState } from 'react';

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

const BRAND_EMAIL = import.meta.env.VITE_BRAND_EMAIL;

function BankDepositDetails() {
    const [copyAlert, setCopyAlert] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const instructions = [
        {
            text: "Deposit funds into the provided account and upload the deposit proof. MUST mention the Transaction ID.",
            icon: <CheckCircleIcon />,
            color: "success"
        },
        {
            text: `In case if you need support please mail to: ${BRAND_EMAIL}`,
            icon: <MailIcon />,
            color: "info"
        },
        {
            text: "Note: 1 USD = 3.67 AED",
            icon: <CurrencyExchangeIcon />,
            color: "warning"
        },
        {
            text: "Do not use Cash Deposit in this bank account. Violation will not get verified.",
            icon: <WarningIcon />,
            color: "error"
        },
        {
            text: "Deposit Confirmation time is 30 Minutes in Working Hours.",
            icon: <ScheduleIcon />,
            color: "info"
        }
    ];

    const bankDetails = [
        { 
            label: "Account Name", 
            value: "FLEXY COMMERCIAL BROKER LLC",
            copyable: true 
        },
        { 
            label: "Account No.", 
            value: "019101640913",
            copyable: true 
        },
        { 
            label: "IBAN Number", 
            value: "AE780330000019101640913",
            copyable: true 
        },
        { 
            label: "SWIFT Code", 
            value: "BOMLAEAD",
            copyable: true 
        },
        { 
            label: "Bank Name", 
            value: "Mashreq Bank",
            copyable: true 
        },
        { 
            label: "Bank Address", 
            value: "Mashreq Bank PSC, P.O.Box 1250, Dubai, UAE",
            copyable: true 
        }
    ];

    const handleCopy = (text, label) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopyAlert({
                open: true,
                message: `${label} copied to clipboard!`,
                severity: 'success'
            });
        }).catch(err => {
            setCopyAlert({
                open: true,
                message: 'Failed to copy. Please try again.',
                severity: 'error'
            });
        });
    };

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(BRAND_EMAIL).then(() => {
            setCopyAlert({
                open: true,
                message: 'Email copied to clipboard!',
                severity: 'success'
            });
        });
    };

    const handleCloseAlert = () => {
        setCopyAlert({ ...copyAlert, open: false });
    };

    return (
        <Stack spacing={2}>
            {/* Copy Success Alert */}
            <Snackbar 
                open={copyAlert.open} 
                autoHideDuration={3000} 
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseAlert} 
                    severity={copyAlert.severity}
                    sx={{ 
                        width: '100%',
                        backgroundColor: copyAlert.severity === 'success' 
                            ? alpha(COLORS.success, 0.1) 
                            : alpha(COLORS.error, 0.1),
                        color: COLORS.textPrimary,
                        border: `1px solid ${
                            copyAlert.severity === 'success' 
                                ? alpha(COLORS.success, 0.3) 
                                : alpha(COLORS.error, 0.3)
                        }`,
                    }}
                >
                    {copyAlert.message}
                </Alert>
            </Snackbar>

            {/* Important Instructions */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${COLORS.border}`,
                    backgroundColor: alpha(COLORS.paper, 0.8),
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
                    <Box sx={{ 
                        p: 0.75,
                        borderRadius: 1,
                        backgroundColor: alpha(COLORS.primary, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <SecurityIcon sx={{ 
                            color: COLORS.primary,
                            fontSize: '1.25rem'
                        }} />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={600} color={COLORS.textPrimary}>
                        Important Instructions
                    </Typography>
                </Stack>
                
                <List disablePadding>
                    {instructions.map((item, index) => (
                        <ListItem
                            key={index}
                            sx={{
                                px: 0,
                                py: 1.5,
                                borderBottom: index !== instructions.length - 1 ? 
                                    `1px dashed ${alpha(COLORS.border, 0.5)}` : 'none',
                                alignItems: 'flex-start',
                                '&:hover': {
                                    backgroundColor: alpha(COLORS.background, 0.05),
                                    borderRadius: 1,
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 36, mt: 0.25 }}>
                                <Box sx={{ 
                                    color: item.color === 'success' ? COLORS.success :
                                           item.color === 'info' ? COLORS.info :
                                           item.color === 'warning' ? COLORS.warning :
                                           item.color === 'error' ? COLORS.error : COLORS.primary,
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: alpha(
                                        item.color === 'success' ? COLORS.success :
                                        item.color === 'info' ? COLORS.info :
                                        item.color === 'warning' ? COLORS.warning :
                                        item.color === 'error' ? COLORS.error : COLORS.primary, 
                                        0.1
                                    ),
                                    p: 0.5,
                                    borderRadius: '50%'
                                }}>
                                    {item.icon}
                                </Box>
                            </ListItemIcon>
                            <Typography 
                                variant="body2" 
                                fontSize="0.875rem"
                                color={COLORS.textPrimary}
                                sx={{ lineHeight: 1.5 }}
                            >
                                {item.text}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            </Paper>

            {/* Bank Details - COMPACT */}
            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    borderRadius: 2,
                    border: `1px solid ${COLORS.border}`,
                    backgroundColor: alpha(COLORS.paper, 0.8),
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
                    <Box sx={{ 
                        p: 0.75,
                        borderRadius: 1,
                        backgroundColor: alpha(COLORS.primary, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <AccountBalanceIcon sx={{ 
                            color: COLORS.primary,
                            fontSize: '1.25rem'
                        }} />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={600} color={COLORS.textPrimary}>
                        AED Bank Details
                    </Typography>
                    <Chip 
                        label="UAE Account" 
                        size="small" 
                        sx={{ 
                            height: 24,
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            backgroundColor: alpha(COLORS.primary, 0.1),
                            color: COLORS.primary,
                            border: `1px solid ${alpha(COLORS.primary, 0.3)}`,
                        }}
                    />
                </Stack>

                <Grid container spacing={1}>
                    {bankDetails.map((detail, index) => (
                        <Grid key={index} size={{ xs: 12 }}>
                            <Box sx={{ 
                                p: 1.5,
                                borderRadius: 1,
                                backgroundColor: index % 2 === 0 ? 
                                    alpha(COLORS.background, 0.3) : 
                                    'transparent',
                                border: `1px solid ${alpha(COLORS.border, 0.3)}`,
                                '&:hover': {
                                    backgroundColor: alpha(COLORS.primary, 0.05),
                                    borderColor: alpha(COLORS.primary, 0.5),
                                }
                            }}>
                                <Grid container spacing={1.5} alignItems="center">
                                    <Grid size={{ xs: 12, sm: 4 }}>
                                        <Typography 
                                            variant="caption" 
                                            color={COLORS.textSecondary}
                                            sx={{ 
                                                fontWeight: 500, 
                                                fontSize: '0.75rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}
                                        >
                                            {detail.label}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 8 }}>
                                        <Box sx={{ 
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1
                                        }}>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    fontWeight: 500,
                                                    color: COLORS.textPrimary,
                                                    wordBreak: 'break-all',
                                                    fontSize: '0.875rem',
                                                    lineHeight: 1.4,
                                                    fontFamily: 'monospace',
                                                    letterSpacing: '0.5px'
                                                }}
                                            >
                                                {detail.value}
                                            </Typography>
                                            {detail.copyable && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleCopy(detail.value, detail.label)}
                                                    sx={{
                                                        color: COLORS.primary,
                                                        padding: 0.5,
                                                        backgroundColor: alpha(COLORS.primary, 0.1),
                                                        '&:hover': {
                                                            backgroundColor: alpha(COLORS.primary, 0.2)
                                                        },
                                                        flexShrink: 0,
                                                        border: `1px solid ${alpha(COLORS.primary, 0.3)}`
                                                    }}
                                                >
                                                    <ContentCopyIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                {/* Copy All Button */}
                <Box sx={{ mt: 2.5, textAlign: 'center' }}>
                    <Button
                        variant="outlined"
                        size="medium"
                        startIcon={<ContentCopyIcon />}
                        onClick={() => {
                            const allDetails = bankDetails
                                .map(detail => `${detail.label}: ${detail.value}`)
                                .join('\n');
                            handleCopy(allDetails, 'All bank details');
                        }}
                        sx={{
                            textTransform: 'none',
                            borderRadius: 1,
                            py: 1,
                            px: 2.5,
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            borderColor: COLORS.primary,
                            color: COLORS.primary,
                            backgroundColor: alpha(COLORS.primary, 0.1),
                            '&:hover': {
                                borderColor: COLORS.primaryDark,
                                backgroundColor: alpha(COLORS.primary, 0.2),
                            }
                        }}
                    >
                        Copy All Details
                    </Button>
                </Box>

                {/* Important Note */}
                <Box
                    sx={{
                        mt: 3,
                        p: 2,
                        borderRadius: 1,
                        backgroundColor: alpha(COLORS.warning, 0.08),
                        border: `1px solid ${alpha(COLORS.warning, 0.2)}`
                    }}
                >
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <Box sx={{ 
                            p: 0.5,
                            borderRadius: '50%',
                            backgroundColor: alpha(COLORS.warning, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mt: 0.25
                        }}>
                            <WarningIcon sx={{ 
                                color: COLORS.warning,
                                fontSize: '1rem'
                            }} />
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} color={COLORS.warning}>
                                Important Note:
                            </Typography>
                            <Typography 
                                variant="body2" 
                                color={COLORS.textSecondary}
                                sx={{ mt: 0.5, lineHeight: 1.5 }}
                            >
                                Clients from India, please deposit to the specific Indian bank account provided separately.
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            </Paper>

            {/* Contact Support */}
            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    borderRadius: 2,
                    border: `1px solid ${alpha(COLORS.info, 0.3)}`,
                    backgroundColor: alpha(COLORS.info, 0.08),
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
            >
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Box sx={{ 
                        p: 0.75,
                        borderRadius: 1,
                        backgroundColor: alpha(COLORS.info, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <MailIcon sx={{ 
                            color: COLORS.info,
                            fontSize: '1.25rem'
                        }} />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600} color={COLORS.textPrimary} gutterBottom>
                            Need Support?
                        </Typography>
                        <Typography variant="body2" color={COLORS.textSecondary} sx={{ mb: 1.5, lineHeight: 1.5 }}>
                            Contact our support team for any assistance with your deposit
                        </Typography>
                        <Box sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5
                        }}>
                            <Box sx={{ 
                                flex: 1,
                                p: 1.5,
                                borderRadius: 1,
                                backgroundColor: alpha(COLORS.background, 0.5),
                                border: `1px solid ${COLORS.border}`,
                                minHeight: '48px',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <Typography 
                                    variant="body2" 
                                    fontWeight={500}
                                    sx={{ 
                                        color: COLORS.info,
                                        wordBreak: 'break-all',
                                        fontSize: '0.875rem',
                                        fontFamily: 'monospace'
                                    }}
                                >
                                    {BRAND_EMAIL}
                                </Typography>
                            </Box>
                            <IconButton
                                size="medium"
                                onClick={handleCopyEmail}
                                sx={{
                                    color: COLORS.info,
                                    padding: 1,
                                    backgroundColor: alpha(COLORS.info, 0.1),
                                    '&:hover': {
                                        backgroundColor: alpha(COLORS.info, 0.2)
                                    },
                                    border: `1px solid ${alpha(COLORS.info, 0.3)}`
                                }}
                            >
                                <ContentCopyIcon fontSize="medium" />
                            </IconButton>
                        </Box>
                    </Box>
                </Stack>
            </Paper>
        </Stack>
    );
}

export default BankDepositDetails;