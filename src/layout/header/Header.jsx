import { AppBar, Toolbar, Stack, Tooltip, IconButton, Typography, useMediaQuery, Button, Box } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import WalletMenu from "./WalletMenu";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ProfileMenu from "./ProfileMenu";
import { useGetUserDataQuery } from "../../globalState/userState/userStateApis";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AppsIcon from '@mui/icons-material/Apps';
import MenuComponent from "../../components/MenuComponent";
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import TerminalAccountDetailsMenu from "./TerminalAccountDetailsMenu";
import TerminalSymbolMenu from "./TerminalSymbolMenu";
import ModalComponent from "../../components/ModalComponent";
import TerminalDepositModal from "../../pages/tradingTerminal/TerminalDepositModal";
import TerminalMobileDrawer from "../tradingTerminalLayout/TerminalMobileDrawer";
import TerminalBuySell from "./TerminalBuySell";

const hideHeaderElementsOnRoutes = ["/accounts", "/accounts/*", "/client/kyc", "/terminal"];

const SHORT_BRAND_NAME = import.meta.env.VITE_SHORT_BRAND_NAME;

// Color palette for dark mode (based on your logo)
const COLORS = {
  accentGold: "#7E6233",
  whiteMain: "#FEFEFE",
  blackDark: "#11191E",
  greyLight: "#CACDCC",
  greyMedium: "#B3B6B6",
  greyDark: "#848F94",
  darkBg: "#1a1f24", // Added for card backgrounds
};

function Header({ sidebarOpen, toggleSidebar }) {
    const { selectedSymbol } = useSelector((state) => state.terminal);
    const { token } = useSelector((state) => state.auth);
    const { hideBalance } = useSelector(state => state.profile)
    const { activeMT5AccountType } = useSelector(state => state.mt5)

    const { data, isLoading } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const mainBalance = !isLoading && data?.data?.assetData?.mainBalance

    const Icondata = [
        {
            menu: WalletMenu,
            amt: mainBalance || "0.00",
            tooltip: "Wallet",
            menuIcon: AccountBalanceWalletOutlinedIcon,
            iconColor: COLORS.accentGold
        },
        {
            menu: ProfileMenu,
            tooltip: "Profile",
            menuIcon: AccountCircleOutlinedIcon,
            iconColor: COLORS.accentGold
        },
        { 
            icon: HelpOutlineOutlinedIcon, 
            tooltip: "Help", 
            link: "/client/helpDesk/newTicket",
            iconColor: COLORS.accentGold 
        },
        { 
            icon: NotificationsNoneOutlinedIcon, 
            tooltip: "Notification",
            iconColor: COLORS.accentGold 
        },
    ]

    const location = useLocation();
    
    const shouldHideHeaderItems = hideHeaderElementsOnRoutes.some(path => 
        location.pathname.startsWith(path.replace("/*", ""))
    );

    const isMobile = useMediaQuery('(max-width:600px)');
    const isMobileTerminalHeader = useMediaQuery('(max-width:1024px)');

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 3,
                bgcolor: COLORS.blackDark,
                color: COLORS.whiteMain,
                boxShadow: "none",
                borderBottom: `1px solid ${COLORS.greyDark}`,
            }}
        >
            <Toolbar sx={{ 
                justifyContent: "space-between", 
                height: { xs: "56px", sm: "64px" },
                bgcolor: COLORS.blackDark,
            }}>
                <Stack sx={{ 
                    flexDirection: "row", 
                    alignItems: "center", 
                    gap: 2 
                }}>
                    {!shouldHideHeaderItems && (
                        <Tooltip title={sidebarOpen ? "Collapse menu" : "Expand menu"}>
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={toggleSidebar}
                                sx={{
                                    color: COLORS.accentGold,
                                    '&:hover': {
                                        bgcolor: `${COLORS.accentGold}20`,
                                    }
                                }}
                            >
                                {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
                            </IconButton>
                        </Tooltip>
                    )}
                    
                    <Link to={"/client"}>
                        <img 
                            src={import.meta.env.VITE_BRAND_LOGO_LIGHT} // Assuming you have a light logo for dark background
                            alt="Brand Logo"
                            style={{ 
                                width: "14rem",
                            }}
                        />
                    </Link>
                    
                    {(((location.pathname).includes("/terminal")) && selectedSymbol)
                        &&
                        <Box sx={{ 
                            mx: "10px", 
                            display: "flex", 
                            gap: "1rem",
                            alignItems: "center"
                        }}>
                            <Box sx={{ 
                                position: "relative", 
                                width: "20px", 
                                height: "20px", 
                                ml: "5px" 
                            }}>
                                {selectedSymbol?.img2 && <img
                                    src={selectedSymbol?.img2}
                                    alt="symbol"
                                    width="25px"
                                    height="25px"
                                    style={{
                                        borderRadius: "50%",
                                        position: "absolute",
                                        left: 0,
                                        top: 0
                                    }}
                                />}
                                <img
                                    src={selectedSymbol?.img1}
                                    alt="symbol"
                                    width="25px"
                                    height="25px"
                                    style={{
                                        borderRadius: "50%",
                                        position: "absolute",
                                        right: selectedSymbol?.img2 && "5px",
                                        top: selectedSymbol?.img2 && "5px"
                                    }}
                                />
                            </Box>
                            <Typography sx={{ 
                                fontSize: "1rem",
                                color: COLORS.whiteMain,
                                fontWeight: 500
                            }}>
                                {selectedSymbol?.name}
                            </Typography>
                        </Box>
                    }
                    
                    {(location.pathname).includes("/terminal") && <TerminalSymbolMenu />}
                </Stack>
                
                <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
                    {(!shouldHideHeaderItems && !isMobile) && (
                        <Stack sx={{ flexDirection: "row", gap: 1 }}>
                            {Icondata.filter(menu => menu.menu).map((Item, i) => (
                                <Stack key={i} sx={{ 
                                    flexDirection: "row", 
                                    alignItems: "center",
                                    gap: 1,
                                    mr: 2
                                }}>
                                    <Item.menu 
                                        Icon={Item.menuIcon} 
                                        tooltip={Item.tooltip} 
                                        iconColor={Item.iconColor}
                                    />
                                    {Item.amt && (
                                        <Typography fontWeight={"bold"} sx={{
                                            color: COLORS.accentGold,
                                            fontSize: "0.9rem"
                                        }}>
                                            {hideBalance ? (
                                                <>
                                                    <FiberManualRecordIcon sx={{ 
                                                        fontSize: "10px",
                                                        color: COLORS.accentGold
                                                    }} />
                                                    <FiberManualRecordIcon sx={{ 
                                                        fontSize: "10px",
                                                        color: COLORS.accentGold
                                                    }} />
                                                    <FiberManualRecordIcon sx={{ 
                                                        fontSize: "10px",
                                                        color: COLORS.accentGold
                                                    }} />
                                                    <FiberManualRecordIcon sx={{ 
                                                        fontSize: "10px",
                                                        color: COLORS.accentGold
                                                    }} />
                                                    <FiberManualRecordIcon sx={{ 
                                                        fontSize: "10px",
                                                        color: COLORS.accentGold
                                                    }} />
                                                </>
                                            ) : (
                                                <>
                                                    {Number(Item.amt || 0).toLocaleString(undefined, {
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 2,
                                                    })}
                                                    <Typography component={"span"} ml={"2px"} color={COLORS.whiteMain}>
                                                        USD
                                                    </Typography>
                                                </>
                                            )}
                                        </Typography>
                                    )}
                                </Stack>
                            ))}
                        </Stack>
                    )}
                    
                    {!shouldHideHeaderItems && (
                        <Stack sx={{ flexDirection: "row" }}>
                            {Icondata.filter(icon => icon.icon).map((Item, i) => (
                                <Tooltip title={Item.tooltip} key={i}>
                                    <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
                                        <IconButton 
                                            key={i} 
                                            component={Item.link && Link} 
                                            to={Item?.link}
                                            sx={{
                                                color: COLORS.accentGold, // Gold icons
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    bgcolor: `${COLORS.accentGold}20`,
                                                    color: "#8f7040", // Lighter gold on hover
                                                    transform: 'scale(1.1)',
                                                }
                                            }}
                                        >
                                            <Item.icon />
                                        </IconButton>
                                    </Stack>
                                </Tooltip>
                            ))}
                        </Stack>
                    )}
                    
                    {(location.pathname).includes("/terminal") && (
                        isMobileTerminalHeader ? (
                            <Stack sx={{ 
                                flexDirection: "row", 
                                gap: "20px", 
                                alignItems: "center" 
                            }}>
                                {!isMobile && <TerminalBuySell />}
                                <TerminalMobileDrawer />
                            </Stack>
                        ) : (
                            <Stack sx={{ 
                                flexDirection: "row", 
                                gap: "20px", 
                                alignItems: "center",
                                ml: 2
                            }}>
                                <TerminalAccountDetailsMenu />
                                
                                <MenuComponent
                                    btnContent={<AppsIcon />}
                                    btnSx={{
                                        bgcolor: "transparent",
                                        "&:hover": { 
                                            bgcolor: `${COLORS.accentGold}20`,
                                            transform: 'scale(1.1)',
                                        },
                                        boxShadow: "none !important",
                                        minWidth: "2.5rem",
                                        p: "6px",
                                        color: COLORS.accentGold, // Gold Apps icon
                                        transition: 'all 0.3s ease',
                                    }}
                                    specialMenuData={[
                                        { 
                                            name: "Personal Area", 
                                            icon: DashboardOutlinedIcon, 
                                            link: "/terminal" 
                                        },
                                        { 
                                            name: `${SHORT_BRAND_NAME} Website`, 
                                            icon: DashboardOutlinedIcon, 
                                            link: "/" 
                                        }
                                    ]}
                                />
                                
                                {Icondata
                                    .filter(item => item.tooltip === "Profile")
                                    .map((Item, i) => (
                                        <Item.menu 
                                            key={i} 
                                            Icon={Item.menuIcon} 
                                            tooltip={Item.tooltip} 
                                            iconColor={COLORS.accentGold} // Pass gold color
                                        />
                                    ))
                                }
                                
                                {activeMT5AccountType === "Real" ? (
                                    <Button
                                        component={Link}
                                        to={"/client/transactions/deposit"}
                                        sx={{
                                            bgcolor: COLORS.accentGold,
                                            color: COLORS.whiteMain,
                                            px: "4rem",
                                            py: ".5rem",
                                            fontWeight: 600,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                bgcolor: "#8f7040", // Slightly lighter gold
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 6px 12px ${COLORS.accentGold}40`,
                                            }
                                        }}
                                    >
                                        Deposit
                                    </Button>
                                ) : (
                                    <ModalComponent
                                        btnName={"Deposit"}
                                        Content={TerminalDepositModal}
                                        btnSx={{
                                            bgcolor: COLORS.accentGold,
                                            color: COLORS.whiteMain,
                                            px: "4rem",
                                            py: ".5rem",
                                            boxShadow: "none",
                                            fontWeight: 600,
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                bgcolor: "#8f7040",
                                                transform: 'translateY(-2px)',
                                                boxShadow: `0 6px 12px ${COLORS.accentGold}40`,
                                            }
                                        }}
                                    />
                                )}
                            </Stack>
                        )
                    )}
                </Stack>
            </Toolbar>
        </AppBar>
    )
}

export default Header;