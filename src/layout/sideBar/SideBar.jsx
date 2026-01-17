import { Drawer, Stack, Divider } from "@mui/material";
import AccountDetails from "../accountDetails/AccountDetails";
import WalletDetails from "../walletDetails/WalletDetails";
import RecursiveNavigation from "../dashboardLayout/RecursiveNavigation";
import { getNavigationConfig } from "../dashboardLayout/Navigation";

// Color palette from your logo
const COLORS = {
  accentGold: "#7E6233",
  whiteMain: "#FEFEFE",
  blackDark: "#11191E",
  greyLight: "#CACDCC",
  greyMedium: "#B3B6B6",
  greyDark: "#848F94",
};

function SideBar({ sidebarRef, sidebarOpen, isLgDown, setSidebarOpen, drawerWidth, isMdDown, selectedTheme, isMobile, isIbOrSubIb }) {

    const NAVIGATION = getNavigationConfig(isIbOrSubIb);

    return (
        <Drawer
            ref={sidebarRef}
            variant={isLgDown && sidebarOpen ? "temporary" : "permanent"}
            open
            onClose={() => setSidebarOpen(false)}
            ModalProps={{
                keepMounted: true,
            }}
            sx={{
                width: sidebarOpen ? drawerWidth : isMdDown ? 0 : 60,
                transition: "width 0.5s ease",
                "& .MuiDrawer-paper": {
                    width: sidebarOpen ? drawerWidth : isMdDown ? 0 : 60,
                    overflowX: "hidden",
                    transition: "width 0.5s ease",
                    bgcolor: COLORS.blackDark,
                    color: COLORS.whiteMain,
                    textAlign: "center",
                    position: "fixed",
                    top: { xs: "56px", sm: "64px" },
                    height: { xs: "calc(100vh - 56px)", sm: "calc(100vh - 64px)" },
                    scrollbarWidth: !sidebarOpen && "none",
                    borderRight: `1px solid ${COLORS.greyDark}`,
                },
            }}
        >
            {
                isMobile &&
                <>
                    <Stack
                        sx={{
                            position: "sticky",
                            bottom: 0,
                            bgcolor: COLORS.blackDark,
                            width: "100%",
                            borderBottom: `1px solid ${COLORS.greyDark}`,
                        }}
                    >
                        <AccountDetails />
                    </Stack>
                    <Divider 
                        sx={{
                            borderColor: COLORS.greyDark
                        }}
                    />
                    <WalletDetails
                        sidebarOpen={sidebarOpen}
                        toggleSidebarOpen={setSidebarOpen}
                    />
                    <Divider 
                        sx={{
                            borderColor: COLORS.greyDark
                        }}
                    />
                </>
            }
            <Stack
                sx={{
                    py: "1rem",
                    flexGrow: "1",
                    bgcolor: COLORS.blackDark,
                }}
            >
                <RecursiveNavigation
                    items={NAVIGATION}
                    sidebarOpen={sidebarOpen}
                    toggleSidebarOpen={setSidebarOpen}
                    darkMode={true}
                    // Pass custom colors to RecursiveNavigation for icon styling
                    customColors={COLORS}
                />
            </Stack>
        </Drawer>
    )
}

export default SideBar;