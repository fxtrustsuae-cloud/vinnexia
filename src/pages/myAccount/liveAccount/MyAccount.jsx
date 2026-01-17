import { Button, Container, Stack, Typography, Box, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import Account from "./account/Account";
import { Link } from "react-router-dom";
import TabComponent from "../../../components/TabComponent";
import { useGetUserDataQuery } from "../../../globalState/userState/userStateApis";
import Tooltip from "@mui/material/Tooltip";
import { useMt5AccountListQuery } from "../../../globalState/mt5State/mt5StateApis";
import HeroOpenAccountPage from "./heroOpenAccountPage/HeroOpenAccountPage";
import Loader from "../../../components/Loader";
import { useEffect } from "react";
import { setActiveMT5AccountType } from "../../../globalState/mt5State/mt5StateSlice";
import WalletCard from "../../../components/WalletCard";

// Color palette from your logo
const COLORS = {
  accentGold: "#7E6233",
  whiteMain: "#FEFEFE",
  blackDark: "#11191E",
  greyLight: "#CACDCC",
  greyMedium: "#B3B6B6",
  greyDark: "#848F94",
  darkBg: "#1a1f24",
};

function MyAccount() {
  const dispatch = useDispatch();
  const { activeMT5AccountType } = useSelector((state) => state.mt5);
  const { token } = useSelector((state) => state.auth);

  const { data, isLoading } = useGetUserDataQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  const { data: mt5AccountData, isLoading: mt5AccountLoading } =
    useMt5AccountListQuery({
      page: "1",
      rowPerPage: "10",
    });

  const haveDemoMT5Account =
    !mt5AccountLoading &&
    mt5AccountData?.data?.mt5AccountList?.filter(
      (item) => item?.accountType === "DEMO"
    )?.length > 0;
  const haveRealMT5Account =
    !mt5AccountLoading &&
    mt5AccountData?.data?.mt5AccountList?.filter(
      (item) => item?.accountType === "REAL"
    )?.length > 0;

  const isEmailVerified = !isLoading && data?.data?.userData?.isEmailVerified;
  const isMobileVerified = !isLoading && data?.data?.userData?.isMobileVerified;
  const isNameRegistered = !isLoading && data?.data?.userData?.name;
  const levelOneVerification = !!(isEmailVerified && isNameRegistered);

  function handleAccountToggle(newAlignment) {
    if (newAlignment) {
      dispatch(setActiveMT5AccountType(newAlignment));
    }
  }

  function handleAccount(activeMT5AccountType) {
    if (activeMT5AccountType === "Real") {
      return haveRealMT5Account ? <Account /> : <HeroOpenAccountPage />;
    } else {
      return haveDemoMT5Account ? <Account /> : <HeroOpenAccountPage />;
    }
  }

  useEffect(() => {
    if (!activeMT5AccountType) {
      dispatch(setActiveMT5AccountType("Real"));
    }
  }, [dispatch, activeMT5AccountType]);

  return (
    <Stack
      sx={{
        width: "100%",
        bgcolor: COLORS.blackDark,
        minHeight: "100vh",
        py: 3,
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Wallet Card Section */}
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <WalletCard />
        </Box>

        {/* Header with Title and Button */}
        <Stack
          sx={{
            mb: 3,
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              fontWeight: 700,
              lineHeight: 1.2,
              color: COLORS.accentGold,
            }}
          >
            Your Trading Account
          </Typography>

          <Tooltip
            title={
              !levelOneVerification
                ? "Complete level one verification to open an account"
                : ""
            }
            placement="top"
          >
            <Box>
              <Button
                component={Link}
                to={levelOneVerification ? "/client/newAccount" : "#"}
                variant="contained"
                startIcon={
                  <AddIcon
                    sx={{
                      color: COLORS.whiteMain, // White icon
                    }}
                  />
                }
                disabled={!levelOneVerification}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  color: COLORS.whiteMain, // White text
                  borderColor: COLORS.accentGold,
                  borderWidth: "2px",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  py: 1.1,
                  px: 3.5,
                  minWidth: { xs: "100%", sm: "200px" },
                  background: `linear-gradient(135deg, ${COLORS.accentGold}, #8f7040)`, // Gold gradient like Transaction History
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: `0 4px 12px ${COLORS.accentGold}50, 0 0 0 1px ${COLORS.accentGold}30`,
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.15), transparent)",
                    pointerEvents: "none",
                  },
                  "&:hover": {
                    background: `linear-gradient(135deg, #8f7040, ${COLORS.accentGold})`,
                    borderColor: "#9a7d4c",
                    boxShadow: `0 6px 20px ${COLORS.accentGold}70, 0 0 0 1px ${COLORS.accentGold}50`,
                    transform: "translateY(-2px)",
                  },
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      "radial-gradient(circle at center, rgba(255,255,255,0.1), transparent 70%)",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    pointerEvents: "none",
                  },
                  "&:hover:after": {
                    opacity: 1,
                  },
                  "&.Mui-disabled": {
                    background: `linear-gradient(135deg, ${COLORS.greyDark}, ${COLORS.greyMedium})`,
                    color: COLORS.greyLight,
                    border: `1px solid ${COLORS.greyDark}`,
                    boxShadow: "none",
                    "&:hover": {
                      background: `linear-gradient(135deg, ${COLORS.greyDark}, ${COLORS.greyMedium})`,
                      transform: "none",
                      boxShadow: "none",
                    },
                  },
                }}
              >
                Open New Account
              </Button>
            </Box>
          </Tooltip>
        </Stack>

        {/* Tab Component */}
        <Box sx={{ mb: 3 }}>
          <TabComponent
            boxSx={{
              width: "100%",
              maxWidth: { xs: "100%", sm: "400px" },
              bgcolor: COLORS.darkBg,
              borderRadius: 2,
              p: 1,
            }}
            tabSx={{
              color: COLORS.greyLight,
              "&.Mui-selected": {
                color: COLORS.whiteMain,
                bgcolor: COLORS.accentGold,
                fontWeight: 600,
              },
              "&:hover": {
                bgcolor: `${COLORS.accentGold}20`,
              },
              transition: "all 0.3s ease",
            }}
            items={["Real", "Demo"]}
            onChange={(_, newAlignment) => handleAccountToggle(newAlignment)}
            active={activeMT5AccountType}
          />
        </Box>

        {/* Account Content Section */}
        <Box
          sx={{
            mb: 4,
            bgcolor: COLORS.darkBg,
            borderRadius: 2,
            p: { xs: 2, sm: 3 },
            border: `1px solid ${COLORS.greyDark}`,
            boxShadow: `0 4px 12px #00000020`,
          }}
        >
          {isLoading || mt5AccountLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
              }}
            >
              <Loader />
            </Box>
          ) : (
            <Box
              sx={{
                animation: "fadeIn 0.3s ease-in",
                "@keyframes fadeIn": {
                  "0%": { opacity: 0 },
                  "100%": { opacity: 1 },
                },
              }}
            >
              {handleAccount(activeMT5AccountType)}
            </Box>
          )}
        </Box>
      </Container>
    </Stack>
  );
}

export default MyAccount;
