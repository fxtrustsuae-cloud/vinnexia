import { Container, Typography, Box, Button, Stack, Paper } from "@mui/material";
import TabComponent from "../../../components/TabComponent";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { lazy, Suspense, useState, useEffect, useRef, useMemo } from "react";
import Loader from "../../../components/Loader";
import TransactionsList from "../../transactions/transactionsList/TransactionsList";
import { initiateMT5AccountDetailsSocketConnection } from "../../../socketENV/MT5AccountDetailsSocketENV";
import { useSelector } from "react-redux";
import OrderHistory from "../../performance/orderHistory/OrderHistory";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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

const MT5AccountsActions = lazy(() => import("./MT5AccountsActions"));

const TABS = {
    MT5AccountAction: "MT5 Account Actions",
    TransactionList: "Transaction History",
    Position: "Position"
};

const PATHS = {
    [TABS.MT5AccountAction]: "MT5AccountAction",
    [TABS.TransactionList]: "TransactionHistory",
    [TABS.Position]: "Position"
};

function MT5AccountsDetails() {
    const { token } = useSelector((state) => state.auth);
    const [activeAccountDetails, setActiveAccountDetails] = useState(null);
    const { id } = useParams();
    const socketRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();

    const getActiveTab = () => {
        return Object.keys(PATHS).find(tab => location.pathname.includes(PATHS[tab])) || TABS.MT5AccountAction;
    };

    const active = getActiveTab();

    function handleOnChange(newAlignment) {
        if (newAlignment) {
            navigate(`/client/MT5AccountsDetails/${PATHS[newAlignment]}/${id}`);
        }
    }

    // Handle back button click
    const handleBack = () => {
        navigate("/client/MT5AccountList");
    };

    useEffect(() => {
        if (!id || !token) return;

        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        socketRef.current = initiateMT5AccountDetailsSocketConnection({
            login: id,
            token,
            accountData
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [id, token]);

    const accountData = (data) => {
        if (data) {
            setActiveAccountDetails(data?.marginDetails ? data?.marginDetails : data);
        }
    }

    const detailsData = useMemo(() => ({
        "Actual leverage": activeAccountDetails ? activeAccountDetails?.MarginLeverage || "- - - - -" : "- - - - -",
        "Free margin": activeAccountDetails ? activeAccountDetails?.MarginFree || "0.00 USD" : "0.00 USD",
        "Unrealized P&L": activeAccountDetails ? activeAccountDetails?.Profit || "0.00 USD" : "0.00 USD",
        "Equity": activeAccountDetails ? activeAccountDetails?.Equity || "0.00 USD" : "0.00 USD",
        "Credit": activeAccountDetails ? activeAccountDetails?.Credit || "0.00 USD" : "0.00 USD"
    }), [activeAccountDetails]);

    return (
        <Container sx={{ 
            py: 3,
            backgroundColor: COLORS.blackDark,
            minHeight: '100vh',
        }}>
            {/* Header with Back Button on Right */}
            <Stack 
                direction="row" 
                justifyContent="space-between" 
                alignItems="center"
                sx={{ mb: 3 }}
            >
                <Typography sx={{ 
                    fontSize: { xs: "1.5rem", sm: "2rem" }, 
                    fontWeight: "700",
                    color: COLORS.accentGold,
                }}>
                    MT5 Accounts Details
                </Typography>
                
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{
                        textTransform: 'none',
                        color: COLORS.accentGold,
                        borderColor: COLORS.accentGold,
                        backgroundColor: `${COLORS.accentGold}10`,
                        '&:hover': {
                            backgroundColor: `${COLORS.accentGold}20`,
                            borderColor: "#8f7040",
                            color: "#8f7040",
                        }
                    }}
                >
                    Back to Accounts
                </Button>
            </Stack>

            <Typography variant="body2" sx={{ 
                mb: 2,
                color: COLORS.greyLight,
            }}>
                Account ID: <strong style={{ color: COLORS.accentGold }}>{id}</strong>
            </Typography>

            {/* Main Container Card */}
            <Paper 
                sx={{ 
                    p: { xs: 2, sm: 3 }, 
                    borderRadius: 2,
                    mb: 3,
                    backgroundColor: COLORS.darkBg,
                    border: `1px solid ${COLORS.greyDark}`,
                    boxShadow: `0 4px 20px #00000020`,
                }}
            >
                <TabComponent
                    items={Object.values(TABS)}
                    active={active}
                    tabSx={{
                        fontSize: "0.9rem",
                        width: { xs: "33%", sm: "auto" },
                        color: COLORS.greyLight,
                        '&.Mui-selected': {
                            color: COLORS.whiteMain,
                            backgroundColor: COLORS.accentGold,
                            fontWeight: 600,
                        },
                        '&:hover': {
                            backgroundColor: `${COLORS.accentGold}20`,
                        }
                    }}
                    containerSx={{
                        backgroundColor: COLORS.blackDark,
                        borderRadius: 1,
                        p: 0.5,
                    }}
                    onChange={(_, newAlignment) => handleOnChange(newAlignment)}
                />
                
                <Suspense fallback={
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        minHeight: '300px' 
                    }}>
                        <Loader />
                    </Box>
                }>
                    {active === TABS.MT5AccountAction && (
                        <Box sx={{ mt: 3 }}>
                            <MT5AccountsActions login={id} detailsData={detailsData} />
                        </Box>
                    )}

                    {active === TABS.TransactionList && (
                        <Box sx={{ 
                            mt: 3,
                            backgroundColor: COLORS.darkBg,
                            borderRadius: 2,
                            p: 2,
                        }}>
                            <TransactionsList marginTop="0" login={id} />
                        </Box>
                    )}

                    {active === TABS.Position && (
                        <Box sx={{ 
                            mt: 3,
                            backgroundColor: COLORS.darkBg,
                            borderRadius: 2,
                            p: 2,
                        }}>
                            <OrderHistory login={id} />
                        </Box>
                    )}
                </Suspense>
            </Paper>
        </Container>
    );
}

export default MT5AccountsDetails;