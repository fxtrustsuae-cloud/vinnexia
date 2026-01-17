import { 
    Container, 
    Stack, 
    Box, 
    Paper, 
    Typography, 
    Chip, 
    alpha, 
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    MenuItem,
    Select
  } from '@mui/material';
  import OrderHistoryTable from './orderHistoryTable/OrderHistoryTable';
  import Toggle from '../../../components/Toggle';
  import { useState, useEffect, useRef, useMemo } from 'react';
  import { useGetUserDataQuery } from '../../../globalState/userState/userStateApis';
  import { useSelector } from 'react-redux';
  import { initiatePositionSocketConnection } from '../../../socketENV/positionSocketENV';
  import { useClosedOrderListQuery } from '../../../globalState/trade/tradeApis';
  import HeroOpenAccountPage from '../../myAccount/liveAccount/heroOpenAccountPage/HeroOpenAccountPage';
  import Loader from '../../../components/Loader';
  import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
  
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
    
    // Table colors
    tableHeaderBg: '#2a2a2a',
    tableRowBg: '#1e1e1e',
    tableRowHoverBg: '#2d2d2d',
    tableBorder: '#333333',
    
    // Additional colors
    white: '#ffffff',
    black: '#11191E',
  };
  
  const toggleItems = [
    { name: "Open positions", icon: null },
    { name: "Closed positions", icon: null }
  ];
  
  function OrderHistory({ login }) {
    const [active, setActive] = useState(toggleItems[0]?.name);
    const [accountType, setAccountType] = useState("");
    const [MT5Account, setMT5Account] = useState("");
    const [positionData, setPositionData] = useState(null);
    const [isTableLoading, setIsTableLoading] = useState(false);
  
    const socketRef = useRef(null);
    const { token } = useSelector((state) => state.auth);
  
    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    });
  
    const mt5AccountList = data?.data?.mt5AccountList || [];
  
    // Separate REAL and DEMO accounts
    const realMT5Accounts = useMemo(() => {
      return mt5AccountList
        .filter(item => item?.accountType?.toLowerCase() === "real")
        .map(item => item.Login);
    }, [mt5AccountList]);
  
    const demoMT5Accounts = useMemo(() => {
      return mt5AccountList
        .filter(item => item?.accountType?.toLowerCase() === "demo")
        .map(item => item.Login);
    }, [mt5AccountList]);
  
    // Get account details by login
    const mt5AccountDetails = useMemo(() => {
      const details = {};
      mt5AccountList.forEach(item => {
        details[item.Login] = item;
      });
      return details;
    }, [mt5AccountList]);
  
    // Determine available account types
    const allAccountTypes = useMemo(() => {
      const types = [];
      if (realMT5Accounts.length > 0) types.push("REAL");
      if (demoMT5Accounts.length > 0) types.push("DEMO");
      return types;
    }, [realMT5Accounts, demoMT5Accounts]);
  
    // Get current list of accounts based on selected type
    const currentAccountList = useMemo(() => {
      if (accountType === "REAL") return realMT5Accounts;
      if (accountType === "DEMO") return demoMT5Accounts;
      return [];
    }, [accountType, realMT5Accounts, demoMT5Accounts]);
  
    // Get current account details
    const currentAccountDetails = useMemo(() => {
      if (!MT5Account) return null;
      return mt5AccountDetails[MT5Account] || null;
    }, [MT5Account, mt5AccountDetails]);
  
    // Initialize account type and account on mount
    useEffect(() => {
      if (login) return; // Skip if login prop is provided
      
      // Set default account type
      let defaultType = "";
      let defaultAccount = "";
      
      if (realMT5Accounts.length > 0) {
        defaultType = "REAL";
        defaultAccount = realMT5Accounts[0];
      } else if (demoMT5Accounts.length > 0) {
        defaultType = "DEMO";
        defaultAccount = demoMT5Accounts[0];
      }
      
      if (defaultType && defaultAccount) {
        setAccountType(defaultType);
        setMT5Account(defaultAccount);
      }
    }, [realMT5Accounts, demoMT5Accounts, login]);
  
    // Handle account type change
    const handleChangeAccountType = (event) => {
      const newType = event.target.value;
      setAccountType(newType);
      setPositionData(null);
      setIsTableLoading(true);
      
      if (!login) {
        // Get first account of new type
        const newAccounts = newType === "REAL" ? realMT5Accounts : demoMT5Accounts;
        if (newAccounts.length > 0) {
          setMT5Account(newAccounts[0]);
        } else {
          setMT5Account("");
        }
      }
    };
  
    // Handle account change
    const handleChangeAccount = (e) => {
      const newAccount = e.target.value;
      if (newAccount !== MT5Account) {
        setMT5Account(newAccount);
        setPositionData(null);
        setIsTableLoading(true);
      }
    };
  
    // Socket connection for open positions
    useEffect(() => {
        const currentLogin = login ? login : MT5Account;
        
        if (!currentLogin || !token || active !== "Open positions") {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            return;
        }
  
        setIsTableLoading(true);
  
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
  
        socketRef.current = initiatePositionSocketConnection({
            login: currentLogin,
            token,
            handlePositionData: (data) => {
                setPositionData(data);
                setIsTableLoading(false);
            },
        });
  
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            setPositionData(null);
        };
    }, [login, MT5Account, token, active]);
  
    // Closed orders query
    const { data: closedOrderData, isFetching: isClosedOrderFetching } =
        useClosedOrderListQuery(
            { login: login ? login : MT5Account },
            { 
                skip: !token || !(login ? login : MT5Account) || active !== "Closed positions",
                refetchOnMountOrArgChange: true
            }
        );
  
    const closedOrders = closedOrderData?.data;
  
    // Update loading state for closed orders
    useEffect(() => {
        if (active === "Closed positions") {
            if (isClosedOrderFetching) {
                setIsTableLoading(true);
            } else if (closedOrderData) {
                setIsTableLoading(false);
            }
        }
    }, [active, isClosedOrderFetching, closedOrderData]);
  
    const isTableDataLoading = isTableLoading || 
        (active === "Closed positions" && isClosedOrderFetching);
  
    if (isLoading) return <Loader />;
    if (!login && !mt5AccountList.length) return <HeroOpenAccountPage />;
  
    return (
        <Container 
            maxWidth={false} 
            disableGutters
            sx={{ 
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: COLORS.background,
            }}
        >
            <Box sx={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                p: { xs: 2, sm: 3, md: 3 },
                py: '0px'
            }}>
                {/* Header Section */}
                <Box sx={{ mb: { xs: 2, md: 1 } }}>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                        <AccountBalanceWalletIcon 
                            sx={{ 
                                color: COLORS.primary,
                                fontSize: { xs: '1.5rem', md: '2rem' }
                            }} 
                        />
                        <Typography 
                            variant="h4" 
                            fontWeight={700}
                            sx={{ 
                                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                                color: COLORS.textPrimary
                            }}
                        >
                            Order History
                        </Typography>
                    </Stack>
                </Box>
  
                {/* Controls Section - Single Row Layout */}
                <Paper 
                    elevation={0}
                    sx={{
                        p: { xs: 2.5, md: 3 },
                        borderRadius: '12px',
                        backgroundColor: COLORS.paper,
                        border: `1px solid ${COLORS.border}`,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                        mb: { xs: 2.5, md: 3 },
                        width: '100%'
                    }}
                >
                    <Stack 
                        direction={{ xs: 'column', md: 'row' }} 
                        spacing={{ xs: 3, md: 4 }}
                        alignItems={{ xs: 'stretch', md: 'flex-start' }}
                    >
                        {/* Left Side: Account Selection (when no login) */}
                        {!login && (
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Stack spacing={2.5}>
                                    {/* Account Type Selection - Radio Buttons */}
                                    <Box>
                                        <Typography 
                                            variant="subtitle2" 
                                            fontWeight={600}
                                            sx={{ 
                                                color: COLORS.textSecondary,
                                                mb: 1.5,
                                                fontSize: '0.875rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}
                                        >
                                            <Box 
                                                sx={{ 
                                                    width: '4px', 
                                                    height: '14px', 
                                                    bgcolor: COLORS.primary,
                                                    borderRadius: '2px'
                                                }} 
                                            />
                                            Account Type
                                        </Typography>
                                        
                                        <FormControl component="fieldset">
                                            <RadioGroup
                                                row
                                                aria-label="account-type"
                                                name="account-type-radio-group"
                                                value={accountType}
                                                onChange={handleChangeAccountType}
                                                sx={{ gap: { xs: 2, sm: 3 } }}
                                            >
                                                {allAccountTypes.includes("REAL") && (
                                                    <FormControlLabel 
                                                        value="REAL" 
                                                        control={
                                                            <Radio 
                                                                size="small"
                                                                sx={{
                                                                    color: COLORS.textSecondary,
                                                                    '&.Mui-checked': {
                                                                        color: COLORS.primary,
                                                                    }
                                                                }}
                                                            />
                                                        } 
                                                        label={
                                                            <Typography variant="body2" sx={{ 
                                                                fontWeight: accountType === "REAL" ? 600 : 400,
                                                                color: accountType === "REAL" ? COLORS.textPrimary : COLORS.textSecondary,
                                                                fontSize: '0.875rem'
                                                            }}>
                                                                Real Accounts
                                                            </Typography>
                                                        }
                                                        sx={{ mr: 0 }}
                                                    />
                                                )}
                                                
                                                {allAccountTypes.includes("DEMO") && (
                                                    <FormControlLabel 
                                                        value="DEMO" 
                                                        control={
                                                            <Radio 
                                                                size="small"
                                                                sx={{
                                                                    color: COLORS.textSecondary,
                                                                    '&.Mui-checked': {
                                                                        color: COLORS.info,
                                                                    }
                                                                }}
                                                            />
                                                        } 
                                                        label={
                                                            <Typography variant="body2" sx={{ 
                                                                fontWeight: accountType === "DEMO" ? 600 : 400,
                                                                color: accountType === "DEMO" ? COLORS.textPrimary : COLORS.textSecondary,
                                                                fontSize: '0.875rem'
                                                            }}>
                                                                Demo Accounts
                                                            </Typography>
                                                        }
                                                        sx={{ mr: 0 }}
                                                    />
                                                )}
                                            </RadioGroup>
                                        </FormControl>
  
                                        {/* Account Type Counts */}
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 1,
                                            mt: 1,
                                            flexWrap: 'wrap'
                                        }}>
                                            {allAccountTypes.includes("REAL") && (
                                                <Chip
                                                    label={`${realMT5Accounts.length} Real`}
                                                    size="small"
                                                    variant={accountType === "REAL" ? "filled" : "outlined"}
                                                    color="primary"
                                                    sx={{
                                                        fontWeight: 500,
                                                        fontSize: '0.75rem',
                                                        height: '26px',
                                                        backgroundColor: accountType === "REAL" 
                                                            ? alpha(COLORS.primary, 0.1)
                                                            : 'transparent',
                                                        borderColor: alpha(COLORS.primary, 0.3),
                                                        color: accountType === "REAL" 
                                                            ? COLORS.primary 
                                                            : COLORS.textSecondary,
                                                        '& .MuiChip-label': {
                                                            px: 1.5
                                                        }
                                                    }}
                                                />
                                            )}
                                            
                                            {allAccountTypes.includes("DEMO") && (
                                                <Chip
                                                    label={`${demoMT5Accounts.length} Demo`}
                                                    size="small"
                                                    variant={accountType === "DEMO" ? "filled" : "outlined"}
                                                    color="info"
                                                    sx={{
                                                        fontWeight: 500,
                                                        fontSize: '0.75rem',
                                                        height: '26px',
                                                        backgroundColor: accountType === "DEMO" 
                                                            ? alpha(COLORS.info, 0.1)
                                                            : 'transparent',
                                                        borderColor: alpha(COLORS.info, 0.3),
                                                        color: accountType === "DEMO" 
                                                            ? COLORS.info 
                                                            : COLORS.textSecondary,
                                                        '& .MuiChip-label': {
                                                            px: 1.5
                                                        }
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </Box>
  
                                    {/* Account Number Selection */}
                                    <Box>
                                        <Typography 
                                            variant="subtitle2" 
                                            fontWeight={600}
                                            sx={{ 
                                                color: COLORS.textSecondary,
                                                mb: 1.5,
                                                fontSize: '0.875rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1
                                            }}
                                        >
                                            <Box 
                                                sx={{ 
                                                    width: '4px', 
                                                    height: '14px', 
                                                    bgcolor: COLORS.primary,
                                                    borderRadius: '2px'
                                                }} 
                                            />
                                            Account Number
                                        </Typography>
                                        <FormControl fullWidth size="small">
                                            <Select
                                                value={MT5Account || ""}
                                                onChange={handleChangeAccount}
                                                displayEmpty
                                                sx={{
                                                    borderRadius: '8px',
                                                    backgroundColor: alpha(COLORS.background, 0.5),
                                                    height: '44px',
                                                    color: COLORS.textPrimary,
                                                    '&:hover': {
                                                        backgroundColor: alpha(COLORS.background, 0.7),
                                                    },
                                                    '&.Mui-focused': {
                                                        backgroundColor: alpha(COLORS.background, 0.8),
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: accountType === "REAL" 
                                                                ? COLORS.primary 
                                                                : COLORS.info,
                                                            borderWidth: '2px'
                                                        }
                                                    },
                                                    '& .MuiSelect-select': {
                                                        fontFamily: 'monospace',
                                                        fontWeight: 500,
                                                        letterSpacing: '0.5px',
                                                        color: COLORS.textPrimary
                                                    },
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: COLORS.border,
                                                    },
                                                    '& svg': {
                                                        color: COLORS.textSecondary,
                                                    }
                                                }}
                                            >
                                                {currentAccountList.map((account) => (
                                                    <MenuItem 
                                                      key={account} 
                                                      value={account}
                                                      sx={{
                                                        backgroundColor: COLORS.paper,
                                                        color: COLORS.textPrimary,
                                                        '&:hover': {
                                                          backgroundColor: COLORS.tableRowHoverBg,
                                                        },
                                                        '&.Mui-selected': {
                                                          backgroundColor: alpha(COLORS.primary, 0.1),
                                                          '&:hover': {
                                                            backgroundColor: alpha(COLORS.primary, 0.2),
                                                          }
                                                        }
                                                      }}
                                                    >
                                                        <Typography 
                                                            variant="body2" 
                                                            sx={{ 
                                                                fontFamily: 'monospace',
                                                                fontWeight: 500
                                                            }}
                                                        >
                                                            {account}
                                                        </Typography>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
  
                                    {/* Selected Account Info */}
                                    {currentAccountDetails && MT5Account && (
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                borderRadius: '8px',
                                                backgroundColor: alpha(
                                                    accountType === "REAL" 
                                                        ? COLORS.primary 
                                                        : COLORS.info, 
                                                    0.08
                                                ),
                                                border: `1px solid ${alpha(
                                                    accountType === "REAL" 
                                                        ? COLORS.primary 
                                                        : COLORS.info, 
                                                    0.2
                                                )}`,
                                                mt: 0.5
                                            }}
                                        >
                                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                                <AccountBalanceWalletIcon 
                                                    fontSize="small" 
                                                    sx={{ 
                                                        color: accountType === "REAL" 
                                                            ? COLORS.primary 
                                                            : COLORS.info
                                                    }} 
                                                />
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography 
                                                        variant="caption" 
                                                        sx={{ 
                                                            color: COLORS.textSecondary,
                                                            fontSize: '0.75rem',
                                                            display: 'block'
                                                        }}
                                                    >
                                                        Selected Account
                                                    </Typography>
                                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.25 }}>
                                                        <Typography 
                                                            variant="body2" 
                                                            fontWeight={600}
                                                            sx={{ 
                                                                color: COLORS.textPrimary,
                                                                fontFamily: 'monospace',
                                                                fontSize: '0.875rem'
                                                            }}
                                                            noWrap
                                                        >
                                                            {MT5Account}
                                                        </Typography>
                                                        <Chip
                                                            label={accountType === "REAL" ? "Real" : "Demo"}
                                                            size="small"
                                                            color={accountType === "REAL" ? "primary" : "info"}
                                                            sx={{
                                                                height: '22px',
                                                                fontSize: '0.7rem',
                                                                fontWeight: 600,
                                                                backgroundColor: alpha(
                                                                    accountType === "REAL" 
                                                                        ? COLORS.primary 
                                                                        : COLORS.info, 
                                                                    0.15
                                                                )
                                                            }}
                                                        />
                                                    </Stack>
                                                </Box>
                                            </Stack>
                                        </Box>
                                    )}
                                </Stack>
                            </Box>
                        )}
  
                        {/* Vertical Divider */}
                        {!login && (
                            <Box 
                                sx={{ 
                                    width: { xs: '100%', md: '1px' },
                                    height: { xs: '1px', md: 'auto' },
                                    backgroundColor: COLORS.border,
                                    my: { xs: 1, md: 0 },
                                    mx: { xs: 0, md: 3 }
                                }} 
                            />
                        )}
  
                        {/* Right Side: View Type Selection */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Stack spacing={2.5}>
                                <Typography 
                                    variant="subtitle2" 
                                    fontWeight={600}
                                    sx={{ 
                                        color: COLORS.textSecondary,
                                        mb: 1.5,
                                        fontSize: '0.875rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <Box 
                                        sx={{ 
                                            width: '4px', 
                                            height: '14px', 
                                            bgcolor: COLORS.secondary,
                                            borderRadius: '2px'
                                        }} 
                                    />
                                    View Type
                                </Typography>
  
                                {/* Toggle Buttons */}
                                <Box>
                                    <Toggle
                                        items={toggleItems}
                                        active={active}
                                        onChange={setActive}
                                        stackSx={{ 
                                            width: '100%'
                                        }}
                                        toggleButtonSx={{ 
                                            fontSize: '0.875rem',
                                            fontWeight: 500,
                                            px: { xs: 1.5, md: 2 },
                                            py: 1.25,
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            flex: 1,
                                            transition: 'all 0.2s ease',
                                            '&.Mui-selected': {
                                                backgroundColor: COLORS.primary,
                                                color: COLORS.white,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                                '&:hover': {
                                                    backgroundColor: COLORS.primaryDark,
                                                }
                                            },
                                            '&:not(.Mui-selected)': {
                                                backgroundColor: alpha(COLORS.background, 0.6),
                                                border: `1px solid ${COLORS.border}`,
                                                color: COLORS.textSecondary,
                                                '&:hover': {
                                                    backgroundColor: alpha(COLORS.background, 0.8),
                                                    borderColor: COLORS.primaryLight,
                                                }
                                            }
                                        }}
                                        toggleButtonGroupSx={{ 
                                            width: '100%',
                                            height: 'auto',
                                            backgroundColor: 'transparent',
                                            '& .MuiToggleButtonGroup-grouped': {
                                                flex: 1,
                                                '&:not(:first-of-type)': {
                                                    marginLeft: { xs: '6px', md: '8px' },
                                                    borderRadius: '8px'
                                                },
                                                '&:first-of-type': {
                                                    borderRadius: '8px'
                                                }
                                            }
                                        }}
                                    />
                                    
                                    {/* Status Indicator */}
                                    <Stack 
                                        direction="row" 
                                        alignItems="center" 
                                        spacing={1.5}
                                        sx={{ 
                                            mt: 2.5,
                                            p: 1.5,
                                            borderRadius: '8px',
                                            backgroundColor: alpha(
                                                isTableDataLoading ? COLORS.warning : COLORS.success, 
                                                0.12
                                            ),
                                            border: `1px solid ${alpha(
                                                isTableDataLoading ? COLORS.warning : COLORS.success, 
                                                0.2
                                            )}`,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: '10px',
                                                height: '10px',
                                                borderRadius: '50%',
                                                backgroundColor: isTableDataLoading ? COLORS.warning : COLORS.success,
                                                animation: isTableDataLoading ? 'pulse 1.5s infinite' : 'none',
                                                '@keyframes pulse': {
                                                    '0%': { opacity: 1 },
                                                    '50%': { opacity: 0.5 },
                                                    '100%': { opacity: 1 }
                                                }
                                            }}
                                        />
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography 
                                                variant="caption" 
                                                fontWeight={600}
                                                sx={{ 
                                                    color: COLORS.textSecondary,
                                                    fontSize: '0.7rem',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.5px',
                                                    display: 'block'
                                                }}
                                            >
                                                Status
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                fontWeight={500}
                                                sx={{ 
                                                    color: isTableDataLoading ? COLORS.warning : COLORS.success,
                                                    fontSize: '0.8125rem',
                                                    mt: 0.25
                                                }}
                                                noWrap
                                            >
                                                {isTableDataLoading 
                                                    ? 'Loading data...' 
                                                    : active === 'Open positions' 
                                                        ? 'Live positions feed active' 
                                                        : 'Historical data loaded'}
                                            </Typography>
                                        </Box>
                                    </Stack>
  
                                    {/* Account Status Summary */}
                                    <Box
                                        sx={{
                                            mt: 2,
                                            p: 1.5,
                                            borderRadius: '8px',
                                            backgroundColor: alpha(COLORS.info, 0.08),
                                            border: `1px solid ${alpha(
                                                COLORS.info,
                                                0.2
                                            )}`,
                                        }}
                                    >
                                        <Typography 
                                            variant="caption" 
                                            fontWeight={600}
                                        sx={{ 
                                            color: COLORS.textSecondary,
                                            fontSize: '0.7rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            display: 'block',
                                            mb: 0.5
                                        }}
                                        >
                                            Account Summary
                                        </Typography>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    color: COLORS.textPrimary,
                                                    fontSize: '0.8125rem',
                                                    fontWeight: 500
                                                }}
                                            >
                                                {accountType === "REAL" ? "Real" : "Demo"} Account
                                            </Typography>
                                            <Box sx={{ flex: 1 }} />
                                            <Chip
                                                label={active === "Open positions" ? "Open View" : "Closed View"}
                                                size="small"
                                                color={active === "Open positions" ? "success" : "info"}
                                                sx={{
                                                    height: '22px',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 600,
                                                    backgroundColor: alpha(
                                                        active === "Open positions" 
                                                            ? COLORS.success 
                                                            : COLORS.info, 
                                                        0.15
                                                    )
                                                }}
                                            />
                                        </Stack>
                                    </Box>
                                </Box>
                            </Stack>
                        </Box>
                    </Stack>
                </Paper>
  
                {/* Table Section - Dark Theme Container */}
                <Paper 
                    elevation={0}
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '12px',
                        backgroundColor: COLORS.paper,
                        border: `1px solid ${COLORS.border}`,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                        overflow: 'hidden',
                        minHeight: '400px',
                    }}
                >
                    {/* Table Header */}
                    <Box
                        sx={{
                            p: 2.5,
                            borderBottom: `1px solid ${COLORS.border}`,
                            backgroundColor: COLORS.tableHeaderBg,
                        }}
                    >
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Box>
                                <Typography 
                                    variant="h6" 
                                    fontWeight={600}
                                    sx={{ 
                                        color: COLORS.textPrimary,
                                        fontSize: '1.125rem'
                                    }}
                                >
                                    {active === "Open positions" ? "Open Positions" : "Closed Orders"}
                                </Typography>
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        color: COLORS.textSecondary,
                                        fontSize: '0.75rem',
                                        mt: 0.5,
                                        display: 'block'
                                    }}
                                >
                                    {active === "Open positions" 
                                        ? 'Live positions from your trading account' 
                                        : 'Historical order data from your account'
                                    }
                                </Typography>
                            </Box>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Chip
                                    label={accountType === "REAL" ? "Real" : "Demo"}
                                    size="small"
                                    color={accountType === "REAL" ? "primary" : "info"}
                                    sx={{
                                        fontWeight: 600,
                                        backgroundColor: alpha(
                                            accountType === "REAL" ? COLORS.primary : COLORS.info, 
                                            0.1
                                        )
                                    }}
                                />
                                <Chip
                                    label={isTableDataLoading ? "Loading..." : `${(positionData || closedOrders)?.length || 0} records`}
                                    size="small"
                                    color={isTableDataLoading ? "warning" : "default"}
                                    variant="outlined"
                                    sx={{
                                        fontWeight: 500,
                                        borderColor: isTableDataLoading ? COLORS.warning : COLORS.border,
                                        color: isTableDataLoading ? COLORS.warning : COLORS.textSecondary
                                    }}
                                />
                            </Stack>
                        </Stack>
                    </Box>
  
                    {/* Table Content */}
                    <Box sx={{ flex: 1, overflow: 'auto' }}>
                        <OrderHistoryTable
                            data={active === "Open positions" ? positionData : closedOrders}
                            activeTab={active}
                            isLoading={isTableDataLoading}
                            accountType={accountType}
                            selectedAccount={login ? login : MT5Account}
                            // Pass dark theme colors to table
                            tableProps={{
                                sx: {
                                    backgroundColor: 'transparent',
                                    '& .MuiTableHead-root': {
                                        backgroundColor: COLORS.tableHeaderBg,
                                    },
                                    '& .MuiTableCell-head': {
                                        color: COLORS.textSecondary,
                                        fontWeight: 600,
                                        borderBottom: `1px solid ${COLORS.border}`,
                                    },
                                    '& .MuiTableBody-root': {
                                        '& .MuiTableRow-root': {
                                            backgroundColor: COLORS.tableRowBg,
                                            '&:nth-of-type(even)': {
                                                backgroundColor: alpha(COLORS.tableRowHoverBg, 0.5),
                                            },
                                            '&:hover': {
                                                backgroundColor: COLORS.tableRowHoverBg,
                                            },
                                        },
                                    },
                                    '& .MuiTableCell-body': {
                                        color: COLORS.textPrimary,
                                        borderBottom: `1px solid ${COLORS.border}`,
                                    },
                                    '& .MuiTableRow-root': {
                                        '&:last-child td': {
                                            borderBottom: 0,
                                        },
                                    },
                                }
                            }}
                        />
                    </Box>
  
                    {/* Table Footer */}
                    {!isTableDataLoading && (
                        <Box
                            sx={{
                                p: 2,
                                borderTop: `1px solid ${COLORS.border}`,
                                backgroundColor: COLORS.tableHeaderBg,
                            }}
                        >
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        color: COLORS.textSecondary,
                                        fontSize: '0.75rem'
                                    }}
                                >
                                    Account: {login ? login : MT5Account}
                                </Typography>
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        color: COLORS.textSecondary,
                                        fontSize: '0.75rem'
                                    }}
                                >
                                    Last updated: {new Date().toLocaleTimeString()}
                                </Typography>
                            </Stack>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Container>
    );
  }
  
  export default OrderHistory;