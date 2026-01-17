import Grid from '@mui/material/Grid2'
import { footerData, footerLinkData } from './footerData';
import { Container, Stack, Typography, Box, Divider, keyframes } from '@mui/material';
import { Link } from 'react-router-dom';

// Color palette from your logo
const COLORS = {
  accentGold: "#7E6233",
  whiteMain: "#FEFEFE",
  blackDark: "#11191E",
  greyLight: "#CACDCC",
  greyMedium: "#B3B6B6",
  greyDark: "#848F94",
};

// Animation keyframes
const pulseAnimation = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

const shimmerAnimation = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const slideInAnimation = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const FULL_BRAND_NAME = import.meta.env.VITE_FULL_BRAND_NAME;

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box 
      component="footer" 
      sx={{ 
        mt: 'auto',
        backgroundColor: COLORS.blackDark,
        borderTop: `1px solid ${COLORS.greyDark}`,
        py: { xs: 4, sm: 6 },
        position: 'relative',
        overflow: 'hidden',
        animation: `${slideInAnimation} 0.8s ease-out`,
      }}
    >
      {/* Animated background elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: `linear-gradient(90deg, transparent, ${COLORS.accentGold}, transparent)`,
        animation: `${shimmerAnimation} 8s linear infinite`,
      }} />
      
      <Box sx={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${COLORS.accentGold}05 0%, transparent 70%)`,
        opacity: 0.5,
      }} />
      
      <Box sx={{
        position: 'absolute',
        bottom: '30%',
        right: '15%',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${COLORS.accentGold}05 0%, transparent 70%)`,
        opacity: 0.3,
      }} />

      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, sm: 6 }}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <Box mb={3} sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="h5" 
                color={COLORS.accentGold}
                fontWeight="700"
                gutterBottom
                sx={{
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-8px',
                    left: 0,
                    width: '50px',
                    height: '3px',
                    background: COLORS.accentGold,
                    borderRadius: '2px',
                    animation: `${pulseAnimation} 2s ease-in-out infinite`,
                  }
                }}
              >
                {FULL_BRAND_NAME}
              </Typography>
              <Stack spacing={2}>
                {footerData.map((item, i) => (
                  <Typography 
                    key={i} 
                    variant="body2" 
                    lineHeight={1.7}
                    maxWidth="70ch"
                    color={COLORS.greyLight}
                    sx={{
                      animation: `${slideInAnimation} 0.5s ease-out ${i * 0.1}s both`,
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography 
              variant="subtitle1" 
              color={COLORS.whiteMain}
              fontWeight="600"
              gutterBottom
              sx={{ 
                position: 'relative', 
                zIndex: 1,
                animation: `${slideInAnimation} 0.5s ease-out`,
              }}
            >
              Quick Links
            </Typography>
            <Stack spacing={1.5}>
              {footerLinkData.map((linkItem, i) => (
                <Typography
                  key={i}
                  component={Link}
                  to={linkItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="body2"
                  sx={{
                    textDecoration: 'none',
                    color: COLORS.greyLight,
                    transition: 'all 0.3s ease',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    display: 'inline-block',
                    animation: `${slideInAnimation} 0.5s ease-out ${i * 0.1}s both`,
                    '&:hover': {
                      color: COLORS.accentGold,
                      backgroundColor: `${COLORS.accentGold}15`,
                      transform: 'translateX(5px)',
                      boxShadow: `0 4px 8px ${COLORS.accentGold}20`,
                    }
                  }}
                >
                  {linkItem.name}
                </Typography>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ 
          my: 4, 
          borderColor: COLORS.greyDark,
          position: 'relative',
          zIndex: 1,
        }} />

        {/* Bottom Section */}
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          sx={{ position: 'relative', zIndex: 1 }}
        >
          {/* Copyright */}
          <Typography 
            variant="body2" 
            color={COLORS.greyMedium}
            sx={{ animation: `${slideInAnimation} 0.6s ease-out` }}
          >
            © {currentYear} {FULL_BRAND_NAME}. All rights reserved.
          </Typography>

          {/* Policy Links */}
          <Stack direction="row" spacing={3}>
            <Typography 
              component="a" 
              href="#" 
              variant="body2" 
              sx={{ 
                color: COLORS.greyMedium,
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                position: 'relative',
                padding: '4px 0',
                '&:hover': { 
                  color: COLORS.accentGold,
                  transform: 'translateY(-2px)',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '0%',
                  height: '2px',
                  background: COLORS.accentGold,
                  transition: 'width 0.3s ease',
                },
                '&:hover::after': {
                  width: '100%',
                }
              }}
            >
              Privacy Policy
            </Typography>
            <Typography 
              component="a" 
              href="#" 
              variant="body2" 
              sx={{ 
                color: COLORS.greyMedium,
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                position: 'relative',
                padding: '4px 0',
                '&:hover': { 
                  color: COLORS.accentGold,
                  transform: 'translateY(-2px)',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '0%',
                  height: '2px',
                  background: COLORS.accentGold,
                  transition: 'width 0.3s ease',
                },
                '&:hover::after': {
                  width: '100%',
                }
              }}
            >
              Terms of Service
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;