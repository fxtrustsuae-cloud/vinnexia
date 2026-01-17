import { Typography, Box, Container, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Link, useSearchParams } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import VerifyOtp from "./VerifyOtp";
import EnterNewPassword from "./EnterNewPassword";

// Color palette from your logo
const COLORS = {
  accentGold: "#7E6233",
  whiteMain: "#FEFEFE",
  blackDark: "#11191E",
  greyLight: "#CACDCC",
  greyMedium: "#B3B6B6",
  greyDark: "#848F94",
};

const SHORT_BRAND_NAME = import.meta.env.VITE_SHORT_BRAND_NAME || "Our Platform";
const FULL_BRAND_NAME = import.meta.env.VITE_FULL_BRAND_NAME || SHORT_BRAND_NAME;

// Hero section features
const HERO_FEATURES = [
    "🔒 Secure password recovery",
    "⚡ Quick verification process",
    "🔐 End-to-end encryption",
    "📱 Access from any device"
];

function ResetPassword() {

    const [searchParams] = useSearchParams()
    const forgotPasswordStep = searchParams.get('forgotPasswordStep') || "sendOTP"

    const resetPasswordMaping = {
        sendOTP: ForgotPassword,
        verifyOTP: VerifyOtp,
        enterNewPassword: EnterNewPassword
    }

    const stepTitles = {
        sendOTP: "Reset Password",
        verifyOTP: "Verify OTP",
        enterNewPassword: "Create New Password"
    };

    const stepDescriptions = {
        sendOTP: "Enter your email to receive a verification code",
        verifyOTP: "Enter the verification code sent to your email",
        enterNewPassword: "Create a strong new password for your account"
    };

    const ActiveStep = resetPasswordMaping[forgotPasswordStep]

    return (
        <Box sx={{ 
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.blackDark,
            background: `linear-gradient(135deg, ${COLORS.blackDark} 0%, #1a2b3c 100%)`
        }}>
            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center">
                    {/* Left Column - Hero Section */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ 
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            pr: { md: 4 }
                        }}>
                            {/* Brand Logo/Name */}
                            <Typography 
                                variant="h2" 
                                component="h1"
                                fontWeight="800"
                                gutterBottom
                                sx={{
                                    color: COLORS.accentGold,
                                    mb: 2,
                                    fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' }
                                }}
                            >
                                {FULL_BRAND_NAME}
                            </Typography>
                            
                            {/* Hero Description */}
                            <Typography 
                                variant="h6" 
                                color={COLORS.greyLight}
                                sx={{ mb: 4, lineHeight: 1.6 }}
                            >
                                Reset your password securely and regain access to your {SHORT_BRAND_NAME} account. 
                                Our recovery process ensures your account stays protected.
                            </Typography>
                            
                            {/* Features List */}
                            <Box sx={{ mb: 4 }}>
                                <Typography 
                                    variant="h6" 
                                    fontWeight="600" 
                                    gutterBottom
                                    color={COLORS.whiteMain}
                                >
                                    Secure Password Recovery
                                </Typography>
                                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
                                    {HERO_FEATURES.map((feature, index) => (
                                        <Box 
                                            key={index}
                                            sx={{ 
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1.5
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: "50%",
                                                    backgroundColor: COLORS.accentGold,
                                                    flexShrink: 0
                                                }}
                                            />
                                            <Typography 
                                                variant="body1"
                                                color={COLORS.greyLight}
                                            >
                                                {feature}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right Column - Reset Password Form */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper
                            sx={{
                                width: "100%",
                                maxWidth: "450px",
                                borderRadius: 3,
                                overflow: "hidden",
                                ml: { md: "auto" },
                                boxShadow: `0 10px 30px #00000050`,
                                backgroundColor: "#1a1f24",
                                border: `1px solid ${COLORS.greyDark}`
                            }}
                        >
                            {/* Form Header */}
                            <Box sx={{ 
                                p: 3,
                                backgroundColor: COLORS.blackDark,
                                textAlign: "center",
                                borderBottom: `1px solid ${COLORS.greyDark}`
                            }}>
                                <Typography 
                                    variant="h5" 
                                    component="h2"
                                    fontWeight="700"
                                    gutterBottom
                                    color={COLORS.accentGold}
                                >
                                    {stepTitles[forgotPasswordStep]}
                                </Typography>
                                
                                <Typography 
                                    variant="body2" 
                                    color={COLORS.greyLight}
                                    sx={{ mb: 2 }}
                                >
                                    {stepDescriptions[forgotPasswordStep]}
                                </Typography>
                            </Box>

                            {/* Form Content */}
                            <Box sx={{ 
                                p: 3,
                                backgroundColor: "#1a1f24",
                                minHeight: '250px'
                            }}>
                                <ActiveStep />
                            </Box>

                            {/* Form Footer */}
                            <Box 
                                sx={{ 
                                    p: 2.5, 
                                    borderTop: `1px solid ${COLORS.greyDark}`,
                                    backgroundColor: COLORS.blackDark,
                                    textAlign: "center"
                                }}
                            >
                                <Typography variant="body2" color={COLORS.greyLight}>
                                    Remember your password?{" "}
                                    <Typography
                                        component={Link}
                                        to="/accounts/signIn"
                                        variant="body2"
                                        sx={{
                                            color: COLORS.accentGold,
                                            fontWeight: 600,
                                            textDecoration: "none",
                                            '&:hover': {
                                                textDecoration: "underline",
                                                color: "#8f7040"
                                            }
                                        }}
                                    >
                                        Sign in now
                                    </Typography>
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default ResetPassword;