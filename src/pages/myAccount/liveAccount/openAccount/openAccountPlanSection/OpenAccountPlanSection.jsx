import { useState } from "react";
import {
  Box,
  Container,
  Stack,
  Typography,
  Paper,
  Alert,
  IconButton,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Chip,
  Skeleton,
  Fade
} from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VerifiedIcon from '@mui/icons-material/Verified';
import WarningIcon from '@mui/icons-material/Warning';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ErrorIcon from '@mui/icons-material/Error';
import { Icon } from "@iconify/react";

import OpenAccountPlanCards from "../../../../../components/OpenAccountPlanCards";
import { useGroupListQuery } from "../../../../../globalState/groupState/groupStateApis";
import { mergePlansWithGroups } from "../../../../../utils/mergePlansWithGroups";
import { useGetUserDataQuery } from "../../../../../globalState/userState/userStateApis";

function AccountTypeToggle({ groupType, onChange }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 0.5,
        p: 0.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
        width: 'fit-content',
      }}
    >
      <Box
        component="button"
        onClick={() => onChange("REAL")}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          border: "1px solid",
          borderColor: groupType === "REAL" ? "primary.main" : "transparent",
          borderRadius: 1.5,
          bgcolor: groupType === "REAL" 
            ? theme.palette.mode === 'dark' 
              ? "rgba(25, 118, 210, 0.2)" 
              : "rgba(25, 118, 210, 0.1)"
            : "transparent",
          color: groupType === "REAL" ? "primary.main" : "text.secondary",
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: groupType === "REAL" ? "primary.main" : "divider",
            bgcolor: theme.palette.mode === 'dark' 
              ? "rgba(255, 255, 255, 0.05)" 
              : "rgba(0, 0, 0, 0.02)",
          },
          fontWeight: groupType === "REAL" ? 600 : 400,
          minWidth: 80,
          justifyContent: 'center',
          outline: 'none',
        }}
      >
        <AccountBalanceWalletIcon sx={{ fontSize: 16 }} />
        <Typography variant="caption" fontWeight="inherit">
          Real
        </Typography>
      </Box>
      
      <Box
        component="button"
        onClick={() => onChange("DEMO")}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          border: "1px solid",
          borderColor: groupType === "DEMO" ? "primary.main" : "transparent",
          borderRadius: 1.5,
          bgcolor: groupType === "DEMO" 
            ? theme.palette.mode === 'dark' 
              ? "rgba(25, 118, 210, 0.2)" 
              : "rgba(25, 118, 210, 0.1)"
            : "transparent",
          color: groupType === "DEMO" ? "primary.main" : "text.secondary",
          cursor: "pointer",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: groupType === "DEMO" ? "primary.main" : "divider",
            bgcolor: theme.palette.mode === 'dark' 
              ? "rgba(255, 255, 255, 0.05)" 
              : "rgba(0, 0, 0, 0.02)",
          },
          fontWeight: groupType === "DEMO" ? 600 : 400,
          minWidth: 80,
          justifyContent: 'center',
          outline: 'none',
        }}
      >
        <PlayCircleOutlineIcon sx={{ fontSize: 16 }} />
        <Typography variant="caption" fontWeight="inherit">
          Demo
        </Typography>
      </Box>
    </Box>
  );
}

function VerificationBanner({ groupType, verificationRequired, userDataLoading }) {
  const theme = useTheme();

  if (userDataLoading) {
    return (
      <Skeleton 
        variant="rounded" 
        height={60} 
        sx={{ 
          borderRadius: 2,
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
        }} 
      />
    );
  }

  return (
    <Alert
      severity={verificationRequired ? "success" : "warning"}
      icon={verificationRequired ? <VerifiedIcon /> : <WarningIcon />}
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: verificationRequired ? "success.main" : "warning.main",
        bgcolor: verificationRequired 
          ? theme.palette.mode === 'dark' 
            ? "rgba(56, 142, 60, 0.15)" 
            : "rgba(56, 142, 60, 0.08)"
          : theme.palette.mode === 'dark'
            ? "rgba(245, 124, 0, 0.15)"
            : "rgba(245, 124, 0, 0.08)",
        color: verificationRequired ? "success.main" : "warning.main",
        "& .MuiAlert-icon": {
          color: verificationRequired ? "success.main" : "warning.main"
        },
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
        }
      }}
    >
      <Typography variant="body2" fontWeight={500}>
        {verificationRequired 
          ? `✓ You're verified for ${groupType === "REAL" ? "real" : "demo"} trading`
          : groupType === "REAL"
            ? "Complete KYC verification to open real trading accounts"
            : "Complete basic verification (email & name) for demo accounts"
        }
      </Typography>
      {!verificationRequired && (
        <Typography 
          component={Link} 
          to="/client/verification" 
          variant="caption"
          sx={{
            color: "primary.main",
            textDecoration: "none",
            fontWeight: 500,
            display: "inline-block",
            mt: 0.5,
            "&:hover": {
              textDecoration: "underline"
            }
          }}
        >
          Verify Now →
        </Typography>
      )}
    </Alert>
  );
}

function PlanCountSkeleton() {
  const theme = useTheme();
  return (
    <Skeleton 
      variant="rounded" 
      width={100} 
      height={32}
      sx={{
        borderRadius: 16,
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
      }}
    />
  );
}

function OpenAccountPlanSection() {
  const [groupType, setGroupType] = useState("REAL");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { token } = useSelector((state) => state.auth);

  // Fetch group list
  const { data, isFetching, isError } = useGroupListQuery({
    page: 1,
    sizePerPage: 10,
    search: "",
    type: groupType
  });

  // Fetch user data for verification status
  const { data: userData, isLoading: userDataLoading } = useGetUserDataQuery(undefined, {
    skip: !token,
  });

  const groupList = data?.data?.groupList || [];
  const mergedPlans = mergePlansWithGroups(groupList);
  
  const userDetails = userData?.data?.userData || {};
  const isEmailVerified = !userDataLoading && userDetails.isEmailVerified;
  const isNameRegistered = !userDataLoading && userDetails.name;
  const isKycVerified = !userDataLoading && userDetails.isKycVerified;

  const verificationRequired = groupType === "REAL" 
    ? isKycVerified 
    : !!(isEmailVerified && isNameRegistered);

  const handleAccountTypeChange = (type) => {
    setGroupType(type);
    // Smooth scroll to plans section on mobile
    if (isMobile) {
      setTimeout(() => {
        document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4 }, minHeight: "100vh" }}>
      {/* Header */}
      <Fade in timeout={300}>
        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between" 
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton
              component={Link}
              to="/client/myAccount"
              sx={{
                color: "text.primary",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "primary.light",
                  color: "primary.main"
                },
                transition: "all 0.3s ease"
              }}
              aria-label="Go back"
            >
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography 
                variant="h4" 
                fontWeight={800}
                sx={{ 
                  background: theme.palette.mode === 'dark'
                    ? "linear-gradient(45deg, #fff 30%, #90caf9 90%)"
                    : "linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                Open New Account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Select your preferred trading account type
              </Typography>
            </Box>
          </Stack>
          
          <Chip
            icon={
              <Box 
                sx={{ 
                  width: 20, 
                  height: 20, 
                  ml: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Icon icon="simple-icons:metatrader" width={16} height={16} />
              </Box>
            }
            label="MetaTrader 5"
            color="primary"
            variant="outlined"
            sx={{
              px: 2,
              py: 1.5,
              fontSize: "0.9rem",
              fontWeight: 600,
              borderWidth: 2,
              "& .MuiChip-icon": {
                ml: 0
              }
            }}
          />
        </Stack>
      </Fade>

      {/* Account Type Selection - Compact */}
      <Fade in timeout={500}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Typography variant="body1" fontWeight={600} color="text.primary">
            Account Type:
          </Typography>
          <AccountTypeToggle 
            groupType={groupType} 
            onChange={handleAccountTypeChange} 
          />
        </Stack>
      </Fade>

      {/* Verification Status */}
      <Fade in timeout={700}>
        <Box sx={{ mb: 4 }}>
          <VerificationBanner 
            groupType={groupType} 
            verificationRequired={verificationRequired}
            userDataLoading={userDataLoading}
          />
        </Box>
      </Fade>

      {/* Plans Section */}
      <Paper
        id="plans-section"
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          bgcolor: "background.paper",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: theme.palette.mode === 'dark' 
              ? "0 8px 32px rgba(0, 0, 0, 0.3)"
              : "0 8px 32px rgba(0, 0, 0, 0.08)"
          }
        }}
      >
        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between" 
          spacing={1}
          sx={{ mb: 3 }}
        >
          <Typography 
            variant="h5" 
            fontWeight={700}
            sx={{ 
              color: "text.primary",
              display: "flex",
              alignItems: "center",
              gap: 1
            }}
          >
            Available Plans
            {!isFetching && mergedPlans.length > 0 && (
              <Chip 
                label={`${mergedPlans.length} ${mergedPlans.length === 1 ? 'Plan' : 'Plans'}`}
                size="small"
                color="primary"
                sx={{ 
                  ml: 1,
                  fontWeight: 600 
                }}
              />
            )}
          </Typography>
          
          {isFetching && <PlanCountSkeleton />}
        </Stack>

        {isFetching ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <CircularProgress 
              size={60} 
              thickness={4}
              sx={{ 
                color: "primary.main",
                mb: 2
              }} 
            />
            <Typography color="text.secondary">
              Loading available plans...
            </Typography>
          </Box>
        ) : isError ? (
          <Stack 
            spacing={2} 
            alignItems="center" 
            justifyContent="center" 
            sx={{ py: 8, textAlign: "center" }}
          >
            <ErrorIcon sx={{ fontSize: 80, color: theme.palette.error.main }} />
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Failed to Load Plans
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unable to load trading plans. Please check your connection and try again.
              </Typography>
            </Box>
          </Stack>
        ) : mergedPlans.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)"
              },
              gap: 3,
              py: 1
            }}
          >
            {mergedPlans.map((plan, index) => (
              <Fade in timeout={(index + 1) * 100} key={index}>
                <Box>
                  <OpenAccountPlanCards
                    {...plan}
                    loading={false}
                    width="100%"
                    height="auto"
                    minHeight="430px"
                    planType="MT5"
                    verificationRequired={verificationRequired}
                    verificationRequiredTooltip={
                      groupType === "REAL"
                        ? "Full KYC verification required for real accounts"
                        : "Email and name verification required for demo accounts"
                    }
                  />
                </Box>
              </Fade>
            ))}
          </Box>
        ) : (
          <Stack 
            spacing={2} 
            alignItems="center" 
            justifyContent="center" 
            sx={{ py: 8, textAlign: "center" }}
          >
            <Icon 
              icon="fluent:collections-empty-24-regular" 
              width="120px" 
              color={theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)"}
            />
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                No Plans Found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: "auto" }}>
                {groupType === "REAL"
                  ? "There are currently no real trading plans available. Please check back later or contact support for assistance."
                  : "No demo account plans are available at the moment. Try switching to real accounts or check back later."}
              </Typography>
            </Box>
          </Stack>
        )}
      </Paper>

      {/* Information Banner */}
      <Fade in timeout={900}>
        <Alert
          icon={<InfoOutlinedIcon />}
          severity="info"
          sx={{
            mt: 4,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "info.main",
            bgcolor: theme.palette.mode === 'dark'
              ? "rgba(2, 136, 209, 0.15)"
              : "rgba(2, 136, 209, 0.08)",
            "& .MuiAlert-icon": {
              color: "info.main"
            },
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)"
            }
          }}
        >
          <Typography variant="body2">
            Need more details? Check out our{" "}
            <Typography
              component={Link}
              to="/contract-specifications"
              sx={{
                color: "primary.main",
                textDecoration: "none",
                fontWeight: 600,
                display: "inline",
                "&:hover": {
                  textDecoration: "underline"
                }
              }}
            >
              Contract Specifications
            </Typography>{" "}
            for comprehensive information on trading instruments and conditions.
          </Typography>
        </Alert>
      </Fade>
    </Container>
  );
}

export default OpenAccountPlanSection;