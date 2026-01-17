import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setNotification } from "../globalState/notificationState/notificationStateSlice";
import { logoutThunk } from "../globalState/auth/authThunk";

function TokenExpiryHandler() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { tokenExpTime } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!tokenExpTime) return;

        const currentTime = Math.floor(Date.now() / 1000);
        const timeLeft = tokenExpTime - currentTime;

        const handleTokenExpiry = () => {
            dispatch(logoutThunk());
            dispatch(setNotification({
                open: true,
                message: "Session expired. Please log in again.",
                severity: "info",
            }));
        };

        if (timeLeft <= 0) {
            handleTokenExpiry();
            return;
        }

        const timeout = setTimeout(handleTokenExpiry, timeLeft * 1000);
        return () => clearTimeout(timeout);
    }, [tokenExpTime, dispatch, navigate]);

    return null;
}

export default TokenExpiryHandler;