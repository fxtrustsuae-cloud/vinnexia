import { Card, Typography, Box, useMediaQuery } from "@mui/material"
import Grid from "@mui/material/Grid2"
import { useSelector } from "react-redux"
import { useGetUserDataQuery } from "../../../../globalState/userState/userStateApis"
import { useGetReferralListQuery } from "../../../../globalState/userState/userStateApis"
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PaidIcon from '@mui/icons-material/Paid'
import SavingsIcon from '@mui/icons-material/Savings'
import PeopleIcon from '@mui/icons-material/People'
import BarChartIcon from '@mui/icons-material/BarChart'

function IBAccountSummaryCards() {
  const { token } = useSelector((state) => state.auth)
  const { selectedTheme } = useSelector((state) => state.themeMode)
  const isMobile = useMediaQuery('(max-width:600px)')

  const { data, isLoading } = useGetUserDataQuery(undefined, {
    skip: !token,
  })

  const { data: listData, isLoading: referralIBLoading } = useGetReferralListQuery()
  const referralListData = listData?.data?.userList || []

  const totalIBIncome = !isLoading && data?.data?.assetData?.totalIBIncome || 0
  const totalIBWithdrawl = !isLoading && data?.data?.assetData?.totalIBWithdrawl || 0
  const availableIBIncome = totalIBIncome - totalIBWithdrawl

  const IBAccountSummaryCardsData = [
    {
      heading: "Income",
      total: totalIBIncome.toFixed(0),
      prefix: "$",
      icon: <TrendingUpIcon sx={{ fontSize: 14 }} />
    },
    {
      heading: "Withdrawn",
      total: totalIBWithdrawl.toFixed(0),
      prefix: "$",
      icon: <PaidIcon sx={{ fontSize: 14 }} />
    },
    {
      heading: "Available",
      total: availableIBIncome.toFixed(0),
      prefix: "$",
      icon: <SavingsIcon sx={{ fontSize: 14 }} />
    },
    {
      heading: "Volume",
      total: "0",
      prefix: "$",
      icon: <BarChartIcon sx={{ fontSize: 14 }} />
    },
    {
      heading: "Clients",
      total: referralListData?.length || "0",
      icon: <PeopleIcon sx={{ fontSize: 14 }} />
    },
  ]

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={1}>
        {IBAccountSummaryCardsData.map((item, index) => (
          <Grid size={{ xs: 2.4 }} key={index}>
            <Card 
              sx={{ 
                borderRadius: "8px",
                bgcolor: selectedTheme === "dark" ? "grey.900" : "#f8f9fa",
                border: `1px solid ${selectedTheme === "dark" ? "grey.800" : "#e9ecef"}`,
                boxShadow: "none",
                p: 1,
                minHeight: 70
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                {/* Icon */}
                <Box sx={{ color: selectedTheme === "dark" ? "grey.400" : "text.secondary" }}>
                  {item.icon}
                </Box>
                
                {/* Value */}
                {(isLoading || referralIBLoading) ? (
                  <Box 
                    sx={{ 
                      width: 40, 
                      height: 12, 
                      bgcolor: selectedTheme === "dark" ? "grey.800" : "grey.300",
                      borderRadius: "2px"
                    }} 
                  />
                ) : (
                  <Typography 
                    variant="body2"
                    fontWeight={600}
                    sx={{ 
                      color: selectedTheme === "dark" ? "white" : "text.primary",
                      fontSize: '0.9rem'
                    }}
                  >
                    {item.prefix}{item.total}
                  </Typography>
                )}
                
                {/* Heading */}
                <Typography 
                  variant="caption"
                  sx={{ 
                    color: selectedTheme === "dark" ? "grey.500" : "text.secondary",
                    fontSize: '0.7rem',
                    textAlign: 'center'
                  }}
                >
                  {item.heading}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default IBAccountSummaryCards