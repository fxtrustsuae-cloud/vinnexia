import { Box, Container, Stack, Typography, useTheme } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import OpenAccountForm from "./OpenAccountForm";
import SelectedPlanTypeAndDetails from "./SelectedPlanTypeAndDetails";
import Grid from "@mui/material/Grid2";

function OpenAccountFormLayout() {
    const theme = useTheme();
    const { selectedTheme } = useSelector(state => state.themeMode);

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
            {/* Back button and title */}
            <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                <Link 
                    to="/client/newAccount" 
                    style={{ 
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.04)",
                        color: theme.palette.mode === "dark" ? "white" : theme.palette.text.primary,
                        textDecoration: "none",
                        transition: "all 0.2s",
                        "&:hover": {
                            backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.08)"
                        }
                    }}
                >
                    <ArrowBackIcon />
                </Link>
                <Typography variant="h4" fontWeight="700">
                    Open New Account
                </Typography>
            </Stack>

            {/* Main content grid */}
            <Grid container spacing={4}>
                {/* Form section */}
                <Grid size={{ xs: 12, lg: 7 }}>
                    <Box
                        sx={{
                            p: { xs: 3, md: 4 },
                            borderRadius: 2,
                            bgcolor: "background.paper",
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: theme.shadows[1]
                        }}
                    >
                        <OpenAccountForm />
                    </Box>
                </Grid>

                {/* Details sidebar */}
                <Grid size={{ xs: 12, lg: 5 }}>
                    <Box
                        sx={{
                            p: { xs: 3, md: 4 },
                            borderRadius: 2,
                            bgcolor: "background.paper",
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: theme.shadows[1],
                            height: "100%",
                            position: "sticky",
                            top: 20
                        }}
                    >
                        <Typography variant="h6" fontWeight="600" mb={3}>
                            Account Details
                        </Typography>
                        <SelectedPlanTypeAndDetails />
                    </Box>
                </Grid>
            </Grid>

            {/* Information Box */}
            <Box
                sx={{
                    display: "flex",
                    p: 3,
                    mt: 4,
                    borderRadius: 2,
                    bgcolor: theme.palette.mode === "dark" ? "primary.dark" : "primary.50",
                    border: `1px solid ${theme.palette.mode === "dark" ? theme.palette.primary.main : theme.palette.primary.light}`
                }}
            >
                <InfoOutlinedIcon 
                    sx={{ 
                        color: theme.palette.primary.main,
                        mt: 0.5,
                        mr: 1.5
                    }} 
                />
                <Typography variant="body2" color="text.primary">
                    Detailed information on our instruments and trading conditions can be found on the{" "}
                    <Typography 
                        component={Link}
                        to="/contract-specifications"
                        sx={{ 
                            color: "primary.main",
                            textDecoration: "none",
                            fontWeight: 600,
                            "&:hover": {
                                textDecoration: "underline"
                            }
                        }}
                    >
                        Contract Specifications
                    </Typography>{" "}
                    page.
                </Typography>
            </Box>
        </Container>
    );
}

export default OpenAccountFormLayout;