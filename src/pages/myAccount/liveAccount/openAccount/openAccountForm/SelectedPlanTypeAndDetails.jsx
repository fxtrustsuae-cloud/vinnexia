import { Box, Stack, Typography, Divider, useTheme } from "@mui/material";
import { useLocation } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function SelectedPlanTypeAndDetails() {
    const theme = useTheme();
    const { state } = useLocation();

    const features = [
        { label: "Account Type", value: state?.title || "-----" },
        { label: "Spread from", value: state?.features?.spread?.replace(/From\s*/i, "") || "-----" },
        { label: "Commission", value: state?.features?.commission || "-----" },
        { label: "Maximum Leverage", value: state?.leverage ? `${state.leverage / 100}:1` : "-----" },
        { label: "Minimum Deposit", value: state?.minimum_deposit || "-----" },
        { label: "Swap Free", value: state?.swap_free ? "Yes" : "No" }
    ];

    return (
        <Stack spacing={2}>
            <Typography variant="h6" fontWeight="600" color="primary.main">
                {state?.title || "Standard Account"}
            </Typography>
            
            <Divider sx={{ my: 1 }} />
            
            <Stack spacing={2}>
                {features.map((feature, index) => (
                    <Box 
                        key={index}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            p: 1.5,
                            borderRadius: 1,
                            bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                            "&:hover": {
                                bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"
                            }
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            {feature.label}
                        </Typography>
                        <Typography variant="body2" fontWeight="500">
                            {feature.value}
                        </Typography>
                    </Box>
                ))}
            </Stack>
            
            <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" fontWeight="600" mb={1}>
                    Features Included:
                </Typography>
                <Stack spacing={1}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: "success.main" }} />
                        <Typography variant="caption">Access to all trading instruments</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: "success.main" }} />
                        <Typography variant="caption">24/7 Customer Support</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: "success.main" }} />
                        <Typography variant="caption">Advanced Trading Tools</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <CheckCircleIcon sx={{ fontSize: 16, color: "success.main" }} />
                        <Typography variant="caption">Market Analysis</Typography>
                    </Stack>
                </Stack>
            </Box>
            
            <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                    mt: 2, 
                    fontStyle: "italic" 
                }}
            >
                All features are subject to our terms and conditions. Market conditions may affect spreads and commissions.
            </Typography>
        </Stack>
    );
}

export default SelectedPlanTypeAndDetails;