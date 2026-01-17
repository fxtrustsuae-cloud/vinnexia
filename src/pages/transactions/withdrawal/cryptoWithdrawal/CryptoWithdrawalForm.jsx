import { 
    Button, 
    Stack, 
    Typography, 
    TextField, 
    InputLabel, 
    Box, 
    Paper,
    alpha,
    CircularProgress,
    Alert,
    Divider,
    Container,
    Grid,
    Card,
    Chip,
    IconButton,
    Tooltip,
    Popover,
    useMediaQuery,
    InputAdornment,
    OutlinedInput
} from '@mui/material'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../../../../globalState/notificationState/notificationStateSlice';
import { useCryptoWithdrawMutation } from '../../../../globalState/userState/userStateApis';
import { cryptoWithdrawalSchema } from './cryptoWithdrawalSchema';
import { useGetUserDataQuery } from '../../../../globalState/userState/userStateApis';
import { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SecurityIcon from '@mui/icons-material/Security';
import GppGoodIcon from '@mui/icons-material/GppGood';
import Selector from "../../../../components/Selector"

// Color palette
const COLORS = {
  accentGold: "#7E6233",
  whiteMain: "#FEFEFE",
  blackDark: "#11191E",
  greyLight: "#CACDCC",
  greyMedium: "#B3B6B6",
  greyDark: "#848F94",
  darkBg: "#1a1f24",
};

const networks = [
    {
        image: "/transactionIcons/USDT_TRC20.svg",
        name: "TRON"
    },
]

function CryptoWithdrawalForm() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const isMobile = useMediaQuery('(max-width:600px)');
    
    // State for popover
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverContent, setPopoverContent] = useState('');

    const amountParam = searchParams.get("amount");
    const walletAddressParam = searchParams.get("walletAddress");
    const networkParam = searchParams.get("network");
    const isAmountAndRemarkSubmittedParam = searchParams.get("isAmountAndRemarkSubmitted") || false;

    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const { refetch, data } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    });

    const securityMethod = data?.data?.userData?.securityMethods;

    const schema = useMemo(
        () => cryptoWithdrawalSchema({ securityMethod, isAmountAndRemarkSubmittedParam }),
        [securityMethod, isAmountAndRemarkSubmittedParam]
    );

    const defaultValues = {
        network: networkParam || "",
        walletAddress: walletAddressParam || "",
        amount: amountParam || "",
        password: "",
    };

    const { 
        register, 
        handleSubmit, 
        reset, 
        watch, 
        setValue, 
        formState: { errors, isValid } 
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues,
        mode: 'onChange'
    });

    const [cryptoWithdraw, { isLoading, isError, error }] = useCryptoWithdrawMutation();

    // Popover handlers
    const handleInfoClick = (event, content) => {
        setAnchorEl(event.currentTarget);
        setPopoverContent(content);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const popoverId = open ? 'crypto-withdrawal-info-popover' : undefined;

    // Content for info popups
    const headerInfoContent = `• Crypto withdrawals are processed within 30 minutes
• Network confirmation required (approx 5-20 min)
• Ensure correct wallet address and network
• Transaction fees apply based on network`;

    const networkInfoContent = `• Select the cryptocurrency network
• Currently supported: TRON (USDT-TRC20)
• Ensure wallet supports selected network
• Different networks have different fees`;

    const walletInfoContent = `• Enter your cryptocurrency wallet address
• Double-check for accuracy (cannot be reversed)
• USDT-TRC20 addresses start with 'T'
• Copy-paste to avoid errors`;

    const amountInfoContent = `• Enter the amount you wish to withdraw
• Amount should be in USD
• Check available balance before withdrawal
• Minimum withdrawal: $50 USD`;

    const passwordInfoContent = `• Enter your account password for security
• Required for withdrawal confirmation
• Do not share your password
• Password must match your account`;

    const summaryInfoContent = `• Amount: ${watch("amount") || amountParam || "0.00"} USD
• Network: ${watch("network") || networkParam || "Not selected"}
• Processing: Within 30 minutes
• Status: Pending verification`;

    // DARK MODE COLOR VARIABLES
    const pageBgColor = COLORS.darkBg; // Dark background #1a1f24
    const cardBgColor = alpha("#2a2f34", 0.9); // Slightly lighter dark for cards
    const borderColor = alpha(COLORS.greyDark, 0.3); // Dark borders
    const textPrimary = COLORS.whiteMain; // White text for primary
    const textSecondary = COLORS.greyMedium; // Grey text for secondary
    
    const infoCardBg = alpha("#1976d2", 0.15);
    const infoCardBorder = alpha("#1976d2", 0.3);
    const warningBg = alpha("#ed6c02", 0.15);
    const warningBorder = alpha("#ed6c02", 0.3);
    const successBg = alpha("#2e7d32", 0.15);
    const successBorder = alpha("#2e7d32", 0.3);
    const errorBg = alpha("#d32f2f", 0.15);
    const errorBorder = alpha("#d32f2f", 0.3);
    
    const helpSectionBg = alpha(COLORS.greyDark, 0.1);
    const gradientBg = `linear-gradient(135deg, ${alpha(COLORS.accentGold, 0.15)} 0%, ${alpha(COLORS.darkBg, 0.3)} 100%)`;
    const primaryHoverBg = alpha(COLORS.accentGold, 0.2);
    const infoHoverBg = alpha("#1976d2", 0.2);
    const selectBgColor = alpha("#2a2f34", 0.7);

    const handleBack = () => {
        navigate(-1);
    };

    const onSubmit = async (data) => {
        try {
            const finalData = !isAmountAndRemarkSubmittedParam ? data : { 
                amount: amountParam, 
                walletAddress: walletAddressParam, 
                network: networkParam, 
                password: data?.password 
            };

            const response = await cryptoWithdraw(finalData).unwrap();
            
            if (response?.status) {
                if (!isAmountAndRemarkSubmittedParam && securityMethod !== "GOOGLE-AUTH") {
                    setSearchParams({
                        amount: data?.amount,
                        walletAddress: data?.walletAddress,
                        network: data?.network,
                        isAmountAndRemarkSubmitted: true
                    });
                } else {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete("amount");
                    newParams.delete("walletAddress");
                    newParams.delete("network");
                    newParams.delete("isAmountAndRemarkSubmitted");
                    setSearchParams(newParams);
                }
                dispatch(setNotification({ 
                    open: true, 
                    message: response?.message || "Crypto withdrawal request submitted successfully!", 
                    severity: "success" 
                }));
                reset(defaultValues);
                refetch();
            }
        } catch (error) {
            if (!error?.data?.status) {
                dispatch(setNotification({ 
                    open: true, 
                    message: error?.data?.message || "Failed to submit. Please try again.", 
                    severity: "error" 
                }));
            }
        }
    };

    const amount = watch("amount") || amountParam;
    const formattedAmount = amount ? parseFloat(amount).toFixed(2) : "0.00";

    return (
        <Container maxWidth="lg" sx={{ 
            py: isMobile ? 1.5 : 3, 
            height: '100vh', 
            overflow: 'hidden',
            backgroundColor: pageBgColor,
            px: isMobile ? 1.5 : 3
        }}>
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
                        maxWidth: 300,
                        borderRadius: 2,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                        border: `1px solid ${borderColor}`,
                        bgcolor: cardBgColor,
                    }
                }}
            >
                <Stack spacing={1}>
                    <Typography variant="subtitle2" fontWeight={600} color={COLORS.accentGold}>
                        Information
                    </Typography>
                    <Typography variant="body2" color={textSecondary} sx={{ whiteSpace: 'pre-line', fontSize: '0.8rem' }}>
                        {popoverContent}
                    </Typography>
                </Stack>
            </Popover>

            {/* Main Layout */}
            <Box sx={{ 
                height: 'calc(100vh - 40px)', 
                display: 'flex', 
                flexDirection: 'column',
                gap: 1.5 
            }}>
                {/* Header Section */}
                <Paper
                    elevation={0}
                    sx={{
                        p: isMobile ? 1.2 : 2,
                        borderRadius: 1.5,
                        border: `1px solid ${borderColor}`,
                        backgroundColor: cardBgColor,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                        flexShrink: 0,
                    }}
                >
                    <Grid container alignItems="center" spacing={1.5}>
                        <Grid item xs={8} sm={9}>
                            <Stack direction="row" alignItems="center" spacing={1.2}>
                                <Box sx={{ 
                                    width: 36, 
                                    height: 36, 
                                    borderRadius: 1.5, 
                                    bgcolor: alpha(COLORS.accentGold, 0.2),
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center' 
                                }}>
                                    <CurrencyExchangeIcon sx={{ 
                                        color: COLORS.accentGold,
                                        fontSize: isMobile ? '1.2rem' : '1.5rem'
                                    }} />
                                </Box>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <Typography 
                                            variant={isMobile ? "h6" : "h5"} 
                                            fontWeight={600}
                                            color={textPrimary}
                                        >
                                            Crypto Withdrawal
                                        </Typography>
                                        <Tooltip title="Withdrawal information">
                                            <IconButton 
                                                size="small" 
                                                onClick={(e) => handleInfoClick(e, headerInfoContent)}
                                                sx={{ 
                                                    color: COLORS.accentGold,
                                                    p: 0.3,
                                                    '&:hover': { 
                                                        bgcolor: primaryHoverBg
                                                    }
                                                }}
                                            >
                                                <InfoIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Typography variant="caption" color={textSecondary}>
                                        Withdraw cryptocurrency securely to your wallet
                                    </Typography>
                                </Box>
                            </Stack>
                        </Grid>
                        <Grid item xs={4} sm={3} sx={{ textAlign: 'right' }}>
                            <Button
                                variant="outlined"
                                size={isMobile ? "small" : "medium"}
                                startIcon={<ArrowBackIcon />}
                                onClick={handleBack}
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: 1.2,
                                    px: isMobile ? 1.2 : 2,
                                    borderColor: borderColor,
                                    color: textPrimary,
                                    fontSize: isMobile ? '0.8rem' : '0.875rem',
                                    '&:hover': {
                                        borderColor: COLORS.accentGold,
                                        color: COLORS.accentGold,
                                        backgroundColor: primaryHoverBg
                                    }
                                }}
                            >
                                {isMobile ? '' : 'Back'}
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Security Method Info */}
                {securityMethod === "GOOGLE-AUTH" && (
                    <Alert 
                        severity="info"
                        sx={{ 
                            borderRadius: 1.2,
                            border: `1px solid ${infoCardBorder}`,
                            backgroundColor: infoCardBg,
                            flexShrink: 0,
                        }}
                        icon={<GppGoodIcon />}
                    >
                        <Typography variant="caption" color="#42a5f5">
                            Using Google Authenticator for enhanced security.
                        </Typography>
                    </Alert>
                )}

                {/* Main Content Area */}
                <Box sx={{ 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: 1.5,
                    overflow: 'hidden'
                }}>
                    {/* Left Panel - Form */}
                    <Paper
                        elevation={0}
                        sx={{
                            flex: isMobile ? 1 : 2,
                            p: isMobile ? 1.2 : 2,
                            borderRadius: 1.5,
                            border: `1px solid ${borderColor}`,
                            backgroundColor: cardBgColor,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            minHeight: isMobile ? '400px' : 'auto',
                        }}
                    >
                        {/* Header with Chips */}
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            mb: 2,
                            pb: 1.2,
                            borderBottom: `1px solid ${borderColor}`,
                            flexShrink: 0,
                        }}>
                            <Typography variant="h6" fontWeight={600} color={textPrimary}>
                                Withdrawal Details
                            </Typography>
                            <Stack direction="row" spacing={0.5}>
                                <Chip
                                    label="Fast"
                                    size="small"
                                    variant="outlined"
                                    icon={<AccessTimeIcon fontSize="small" />}
                                    sx={{ 
                                        fontSize: '0.65rem',
                                        height: 22,
                                        borderColor: successBorder,
                                        color: "#4caf50",
                                        backgroundColor: successBg,
                                        '& .MuiChip-icon': {
                                            color: "#4caf50"
                                        }
                                    }}
                                />
                                <Chip
                                    label="Secure"
                                    size="small"
                                    variant="outlined"
                                    icon={<SecurityIcon fontSize="small" />}
                                    sx={{ 
                                        fontSize: '0.65rem',
                                        height: 22,
                                        borderColor: successBorder,
                                        color: "#4caf50",
                                        backgroundColor: successBg,
                                        '& .MuiChip-icon': {
                                            color: "#4caf50"
                                        }
                                    }}
                                />
                            </Stack>
                        </Box>

                        {/* Scrollable Form Content */}
                        <Box sx={{ 
                            flex: 1,
                            overflow: 'auto',
                            pr: isMobile ? 0.5 : 0,
                            '&::-webkit-scrollbar': {
                                width: '4px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: 'transparent',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: borderColor,
                                borderRadius: '2px',
                            }
                        }}>
                            {/* Error Alert */}
                            {isError && error?.data?.message && (
                                <Alert 
                                    severity="error" 
                                    sx={{ 
                                        mb: 1.5,
                                        borderRadius: 1.2,
                                        '& .MuiAlert-icon': { alignItems: 'center' },
                                        bgcolor: errorBg,
                                        border: `1px solid ${errorBorder}`,
                                        color: "#ff5252",
                                        fontSize: isMobile ? '0.8rem' : '0.875rem'
                                    }}
                                    icon={<ErrorOutlineIcon fontSize="small" />}
                                >
                                    {error.data.message}
                                </Alert>
                            )}

                            <Stack
                                component={"form"}
                                onSubmit={handleSubmit(onSubmit)}
                                spacing={2}
                                sx={{ pb: 1 }}
                            >
                                {/* Network Selection */}
                                {(securityMethod === "GOOGLE-AUTH" || !isAmountAndRemarkSubmittedParam) && (
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                                            <InputLabel 
                                                sx={{ 
                                                    fontWeight: 500,
                                                    color: textPrimary,
                                                    fontSize: isMobile ? '0.8rem' : '0.85rem',
                                                    m: 0
                                                }}
                                            >
                                                Select Network *
                                            </InputLabel>
                                            <Tooltip title="Network information">
                                                <IconButton 
                                                    size="small" 
                                                    onClick={(e) => handleInfoClick(e, networkInfoContent)}
                                                    sx={{ 
                                                        color: "#42a5f5",
                                                        p: 0.3,
                                                        '&:hover': { 
                                                            bgcolor: infoHoverBg
                                                        }
                                                    }}
                                                >
                                                    <InfoIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        <Selector
                                            items={networks}
                                            value={watch("network")}
                                            onChange={(e) => setValue("network", e.target.value, { shouldValidate: true })}
                                            shouldBeFullWidth={true}
                                            sx={{
                                                borderRadius: 1.2,
                                                '& .MuiSelect-select': {
                                                    py: isMobile ? 0.8 : 1.2,
                                                    fontSize: isMobile ? '0.85rem' : '0.9rem',
                                                    backgroundColor: selectBgColor,
                                                    color: textPrimary,
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: borderColor,
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: COLORS.accentGold,
                                                }
                                            }}
                                        />
                                        {errors.network && (
                                            <Typography color="#ff5252" variant="caption" sx={{ mt: 0.3, display: 'block', fontSize: isMobile ? '0.7rem' : '0.75rem' }}>
                                                {errors.network.message}
                                            </Typography>
                                        )}
                                    </Box>
                                )}

                                {/* Wallet Address */}
                                {(securityMethod === "GOOGLE-AUTH" || !isAmountAndRemarkSubmittedParam) && (
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                                            <InputLabel 
                                                sx={{ 
                                                    fontWeight: 500,
                                                    color: textPrimary,
                                                    fontSize: isMobile ? '0.8rem' : '0.85rem',
                                                    m: 0
                                                }}
                                            >
                                                Wallet Address *
                                            </InputLabel>
                                            <Tooltip title="Wallet information">
                                                <IconButton 
                                                    size="small" 
                                                    onClick={(e) => handleInfoClick(e, walletInfoContent)}
                                                    sx={{ 
                                                        color: "#42a5f5",
                                                        p: 0.3,
                                                        '&:hover': { 
                                                            bgcolor: infoHoverBg
                                                        }
                                                    }}
                                                >
                                                    <InfoIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        <TextField
                                            {...register("walletAddress")}
                                            size='small' 
                                            multiline 
                                            rows={isMobile ? 2 : 2}
                                            fullWidth 
                                            placeholder="Enter your USDT address"
                                            variant="outlined"
                                            sx={{
                                                borderRadius: 1.2,
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 1.2,
                                                    backgroundColor: selectBgColor,
                                                    '& .MuiOutlinedInput-input': {
                                                        color: textPrimary,
                                                    },
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: borderColor,
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: COLORS.accentGold,
                                                    }
                                                }
                                            }}
                                            error={!!errors.walletAddress}
                                            helperText={errors.walletAddress?.message}
                                        />
                                    </Box>
                                )}

                                {/* Amount Field */}
                                {(securityMethod === "GOOGLE-AUTH" || !isAmountAndRemarkSubmittedParam) && (
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                                            <InputLabel 
                                                sx={{ 
                                                    fontWeight: 500,
                                                    color: textPrimary,
                                                    fontSize: isMobile ? '0.8rem' : '0.85rem',
                                                    m: 0
                                                }}
                                            >
                                                Amount (USD) *
                                            </InputLabel>
                                            <Tooltip title="Amount information">
                                                <IconButton 
                                                    size="small" 
                                                    onClick={(e) => handleInfoClick(e, amountInfoContent)}
                                                    sx={{ 
                                                        color: "#42a5f5",
                                                        p: 0.3,
                                                        '&:hover': { 
                                                            bgcolor: infoHoverBg
                                                        }
                                                    }}
                                                >
                                                    <InfoIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        <OutlinedInput
                                            {...register("amount")}
                                            endAdornment={<InputAdornment position="end" sx={{ color: textSecondary }}>USD</InputAdornment>}
                                            fullWidth
                                            placeholder="0.00"
                                            variant="outlined"
                                            type="number"
                                            inputProps={{ 
                                                min: 0,
                                                step: "0.01"
                                            }}
                                            sx={{
                                                borderRadius: 1.2,
                                                fontWeight: "bold",
                                                fontSize: isMobile ? "1rem" : "1.1rem",
                                                backgroundColor: selectBgColor,
                                                '& .MuiOutlinedInput-input': {
                                                    py: isMobile ? 0.8 : 1.2,
                                                    color: textPrimary,
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: borderColor,
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: COLORS.accentGold,
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: COLORS.accentGold,
                                                    borderWidth: 1,
                                                },
                                                '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: "#ff5252",
                                                }
                                            }}
                                            error={!!errors.amount}
                                        />
                                        {errors.amount && (
                                            <Typography color="#ff5252" variant="caption" sx={{ mt: 0.3, display: 'block', fontSize: isMobile ? '0.7rem' : '0.75rem' }}>
                                                {errors.amount.message}
                                            </Typography>
                                        )}
                                    </Box>
                                )}

                                {/* Password Field */}
                                {(securityMethod === "GOOGLE-AUTH" || isAmountAndRemarkSubmittedParam) && (
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                                            <InputLabel 
                                                sx={{ 
                                                    fontWeight: 500,
                                                    color: textPrimary,
                                                    fontSize: isMobile ? '0.8rem' : '0.85rem',
                                                    m: 0
                                                }}
                                            >
                                                Password *
                                            </InputLabel>
                                            <Tooltip title="Password information">
                                                <IconButton 
                                                    size="small" 
                                                    onClick={(e) => handleInfoClick(e, passwordInfoContent)}
                                                    sx={{ 
                                                        color: "#42a5f5",
                                                        p: 0.3,
                                                        '&:hover': { 
                                                            bgcolor: infoHoverBg
                                                        }
                                                    }}
                                                >
                                                    <InfoIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        <TextField
                                            {...register("password")}
                                            size='small' 
                                            fullWidth 
                                            placeholder="Enter your password"
                                            variant="outlined"
                                            type="password"
                                            sx={{
                                                borderRadius: 1.2,
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 1.2,
                                                    backgroundColor: selectBgColor,
                                                    '& .MuiOutlinedInput-input': {
                                                        color: textPrimary,
                                                    },
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: borderColor,
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: COLORS.accentGold,
                                                    }
                                                }
                                            }}
                                            error={!!errors.password}
                                            helperText={errors.password?.message}
                                        />
                                    </Box>
                                )}

                                {/* Submit Button */}
                                <Box sx={{ mt: 0.5, flexShrink: 0 }}>
                                    <Button
                                        type='submit'
                                        variant='contained'
                                        disabled={isLoading || !isValid}
                                        fullWidth
                                        size={isMobile ? "medium" : "large"}
                                        startIcon={isLoading ? <CircularProgress size={isMobile ? 16 : 20} color="inherit" /> : <CheckCircleIcon />}
                                        sx={{
                                            textTransform: 'none',
                                            borderRadius: 1.2,
                                            py: isMobile ? 0.8 : 1.2,
                                            fontSize: isMobile ? '0.85rem' : '0.95rem',
                                            fontWeight: 600,
                                            backgroundColor: COLORS.accentGold,
                                            color: COLORS.whiteMain,
                                            boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                                            '&:hover': {
                                                backgroundColor: alpha(COLORS.accentGold, 0.8),
                                                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                                            },
                                            '&:disabled': {
                                                opacity: 0.6,
                                                backgroundColor: alpha(COLORS.accentGold, 0.3)
                                            }
                                        }}
                                    >
                                        {isLoading ? 'Processing...' : 'Submit Withdrawal Request'}
                                    </Button>
                                </Box>
                            </Stack>
                        </Box>
                    </Paper>

                    {/* Right Panel - Summary */}
                    <Paper
                        elevation={0}
                        sx={{
                            flex: 1,
                            p: isMobile ? 1.2 : 2,
                            borderRadius: 1.5,
                            border: `1px solid ${borderColor}`,
                            backgroundColor: cardBgColor,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            minHeight: isMobile ? '300px' : 'auto',
                        }}
                    >
                        {/* Summary Header */}
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            mb: 1.5,
                            pb: 1.2,
                            borderBottom: `1px solid ${borderColor}`,
                            flexShrink: 0,
                        }}>
                            <Typography variant="h6" fontWeight={600} color={textPrimary}>
                                Withdrawal Summary
                            </Typography>
                            <Tooltip title="Summary information">
                                <IconButton 
                                    size="small" 
                                    onClick={(e) => handleInfoClick(e, summaryInfoContent)}
                                    sx={{ 
                                        color: COLORS.accentGold,
                                        p: 0.3,
                                        '&:hover': { 
                                            bgcolor: primaryHoverBg
                                        }
                                    }}
                                >
                                    <InfoIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        {/* Scrollable Summary Content */}
                        <Box sx={{ 
                            flex: 1,
                            overflow: 'auto',
                            pr: isMobile ? 0.5 : 0,
                            '&::-webkit-scrollbar': {
                                width: '4px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: 'transparent',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: borderColor,
                                borderRadius: '2px',
                            }
                        }}>
                            {/* Amount Display */}
                            <Box sx={{ 
                                mb: 1.5,
                                p: 1.2,
                                borderRadius: 1.2,
                                bgcolor: alpha(COLORS.accentGold, 0.1),
                                border: `1px solid ${alpha(COLORS.accentGold, 0.2)}`,
                                textAlign: 'center'
                            }}>
                                <Typography variant="caption" color={textSecondary} sx={{ mb: 0.3, display: 'block', fontSize: isMobile ? '0.75rem' : '0.8rem' }}>
                                    Withdrawal Amount
                                </Typography>
                                <Typography variant={isMobile ? "h4" : "h3"} fontWeight={700} color={COLORS.accentGold}>
                                    ${formattedAmount}
                                </Typography>
                                <Typography variant="caption" color={textSecondary} sx={{ fontSize: isMobile ? '0.75rem' : '0.8rem' }}>
                                    {amount ? "USD" : "Enter amount"}
                                </Typography>
                            </Box>

                            {/* Withdrawal Details */}
                            <Box sx={{ mb: 1.5 }}>
                                <Typography variant="subtitle2" fontWeight={600} color={textSecondary} sx={{ mb: 1.2, fontSize: isMobile ? '0.85rem' : '0.9rem' }}>
                                    Details
                                </Typography>
                                <Stack spacing={1.2}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" color={textSecondary} sx={{ fontSize: isMobile ? '0.8rem' : '0.85rem' }}>
                                            Network:
                                        </Typography>
                                        <Typography variant="body2" fontWeight={500} color={textPrimary} sx={{ 
                                            textAlign: 'right', 
                                            maxWidth: '60%',
                                            fontSize: isMobile ? '0.8rem' : '0.85rem',
                                            wordBreak: 'break-word'
                                        }}>
                                            {watch("network") || networkParam || 'Not selected'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" color={textSecondary} sx={{ fontSize: isMobile ? '0.8rem' : '0.85rem' }}>
                                            Wallet Address:
                                        </Typography>
                                        <Chip
                                            label={watch("walletAddress") || walletAddressParam ? "Provided" : "Not provided"}
                                            size="small"
                                            sx={{ 
                                                fontSize: '0.65rem',
                                                height: 22,
                                                backgroundColor: watch("walletAddress") || walletAddressParam 
                                                    ? successBg
                                                    : warningBg,
                                                border: `1px solid ${watch("walletAddress") || walletAddressParam 
                                                    ? successBorder
                                                    : warningBorder
                                                }`,
                                                color: watch("walletAddress") || walletAddressParam 
                                                    ? "#4caf50"
                                                    : "#ff9800",
                                            }}
                                        />
                                    </Box>
                                    <Divider sx={{ borderColor: borderColor }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" color={textSecondary} sx={{ fontSize: isMobile ? '0.8rem' : '0.85rem' }}>
                                            Processing:
                                        </Typography>
                                        <Chip
                                            label="30 mins"
                                            size="small"
                                            sx={{ 
                                                fontSize: '0.65rem',
                                                height: 22,
                                                backgroundColor: successBg,
                                                border: `1px solid ${successBorder}`,
                                                color: "#4caf50",
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" color={textSecondary} sx={{ fontSize: isMobile ? '0.8rem' : '0.85rem' }}>
                                            Security:
                                        </Typography>
                                        <Chip
                                            label="Password"
                                            size="small"
                                            sx={{ 
                                                fontSize: '0.65rem',
                                                height: 22,
                                                backgroundColor: infoCardBg,
                                                border: `1px solid ${infoCardBorder}`,
                                                color: "#42a5f5",
                                            }}
                                        />
                                    </Box>
                                </Stack>
                            </Box>

                            {/* Information Card */}
                            <Card
                                sx={{
                                    p: 1,
                                    borderRadius: 1.2,
                                    backgroundColor: infoCardBg,
                                    border: `1px solid ${infoCardBorder}`,
                                    mb: 1.5,
                                }}
                            >
                                <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'flex-start' }}>
                                    <i 
                                        style={{ 
                                            fontSize: isMobile ? '0.85rem' : '0.9rem', 
                                            color: "#42a5f5",
                                            fontWeight: 'bold',
                                            flexShrink: 0,
                                            marginTop: '2px'
                                        }}
                                    >
                                        ⓘ
                                    </i>
                                    <Box>
                                        <Typography variant="caption" fontWeight={500} color={textPrimary} sx={{ 
                                            mb: 0.2, 
                                            display: 'block',
                                            fontSize: isMobile ? '0.75rem' : '0.8rem'
                                        }}>
                                            Important Information
                                        </Typography>
                                        <Typography variant="caption" color={textSecondary} sx={{ 
                                            fontSize: isMobile ? '0.7rem' : '0.75rem', 
                                            lineHeight: 1.2 
                                        }}>
                                            Crypto withdrawals are processed within 30 minutes. Double-check wallet address as transactions cannot be reversed.
                                        </Typography>
                                    </Box>
                                </Box>
                            </Card>

                            {/* Warning Card */}
                            <Card
                                sx={{
                                    p: 1,
                                    borderRadius: 1.2,
                                    backgroundColor: warningBg,
                                    border: `1px solid ${warningBorder}`,
                                    mb: 1.5,
                                }}
                            >
                                <Typography variant="caption" color={textSecondary} sx={{ 
                                    fontSize: isMobile ? '0.7rem' : '0.75rem', 
                                    lineHeight: 1.2 
                                }}>
                                    <i style={{ 
                                        marginRight: '4px',
                                        color: "#ff9800"
                                    }}>
                                        ⚠️
                                    </i>
                                    Crypto transactions are irreversible. Ensure wallet address and network are correct before submitting.
                                </Typography>
                            </Card>

                            {/* Network Info Card */}
                            <Card
                                sx={{
                                    p: 1,
                                    borderRadius: 1.2,
                                    backgroundColor: successBg,
                                    border: `1px solid ${successBorder}`,
                                }}
                            >
                                <Stack spacing={0.5}>
                                    <Typography variant="caption" fontWeight={600} color={textPrimary} sx={{ fontSize: isMobile ? '0.75rem' : '0.8rem' }}>
                                        TRON Network (USDT-TRC20)
                                    </Typography>
                                    <Typography variant="caption" color={textSecondary} sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem', lineHeight: 1.2 }}>
                                        • Network fee: $1-3 USD
                                        • Confirmation time: 5-20 minutes
                                        • Minimum withdrawal: $50 USD
                                    </Typography>
                                </Stack>
                            </Card>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Container>
    );
}

export default CryptoWithdrawalForm;