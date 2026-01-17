import { Card, Box, Typography, Button, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import HistoryIcon from "@mui/icons-material/History";
import { useSelector } from "react-redux";
import { useGetUserDataQuery } from "../globalState/userState/userStateApis";
import { Link } from "react-router-dom";

// Color palette from your logo
const COLORS = {
  accentGold: "#7E6233",
  whiteMain: "#FEFEFE",
  blackDark: "#11191E",
  greyLight: "#CACDCC",
  greyMedium: "#B3B6B6",
  greyDark: "#848F94",
  darkBg: "#1a1f24",
  darkGold: "#5a4a28", // Added for better contrast
};

function WalletCard() {
  const { token } = useSelector((state) => state.auth);

  const { data, isLoading } = useGetUserDataQuery(undefined, {
    skip: !token,
    refetchOnMountOrArgChange: true,
  });

  const mainBalance = Number(
    (!isLoading && data?.data?.assetData?.mainBalance) || 0
  ).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  // Gold theme gradients
  const cardBackground = `linear-gradient(135deg, ${COLORS.blackDark} 0%, #2a2f34 40%, #1a1f24 100%)`;
  const balanceCardBackground = `linear-gradient(135deg, ${COLORS.accentGold} 0%, #8f7040 60%, #9a7d4c 100%)`;

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        background: cardBackground,
        color: COLORS.whiteMain,
        position: "relative",
        overflow: "hidden",
        minHeight: "260px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: `1px solid ${COLORS.greyDark}`,
        boxShadow: `0 10px 30px #00000030`,
        "&:before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${COLORS.accentGold}, ${COLORS.whiteMain}, ${COLORS.accentGold}, transparent)`,
        },
        "&:after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, ${COLORS.accentGold}15, transparent 50%)`,
          pointerEvents: "none",
        },
      }}
    >
      {/* Header Section */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3, position: "relative", zIndex: 2 }}
      >
        <Box>
          <Typography
            fontWeight={700}
            fontSize={22}
            sx={{
              lineHeight: 1.2,
              color: COLORS.whiteMain,
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            Flexy
            <Box
              component="span"
              sx={{
                ml: 0.5,
                background: `linear-gradient(90deg, ${COLORS.accentGold}, #8f7040)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Markets
            </Box>
          </Typography>

          <Typography
            variant="body2"
            sx={{
              opacity: 0.7,
              mt: 0.5,
              fontSize: "0.875rem",
              color: COLORS.greyLight,
            }}
          >
            Global Trading Wallet
          </Typography>
        </Box>

        <Button
          component={Link}
          to={"/client/transactions/depositWithdrawList"}
          variant="contained" // Changed from "outlined" to "contained" for better visibility
          startIcon={
            <HistoryIcon
              sx={{
                fontSize: "1rem",
                color: COLORS.whiteMain, // White icon for contrast
              }}
            />
          }
          size="small"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            color: COLORS.whiteMain, // White text
            borderColor: COLORS.accentGold,
            borderWidth: "2px",
            fontWeight: 600, // Bolder weight
            fontSize: "0.8rem",
            py: 0.85,
            px: 1.75,
            minWidth: "auto",
            background: `linear-gradient(135deg, ${COLORS.accentGold}, #8f7040)`, // Solid gold gradient
            position: "relative",
            overflow: "hidden",
            boxShadow: `0 4px 12px ${COLORS.accentGold}50, 0 0 0 1px ${COLORS.accentGold}30`,
            textShadow: "0 1px 2px rgba(0,0,0,0.3)", // Text shadow for better readability
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
            // Add glow effect on hover
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
          }}
        >
          Transaction History
        </Button>
      </Stack>

      {/* Balance Card Section */}
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          borderRadius: 3,
          background: balanceCardBackground,
          color: COLORS.whiteMain,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: `0 8px 32px ${COLORS.accentGold}40, inset 0 0 20px ${COLORS.accentGold}20`,
          position: "relative",
          overflow: "hidden",
          border: `1px solid ${COLORS.accentGold}50`,
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
            pointerEvents: "none",
          },
          "&:after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 50% 50%, ${COLORS.accentGold}20, transparent 60%)`,
            pointerEvents: "none",
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2 }}>
          <Typography
            fontSize={34}
            fontWeight={800}
            sx={{
              lineHeight: 1.2,
              mb: 0.5,
              background: "linear-gradient(180deg, #ffffff, #e0e0e0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {mainBalance} USD
          </Typography>

          <Typography
            variant="body2"
            sx={{
              opacity: 0.9,
              fontSize: "0.875rem",
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            Wallet Balance
          </Typography>
        </Box>

        {/* Buttons Section - FIXED FOR BETTER VISIBILITY */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            mt: 3,
            justifyContent: { xs: "center", sm: "flex-start" },
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Deposit Button - Dark background for contrast */}
          <Button
            startIcon={<AddIcon />}
            component={Link}
            to={"/client/transactions/deposit"}
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              background: `linear-gradient(135deg, ${COLORS.darkGold}, ${COLORS.blackDark})`,
              color: COLORS.whiteMain,
              fontWeight: 700,
              fontSize: "0.875rem",
              px: 3,
              py: 1.2,
              minWidth: "120px",
              boxShadow: `0 4px 15px rgba(0, 0, 0, 0.5), 0 0 20px ${COLORS.accentGold}40`,
              position: "relative",
              overflow: "hidden",
              border: `2px solid ${COLORS.accentGold}`,
              "&:before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
                pointerEvents: "none",
              },
              "&:hover": {
                background: `linear-gradient(135deg, ${COLORS.blackDark}, ${COLORS.darkGold})`,
                boxShadow: `0 6px 25px rgba(0, 0, 0, 0.7), 0 0 30px ${COLORS.accentGold}60`,
                transform: "translateY(-2px)",
                border: `2px solid #8f7040`,
              },
            }}
          >
            Deposit
          </Button>

          {/* Withdraw Button - White background for contrast */}
          <Button
            startIcon={<ArrowOutwardIcon />}
            variant="contained"
            component={Link}
            to={"/client/transactions/withdrawal"}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              background: `linear-gradient(135deg, ${COLORS.whiteMain}, #f5f5f5)`,
              color: COLORS.blackDark,
              fontWeight: 700,
              fontSize: "0.875rem",
              px: 3,
              py: 1.2,
              minWidth: "120px",
              boxShadow: `0 4px 15px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.3)`,
              position: "relative",
              overflow: "hidden",
              border: `2px solid ${COLORS.accentGold}`,
              "&:before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(135deg, transparent, rgba(0, 0, 0, 0.1), transparent)",
                pointerEvents: "none",
              },
              "&:hover": {
                background: `linear-gradient(135deg, #f5f5f5, ${COLORS.whiteMain})`,
                boxShadow: `0 6px 25px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 255, 255, 0.4)`,
                transform: "translateY(-2px)",
                color: COLORS.accentGold,
                border: `2px solid ${COLORS.accentGold}`,
              },
            }}
          >
            Withdraw
          </Button>
        </Stack>
      </Box>
    </Card>
  );
}

export default WalletCard;
