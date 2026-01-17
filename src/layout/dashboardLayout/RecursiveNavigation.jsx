import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Collapse,
    Tooltip,
    Stack,
    useMediaQuery
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutThunk } from "../../globalState/auth/authThunk";
import { setNotification } from "../../globalState/notificationState/notificationStateSlice";

// Color palette from your logo
const COLORS = {
  accentGold: "#7E6233",
  whiteMain: "#FEFEFE",
  blackDark: "#11191E",
  greyLight: "#CACDCC",
  greyMedium: "#B3B6B6",
  greyDark: "#848F94",
};

function RecursiveNavigation({ items, sidebarOpen, toggleSidebarOpen, darkMode, customColors }) {

    const colors = customColors || COLORS;
    const location = useLocation();
    const [openSubmenu, setOpenSubmenu] = useState({});
    const isLgDown = useMediaQuery((theme) => theme.breakpoints.down("lg"));

    const hasActiveChild = useCallback(function checkItem(item) {
        if (location.pathname === item.segment) return true;
        if (item.children) {
            return item.children.some(child => checkItem(child));
        }
        return false;
    }, [location.pathname]);

    useEffect(() => {
        const newOpenSubmenu = {};
        items.forEach(item => {
            if (item.children && hasActiveChild(item)) {
                newOpenSubmenu[item.title] = true;
            }
        });
        setOpenSubmenu(newOpenSubmenu);
    }, [location.pathname, items, hasActiveChild]);

    const handleToggleSubmenu = (key, hasChildren) => {
        if (hasChildren && !sidebarOpen) {
            toggleSidebarOpen(true);
        } else if (!hasChildren && isLgDown) {
            toggleSidebarOpen(false);
        }

        setOpenSubmenu((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    const dispatch = useDispatch()

    const handleSignOut = () => {
        dispatch(logoutThunk())
        dispatch(setNotification({ open: true, message: "You have been logged out.", severity: "info" }));
    }

    return (
        <List sx={{ 
            bgcolor: colors.blackDark,
            padding: "0.4rem",
        }}>
            {items.map((item) => {
                const isActive = location.pathname === item.segment;
                const hasChildren = !!item.children;
                const isLink = !!item.segment;
                const isLogout = item.title === "Logout";

                return (
                    <Stack key={item.title} sx={{ px: ".4rem", mb: "0.25rem" }}>
                        <Tooltip title={!sidebarOpen ? item.title : ""} placement="right">
                            <ListItem
                                component={item.external ? "a" : isLink ? Link : "div"}
                                href={item.external ? item.segment : undefined}
                                target={item.external ? "_blank" : undefined}
                                rel={item.external ? "noopener noreferrer" : undefined}
                                to={isLink && !item.external ? item.segment : undefined}
                                onClick={isLogout ? handleSignOut : () => handleToggleSubmenu(item.title, hasChildren)}
                                sx={{
                                    height: "3rem",
                                    cursor: "pointer",
                                    color: isActive ? colors.accentGold : colors.whiteMain,
                                    backgroundColor: isActive ? `${colors.accentGold}20` : "transparent",
                                    borderLeft: isActive ? `3px solid ${colors.accentGold}` : "none",
                                    "&:hover": { 
                                        backgroundColor: `${colors.accentGold}15`,
                                        color: colors.accentGold,
                                    },
                                    borderRadius: '8px',
                                    display: !sidebarOpen && "flex",
                                    alignItems: !sidebarOpen && "center",
                                    justifyContent: !sidebarOpen && "center",
                                    transition: 'all 0.3s ease',
                                    textDecoration: 'none',
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: colors.accentGold, // PERMANENT GOLD - All icons are gold
                                        minWidth: !sidebarOpen ? "auto" : "45px",
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            color: "#8f7040", // Lighter gold on hover
                                        }
                                    }}
                                >
                                    <item.icon />
                                </ListItemIcon>
                                {sidebarOpen && (
                                    <ListItemText 
                                        primary={item.title} 
                                        sx={{
                                            '& .MuiTypography-root': {
                                                color: isActive ? colors.accentGold : colors.whiteMain,
                                                fontWeight: isActive ? 600 : 400,
                                                fontSize: '0.9rem',
                                                transition: 'color 0.3s ease',
                                            }
                                        }}
                                    />
                                )}
                                {hasChildren && sidebarOpen && (
                                    openSubmenu[item.title] ? 
                                        <ExpandLess sx={{ color: colors.accentGold }} /> : // Gold expand icons
                                        <ExpandMore sx={{ color: colors.accentGold }} /> // Gold expand icons
                                )}
                            </ListItem>
                        </Tooltip>
                        {hasChildren && sidebarOpen && (
                            <Collapse in={openSubmenu[item.title]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <RecursiveNavigation
                                        items={item.children}
                                        sidebarOpen={sidebarOpen}
                                        toggleSidebarOpen={toggleSidebarOpen}
                                        darkMode={darkMode}
                                        customColors={colors}
                                    />
                                </List>
                            </Collapse>
                        )}
                    </Stack>
                );
            })}
        </List>
    );
}

export default RecursiveNavigation;