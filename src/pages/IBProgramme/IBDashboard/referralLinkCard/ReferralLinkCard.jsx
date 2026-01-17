import { 
    Box, 
    Card, 
    Typography, 
    Tooltip, 
    IconButton, 
    useMediaQuery, 
    Stack, 
    Chip,
    LinearProgress,
    Alert,
    Snackbar
  } from '@mui/material'
  import ContentCopyIcon from '@mui/icons-material/ContentCopy'
  import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined'
  import CheckIcon from '@mui/icons-material/Check'
  import ShareIcon from '@mui/icons-material/Share'
  import { useGetUserDataQuery } from '../../../../globalState/userState/userStateApis'
  import { useSelector } from 'react-redux'
  import { useState } from 'react'
  
  const IB_REFERAAL_LINK = import.meta.env.VITE_IB_REFERAAL_LINK
  
  function ReferralLinkCard() {
    const [copied, setCopied] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const { selectedTheme } = useSelector((state) => state.themeMode)
    const isMobile = useMediaQuery('(max-width:600px)')
    const { token } = useSelector((state) => state.auth)
    
    const { data, isLoading: userDataLoading } = useGetUserDataQuery(undefined, {
      skip: !token,
      refetchOnMountOrArgChange: true,
    })
  
    const userName = data?.data?.userData?.userName
    const referralLink = `${IB_REFERAAL_LINK}?referralCode=${userName}`
  
    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(referralLink)
        setCopied(true)
        setShowSuccess(true)
        setTimeout(() => {
          setCopied(false)
        }, 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  
    const truncateLink = (link) => {
      if (!link) return ''
      if (isMobile && link.length > 25) {
        return `${link.substring(0, 22)}...`
      }
      if (link.length > 40) {
        return `${link.substring(0, 37)}...`
      }
      return link
    }
  
    if (userDataLoading) {
      return (
        <Card
          sx={{
            width: '100%',
            height: '80px',
            borderRadius: '12px',
            bgcolor: selectedTheme === 'dark' ? 'grey.900' : '#ffffff',
            boxShadow: selectedTheme === 'dark' 
              ? '0 2px 8px rgba(0,0,0,0.15)' 
              : '0 1px 4px rgba(0,0,0,0.08)',
            p: 2,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <LinearProgress sx={{ height: 4 }} />
        </Card>
      )
    }
  
    if (!userName) {
      return null
    }
  
    return (
      <>
        <Card
          sx={{
            width: '100%',
            borderRadius: '10px',
            bgcolor: selectedTheme === 'dark' ? 'grey.900' : '#ffffff',
            boxShadow: selectedTheme === 'dark' 
              ? '0 2px 8px rgba(0,0,0,0.15)' 
              : '0 1px 4px rgba(0,0,0,0.08)',
            p: { xs: 1.5, sm: 2 },
            position: 'relative',
            overflow: 'hidden',
            border: selectedTheme === 'dark' ? '1px solid' : 'none',
            borderColor: 'grey.800',
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: selectedTheme === 'dark' 
                ? '0 3px 12px rgba(0,0,0,0.2)' 
                : '0 2px 8px rgba(0,0,0,0.12)',
            },
          }}
        >
          {/* Compact Header Section */}
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={1.5} 
            sx={{ mb: 1.5 }}
          >
            <Box
              sx={{
                bgcolor: 'primary.main',
                borderRadius: '50%',
                p: 0.75,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <ShareIcon sx={{ fontSize: { xs: 16, sm: 18 }, color: 'white' }} />
            </Box>
            
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant={isMobile ? "body2" : "subtitle2"} 
                fontWeight={600} 
                color="text.primary"
                noWrap
              >
                Your Referral Link
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ display: 'block', lineHeight: 1.2 }}
              >
                Share to earn rewards
              </Typography>
            </Box>
            
            <Chip
              label="Active"
              size="small"
              color="success"
              sx={{
                fontSize: '0.65rem',
                height: 20,
                px: 0.5,
              }}
            />
          </Stack>
  
          {/* Compact Link Display */}
          <Stack 
            direction="row" 
            alignItems="center" 
            spacing={1} 
            sx={{ 
              mb: 1,
              bgcolor: selectedTheme === 'dark' ? 'grey.800' : 'grey.50',
              borderRadius: '6px',
              p: 1,
              border: '1px solid',
              borderColor: selectedTheme === 'dark' ? 'grey.700' : 'grey.200',
            }}
          >
            <LinkOutlinedIcon 
              sx={{ 
                fontSize: 16, 
                color: 'text.secondary',
                flexShrink: 0,
              }} 
            />
            
            <Typography
              variant={isMobile ? "caption" : "body2"}
              sx={{
                fontFamily: 'monospace',
                color: 'text.primary',
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                px: 0.5,
              }}
            >
              {truncateLink(referralLink)}
            </Typography>
            
            <Tooltip 
              title={copied ? "Copied!" : "Copy link"} 
              arrow
              placement="top"
            >
              <IconButton
                onClick={handleCopy}
                size="small"
                sx={{
                  bgcolor: copied ? 'success.main' : 'primary.main',
                  color: 'white',
                  p: 0.5,
                  minWidth: 28,
                  height: 28,
                  '&:hover': {
                    bgcolor: copied ? 'success.dark' : 'primary.dark',
                  },
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                }}
              >
                {copied ? (
                  <CheckIcon sx={{ fontSize: 14 }} />
                ) : (
                  <ContentCopyIcon sx={{ fontSize: 14 }} />
                )}
              </IconButton>
            </Tooltip>
          </Stack>
  
          {/* Compact Footer */}
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center"
            sx={{ mt: 0.5 }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: '0.7rem',
                opacity: 0.8,
              }}
            >
              Click copy to share
            </Typography>
            
            <Typography
              variant="caption"
              color="primary.main"
              fontWeight={500}
              sx={{
                fontSize: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                gap: 0.25,
              }}
            >
              @{userName}
            </Typography>
          </Stack>
  
          {/* Subtle Decorative Element */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 40,
              height: 40,
              bgcolor: 'primary.light',
              opacity: 0.08,
              borderRadius: '0 10px 0 30%',
            }}
          />
        </Card>
  
        {/* Success Notification */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={2000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setShowSuccess(false)}
            severity="success"
            variant="filled"
            sx={{ 
              width: '100%',
              fontSize: '0.875rem',
              py: 0.5,
            }}
            icon={<CheckIcon fontSize="small" />}
          >
            Link copied!
          </Alert>
        </Snackbar>
      </>
    )
  }
  
  export default ReferralLinkCard