import MetaDeposit from '../../myAccount/liveAccount/accountDetailsAccordian/MetaDeposit';
import MetaWithdraw from '../../myAccount/liveAccount/accountDetailsAccordian/MetaWithdraw';
import Grid from '@mui/material/Grid2';
import { useSelector } from 'react-redux';
import { useGetUserDataQuery } from '../../../globalState/userState/userStateApis';
import ChangeMaxLeverageModalContent from '../../myAccount/liveAccount/account/ChangeMaxLeverageModalContent';
import ChangeMT5PasswordModalDetails from '../../myAccount/ChangeMT5PasswordModalDetails';
import { useLocation } from 'react-router-dom';
import {
  Stack,
  Typography,
  Skeleton,
  useMediaQuery,
  Paper,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  alpha
} from '@mui/material';
import ModalComponent from '../../../components/ModalComponent';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import LeverageIcon from '@mui/icons-material/TrendingFlat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Color palette from your logo
const COLORS = {
  accentGold: "#7E6233",
  whiteMain: "#FEFEFE",
  blackDark: "#11191E",
  greyLight: "#CACDCC",
  greyMedium: "#B3B6B6",
  greyDark: "#848F94",
  darkBg: "#1a1f24",
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
  info: "#2196F3",
};

function MT5AccountsActions({ login, detailsData }) {
  const { state } = useLocation();
  const modalWidth = useMediaQuery('(max-width:600px)');
  const isMobile = useMediaQuery('(max-width:600px)');

  const leverage = state?.group?.leverage;
  const { token } = useSelector((state) => state.auth);
  const { refetch } = useGetUserDataQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  // Metrics configuration with icons - updated for dark theme
  const metricsConfig = {
    "Actual leverage": {
      icon: <LeverageIcon />,
      color: COLORS.accentGold,
      bgColor: `${COLORS.accentGold}20`,
      borderColor: `${COLORS.accentGold}40`,
    },
    "Free margin": {
      icon: <AccountBalanceWalletIcon />,
      color: COLORS.whiteMain,
      bgColor: `${COLORS.accentGold}15`,
      borderColor: `${COLORS.accentGold}30`,
    },
    "Unrealized P&L": {
      icon: <TrendingUpIcon />,
      color: detailsData?.["Unrealized P&L"]?.includes('-') 
        ? COLORS.error 
        : COLORS.success,
      bgColor: detailsData?.["Unrealized P&L"]?.includes('-') 
        ? `${COLORS.error}20` 
        : `${COLORS.success}20`,
      borderColor: detailsData?.["Unrealized P&L"]?.includes('-') 
        ? `${COLORS.error}40` 
        : `${COLORS.success}40`,
    },
    "Equity": {
      icon: <AccountBalanceIcon />,
      color: COLORS.whiteMain,
      bgColor: `${COLORS.accentGold}15`,
      borderColor: `${COLORS.accentGold}30`,
    },
    "Credit": {
      icon: <CreditScoreIcon />,
      color: COLORS.whiteMain,
      bgColor: `${COLORS.accentGold}15`,
      borderColor: `${COLORS.accentGold}30`,
    }
  };

  // Action buttons configuration - updated for dark theme
  const actionButtons = [
    {
      name: "Deposit",
      component: MetaDeposit,
      data: { login, refetch },
      icon: <AccountBalanceWalletIcon />,
      description: "Add funds to your account",
      buttonColor: COLORS.accentGold,
      cardBgColor: `${COLORS.accentGold}10`,
    },
    {
      name: "Withdraw",
      component: MetaWithdraw,
      data: { login, refetch },
      icon: <AccountBalanceWalletIcon />,
      description: "Withdraw funds from your account",
      buttonColor: COLORS.whiteMain,
      cardBgColor: `${COLORS.greyDark}10`,
    },
    {
      name: "Leverage",
      component: ChangeMaxLeverageModalContent,
      data: { login, leverage },
      icon: <LeverageIcon />,
      description: "Adjust your trading leverage",
      buttonColor: COLORS.warning,
      cardBgColor: `${COLORS.warning}10`,
    },
    {
      name: "Main Password",
      component: ChangeMT5PasswordModalDetails,
      data: { login },
      icon: <AccountCircleIcon />,
      description: "Change your account password",
      buttonColor: COLORS.info,
      cardBgColor: `${COLORS.info}10`,
    }
  ];

  return (
    <Box sx={{ 
      width: '100%',
      bgcolor: COLORS.blackDark,
      minHeight: '100vh',
      py: 3,
    }}>
      {/* Account Summary Card */}
      <Paper
        sx={{
          mb: 4,
          borderRadius: 2,
          border: `1px solid ${COLORS.greyDark}`,
          backgroundColor: COLORS.darkBg,
          overflow: 'hidden',
          boxShadow: `0 4px 20px #00000020`,
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: `${COLORS.accentGold}20`,
            borderBottom: `1px solid ${COLORS.greyDark}`
          }}
        >
          <Typography variant="h6" sx={{ 
            fontWeight: 600,
            color: COLORS.accentGold,
          }}>
            Account Summary
          </Typography>
          <Typography variant="body2" sx={{ 
            color: COLORS.greyLight,
          }}>
            Real-time account metrics and balances
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {detailsData ? (
            <Grid container spacing={2}>
              {Object.entries(detailsData).map(([key, value], index) => {
                const config = metricsConfig[key];
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={key}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 2,
                        border: `1px solid ${config?.borderColor || COLORS.greyDark}`,
                        backgroundColor: COLORS.darkBg,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: `0 8px 20px ${COLORS.accentGold}20`,
                          borderColor: COLORS.accentGold,
                        }
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 1.5,
                              backgroundColor: config?.bgColor,
                              color: config?.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: `1px solid ${config?.borderColor}`,
                            }}
                          >
                            {config?.icon}
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              fontSize: '0.875rem',
                              color: COLORS.greyLight,
                            }}
                          >
                            {key}
                          </Typography>
                        </Stack>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: config?.color,
                            fontSize: '1.1rem',
                            textAlign: 'center',
                            textShadow: config?.color === COLORS.accentGold ? `0 1px 2px ${COLORS.accentGold}30` : 'none',
                          }}
                        >
                          {value}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            // Skeleton loading state
            <Grid container spacing={2}>
              {[1, 2, 3, 4, 5].map((item) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={item}>
                  <Card sx={{ 
                    height: '100%', 
                    borderRadius: 2,
                    bgcolor: COLORS.darkBg,
                    border: `1px solid ${COLORS.greyDark}`,
                  }}>
                    <CardContent sx={{ p: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                        <Skeleton 
                          variant="circular" 
                          width={40} 
                          height={40} 
                          sx={{ bgcolor: COLORS.greyDark }}
                        />
                        <Skeleton 
                          variant="text" 
                          width={80} 
                          height={24} 
                          sx={{ bgcolor: COLORS.greyDark }}
                        />
                      </Stack>
                      <Skeleton 
                        variant="text" 
                        width="100%" 
                        height={32} 
                        sx={{ bgcolor: COLORS.greyDark }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Paper>

      {/* Account Actions Section */}
      <Paper
        sx={{
          borderRadius: 2,
          border: `1px solid ${COLORS.greyDark}`,
          backgroundColor: COLORS.darkBg,
          overflow: 'hidden',
          boxShadow: `0 4px 20px #00000020`,
        }}
      >
        <Box
          sx={{
            p: 2,
            backgroundColor: `${COLORS.accentGold}20`,
            borderBottom: `1px solid ${COLORS.greyDark}`
          }}
        >
          <Typography variant="h6" sx={{ 
            fontWeight: 600,
            color: COLORS.accentGold,
          }}>
            Account Management
          </Typography>
          <Typography variant="body2" sx={{ 
            color: COLORS.greyLight,
          }}>
            Manage your account settings and transactions
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Grid container spacing={3}>
            {actionButtons.map((action, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 2,
                    border: `1px solid ${COLORS.greyDark}`,
                    backgroundColor: action.cardBgColor,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 12px 30px ${COLORS.accentGold}30`,
                      borderColor: COLORS.accentGold,
                    }
                  }}
                >
                  <CardContent sx={{ p: 3, height: '100%' }}>
                    <Stack
                      direction="column"
                      alignItems="center"
                      spacing={2}
                      sx={{ height: '100%' }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '50%',
                          backgroundColor: `${action.buttonColor}20`,
                          color: action.buttonColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `2px solid ${action.buttonColor}40`,
                        }}
                      >
                        {action.icon}
                      </Box>
                      
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        textAlign: 'center',
                        color: COLORS.whiteMain,
                      }}>
                        {action.name}
                      </Typography>
                      
                      <Typography
                        variant="body2"
                        sx={{ 
                          textAlign: 'center', 
                          mb: 2,
                          color: COLORS.greyLight,
                        }}
                      >
                        {action.description}
                      </Typography>

                      <Box sx={{ mt: 'auto', width: '100%' }}>
                        <ModalComponent
                          btnName={action.name}
                          Content={action.component}
                          contentData={action.data}
                          modalWidth={modalWidth ? "95%" : 500}
                          fullWidth
                          variant="contained"
                          startIcon={action.icon}
                          sx={{
                            width: '100%',
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            background: action.name === "Deposit" 
                              ? `linear-gradient(135deg, ${COLORS.accentGold}, #8f7040)`
                              : `${action.buttonColor}30`,
                            color: COLORS.whiteMain,
                            border: `1px solid ${action.buttonColor}`,
                            boxShadow: `0 4px 12px ${action.buttonColor}30`,
                            '&:hover': {
                              background: action.name === "Deposit" 
                                ? `linear-gradient(135deg, #8f7040, ${COLORS.accentGold})`
                                : `${action.buttonColor}40`,
                              boxShadow: `0 6px 20px ${action.buttonColor}50`,
                              transform: 'translateY(-2px)',
                            },
                          }}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

export default MT5AccountsActions;