import { Container, Typography, Stack, Box, Paper, Grid, keyframes } from "@mui/material";
import TabComponent from "../components/TabComponent";
import { useNavigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useMemo } from "react";
import Loader from "../components/Loader";

const SignIn = lazy(() => import("./signIn/SignIn"));
const SignUp = lazy(() => import("./signUp/SignUp"));

const TABS = {
    Sign_In: "Sign in",
    Sign_Up: "Create an account",
};

const PATHS = {
    [TABS.Sign_In]: "signIn",
    [TABS.Sign_Up]: "signUp",
};

const COMPONENTS = {
    [TABS.Sign_In]: SignIn,
    [TABS.Sign_Up]: SignUp,
};

const SHORT_BRAND_NAME = import.meta.env.VITE_SHORT_BRAND_NAME;
const FULL_BRAND_NAME = import.meta.env.VITE_FULL_BRAND_NAME || SHORT_BRAND_NAME;

// Color palette based on your logo (gold/beige and white)
const COLORS = {
  accentGold: "#7E6233",
  whiteMain: "#FEFEFE",
  blackDark: "#11191E",
  greyLight: "#CACDCC",
  greyMedium: "#B3B6B6",
  greyDark: "#848F94",
};

// Keyframes for animations
const floatingAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const pulseAnimation = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const shimmerAnimation = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

function Auth() {
    const navigate = useNavigate();
    const location = useLocation();

    const getActiveTab = () => {
        return Object.keys(PATHS).find(tab =>
            location.pathname.toLowerCase().includes(PATHS[tab].toLowerCase())
        ) || TABS.Sign_In;
    };

    const active = getActiveTab();
    const ActiveComponent = useMemo(() => COMPONENTS[active], [active]);

    function handleOnChange(newAlignment) {
        if (newAlignment) {
            navigate(`/accounts/${PATHS[newAlignment]}`);
        }
    }

    return (
        <Box sx={{ 
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: COLORS.blackDark,
            background: `linear-gradient(-45deg, ${COLORS.blackDark}, #1a2b3c, #152238, ${COLORS.blackDark})`,
            backgroundSize: '400% 400%',
            animation: `${gradientAnimation} 15s ease infinite`,
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Animated background elements */}
            <Box sx={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${COLORS.accentGold}10 0%, transparent 70%)`,
                animation: `${floatingAnimation} 20s ease-in-out infinite`,
                zIndex: 0,
            }} />
            
            <Box sx={{
                position: 'absolute',
                bottom: '15%',
                right: '10%',
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${COLORS.accentGold}15 0%, transparent 70%)`,
                animation: `${floatingAnimation} 25s ease-in-out infinite reverse`,
                zIndex: 0,
            }} />
            
            <Box sx={{
                position: 'absolute',
                top: '40%',
                right: '20%',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${COLORS.accentGold}10 0%, transparent 70%)`,
                animation: `${floatingAnimation} 30s ease-in-out infinite`,
                zIndex: 0,
            }} />

            <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
                <Grid container spacing={4} alignItems="center">
                    {/* Left Column - Hero Section with animations */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ 
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            pr: { md: 4 },
                            position: 'relative',
                        }}>
                            {/* Animated decorative line */}
                            <Box sx={{
                                position: 'absolute',
                                top: -20,
                                left: 0,
                                width: '100px',
                                height: '4px',
                                background: `linear-gradient(90deg, transparent, ${COLORS.accentGold}, transparent)`,
                                animation: `${pulseAnimation} 3s ease-in-out infinite`,
                            }} />
                            
                            {/* Brand Logo/Name with animation */}
                            <Typography 
                                variant="h2" 
                                component="h1"
                                fontWeight="800"
                                gutterBottom
                                sx={{
                                    color: COLORS.accentGold,
                                    mb: 2,
                                    fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
                                    position: 'relative',
                                    display: 'inline-block',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: '-10px',
                                        left: 0,
                                        width: '60px',
                                        height: '4px',
                                        background: COLORS.accentGold,
                                        borderRadius: '2px',
                                        animation: `${pulseAnimation} 2s ease-in-out infinite`,
                                    }
                                }}
                            >
                                {FULL_BRAND_NAME}
                            </Typography>
                            
                            {/* Hero Description */}
                            <Typography 
                                variant="h6" 
                                color={COLORS.greyLight}
                                sx={{ 
                                    mb: 4, 
                                    lineHeight: 1.6,
                                    animation: `${pulseAnimation} 5s ease-in-out infinite`,
                                }}
                            >
                                Join thousands of professionals who trust {SHORT_BRAND_NAME} 
                                to streamline their workflow and boost efficiency. 
                                Experience the difference today.
                            </Typography>
                            
                            {/* Features List with hover animations */}
                            <Box sx={{ mb: 4 }}>
                                <Typography 
                                    variant="h6" 
                                    fontWeight="600" 
                                    gutterBottom
                                    color={COLORS.whiteMain}
                                    sx={{
                                        display: 'inline-block',
                                        '&::after': {
                                            content: '""',
                                            display: 'block',
                                            width: '40px',
                                            height: '3px',
                                            background: COLORS.accentGold,
                                            marginTop: '8px',
                                            borderRadius: '2px',
                                            animation: `${pulseAnimation} 3s ease-in-out infinite`,
                                        }
                                    }}
                                >
                                    Why Choose {SHORT_BRAND_NAME}?
                                </Typography>
                                <Stack spacing={1.5}>
                                    {[
                                        "Secure & encrypted data protection",
                                        "Lightning-fast performance",
                                        "Real-time analytics & insights",
                                        "24/7 Professional support"
                                    ].map((feature, index) => (
                                        <Box 
                                            key={index}
                                            sx={{ 
                                                display: "flex", 
                                                alignItems: "center", 
                                                gap: 1.5,
                                                transition: 'all 0.3s ease',
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                '&:hover': {
                                                    backgroundColor: '#2a2f34',
                                                    transform: 'translateX(5px)',
                                                    boxShadow: `0 4px 12px ${COLORS.accentGold}20`,
                                                }
                                            }}
                                        >
                                            <Box sx={{ 
                                                width: 8, 
                                                height: 8, 
                                                borderRadius: "50%", 
                                                backgroundColor: COLORS.accentGold,
                                                animation: `${pulseAnimation} ${2 + index * 0.5}s ease-in-out infinite`,
                                            }} />
                                            <Typography 
                                                variant="body1" 
                                                color={COLORS.greyLight}
                                                sx={{
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        color: COLORS.whiteMain,
                                                    }
                                                }}
                                            >
                                                {feature}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Right Column - Compact Auth Form Card with animations */}
                    <Grid item xs={12} md={6}>
                        <Paper
                            sx={{
                                width: "100%",
                                maxWidth: "450px",
                                borderRadius: 3,
                                overflow: "hidden",
                                ml: { md: "auto" },
                                boxShadow: `0 10px 30px #00000050`,
                                backgroundColor: "#1a1f24",
                                border: `1px solid ${COLORS.greyDark}`,
                                position: 'relative',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: `0 20px 40px #00000070, 0 0 0 1px ${COLORS.accentGold}30`,
                                    transform: 'translateY(-5px)',
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '2px',
                                    background: `linear-gradient(90deg, transparent, ${COLORS.accentGold}, transparent)`,
                                    animation: `${shimmerAnimation} 3s linear infinite`,
                                }
                            }}
                        >
                            {/* Compact Header */}
                            <Box
                                sx={{
                                    p: 3,
                                    backgroundColor: COLORS.blackDark,
                                    textAlign: "center",
                                    borderBottom: `1px solid ${COLORS.greyDark}`,
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                {/* Animated background effect */}
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: `linear-gradient(90deg, transparent 0%, ${COLORS.accentGold}10 50%, transparent 100%)`,
                                    animation: `${shimmerAnimation} 8s linear infinite`,
                                }} />
                                
                                <Typography 
                                    variant="h5" 
                                    component="h2"
                                    fontWeight="700"
                                    gutterBottom
                                    color={COLORS.accentGold}
                                    sx={{ position: 'relative', zIndex: 1 }}
                                >
                                    {active === TABS.Sign_In ? "Welcome Back" : "Get Started"}
                                </Typography>
                                
                                <Typography 
                                    variant="body2" 
                                    color={COLORS.greyLight}
                                    sx={{ mb: 3, position: 'relative', zIndex: 1 }}
                                >
                                    {active === TABS.Sign_In 
                                        ? "Sign in to your account to continue" 
                                        : "Create your account in just a few steps"}
                                </Typography>
                                
                                {/* Compact Tabs */}
                                <Box sx={{ width: "100%", position: 'relative', zIndex: 1 }}>
                                    <TabComponent
                                        items={Object.values(TABS)}
                                        tabSx={{ 
                                            fontSize: "0.875rem", 
                                            py: 1.5,
                                            flex: 1,
                                            minHeight: "42px",
                                            textTransform: "none",
                                            fontWeight: 600,
                                            borderRadius: 1,
                                            color: COLORS.greyLight,
                                            backgroundColor: "#2a2f34",
                                            transition: 'all 0.3s ease',
                                            '&.Mui-selected': {
                                                backgroundColor: COLORS.accentGold,
                                                color: COLORS.whiteMain,
                                                animation: `${pulseAnimation} 2s ease-in-out infinite`,
                                                '&:hover': {
                                                    backgroundColor: "#8f7040",
                                                }
                                            },
                                            '&:hover': {
                                                backgroundColor: "#3a3f44",
                                                transform: 'scale(1.02)',
                                            }
                                        }}
                                        containerSx={{
                                            borderRadius: 2,
                                            overflow: "hidden",
                                            backgroundColor: "#2a2f34",
                                            border: `1px solid ${COLORS.greyDark}`,
                                            padding: '4px',
                                            transition: 'all 0.3s ease',
                                        }}
                                        onChange={(_, newAlignment) => handleOnChange(newAlignment)}
                                        active={active}
                                    />
                                </Box>
                            </Box>

                            {/* Compact Form Content */}
                            <Box sx={{ 
                                p: 3,
                                backgroundColor: "#1a1f24",
                                minHeight: '280px',
                                position: 'relative',
                            }}>
                                <Suspense fallback={
                                    <Box 
                                        display="flex" 
                                        justifyContent="center" 
                                        alignItems="center" 
                                        height="200px"
                                    >
                                        <Loader size="small" />
                                    </Box>
                                }>
                                    {ActiveComponent ? (
                                        <ActiveComponent />
                                    ) : (
                                        <Typography 
                                            color="#ff6b6b" 
                                            textAlign="center"
                                            variant="body2"
                                            py={1}
                                        >
                                            Invalid tab selection
                                        </Typography>
                                    )}
                                </Suspense>
                            </Box>

                            {/* Compact Footer */}
                            <Box 
                                sx={{ 
                                    p: 2, 
                                    borderTop: `1px solid ${COLORS.greyDark}`,
                                    backgroundColor: COLORS.blackDark,
                                    textAlign: "center",
                                    position: 'relative',
                                }}
                            >
                                <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '1px',
                                    background: `linear-gradient(90deg, transparent, ${COLORS.accentGold}, transparent)`,
                                    animation: `${shimmerAnimation} 5s linear infinite`,
                                }} />
                                
                                <Typography variant="body2" color={COLORS.greyLight}>
                                    {active === TABS.Sign_In 
                                        ? "Don't have an account? " 
                                        : "Already have an account? "}
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        onClick={() => handleOnChange(
                                            active === TABS.Sign_In ? TABS.Sign_Up : TABS.Sign_In
                                        )}
                                        sx={{
                                            color: COLORS.accentGold,
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            transition: 'all 0.3s ease',
                                            display: 'inline-block',
                                            '&:hover': {
                                                color: "#8f7040",
                                                textDecoration: "underline",
                                                transform: 'scale(1.05)',
                                            }
                                        }}
                                    >
                                        {active === TABS.Sign_In ? "Sign up" : "Sign in"}
                                    </Typography>
                                </Typography>
                                
                                {/* Security Note */}
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        display: 'block', 
                                        mt: 1,
                                        color: COLORS.greyMedium,
                                        animation: `${pulseAnimation} 4s ease-in-out infinite`,
                                    }}
                                >
                                    🔒 Your data is protected with bank-level security
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default Auth;