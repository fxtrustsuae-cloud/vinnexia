import { Stack, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useGetUserDataQuery } from "../../globalState/userState/userStateApis"

// Color palette from your logo
const COLORS = {
  accentGold: "#7E6233",
  whiteMain: "#FEFEFE",
  blackDark: "#11191E",
  greyLight: "#CACDCC",
  greyMedium: "#B3B6B6",
  greyDark: "#848F94",
  darkBg: "#1a1f24",
};

function AccountDetails() {

    const { token } = useSelector((state) => state.auth);
    const { data } = useGetUserDataQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    })

    const userName = data?.data?.userData?.name
    const userEmail = data?.data?.userData?.email

    const accountDetailsData = {
        name: userName || "",
        email: userEmail || "",
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const popperRef = useRef(null);
    const avatarRef = useRef(null);

    const handleClickOutside = (event) => {
        if (
            popperRef.current &&
            !popperRef.current.contains(event.target) &&
            avatarRef.current &&
            !avatarRef.current.contains(event.target)
        ) {
            setAnchorEl(null);
        }
    };

    useEffect(() => {
        if (anchorEl) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [anchorEl]);

    return (
        <Stack
            direction="column"
            sx={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                py: "1rem",
                px: "1rem",
                whiteSpace: "nowrap",
                backgroundColor: COLORS.blackDark,
                borderBottom: `1px solid ${COLORS.greyDark}`,
            }}
        >
            <Stack sx={{ alignItems: "flex-start", width: "100%" }}>
                <Typography 
                    sx={{ 
                        color: COLORS.accentGold,
                        fontWeight: 600,
                        fontSize: "1rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "100%"
                    }}
                >
                    {accountDetailsData.name || "User"}
                </Typography>
                <Typography 
                    variant="body2" 
                    sx={{ 
                        color: COLORS.greyLight,
                        fontSize: "0.8rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "100%"
                    }}
                >
                    {accountDetailsData.email || "user@example.com"}
                </Typography>
            </Stack>
        </Stack>
    );
}

export default AccountDetails;