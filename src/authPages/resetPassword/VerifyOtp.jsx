import { Box, Button, Stack, Typography } from "@mui/material";
import OTPInput from "../../components/OTPInput";
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForgotPasswordVerifyOTPMutation } from "../../globalState/auth/authApis";
import { useForm } from "react-hook-form";
import { setNotification } from "../../globalState/notificationState/notificationStateSlice";
import { useRef } from "react";
import { setEmailOnOTPSent, setTempToken } from "../../globalState/auth/authSlice";
import { useForgotPasswordSendOTPMutation } from "../../globalState/auth/authApis";
import useCountdownTimer from "../../hooks/useCountdownTimer";
import { setResendOtpCreatedTime, setResendOtpExpiryTime } from "../../globalState/auth/authSlice";

// Color palette from your logo
const COLORS = {
  accentGold: "#7E6233",
  whiteMain: "#FEFEFE",
  blackDark: "#11191E",
  greyLight: "#CACDCC",
  greyMedium: "#B3B6B6",
  greyDark: "#848F94",
};

function VerifyOtp() {

    const [searchParams, setSearchParams] = useSearchParams()
    const dispatch = useDispatch()

    const { resendOtpCreatedTime: createdTime, resendOtpExpiryTime: expireTime } = useSelector(state => state.auth)

    const timeLeft = useCountdownTimer(createdTime, expireTime, () => {
        dispatch(setResendOtpCreatedTime(null));
        dispatch(setResendOtpExpiryTime(null));
    });

    const isTimedOut = timeLeft <= 0;

    const formatTime = (seconds) => {
        const m = String(Math.floor(seconds / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${m}:${s}`;
    };

    const { emailOnOTPSent } = useSelector(state => state.auth)
    const hasSubmitted = useRef(false);

    const defaultValues = {
        email: emailOnOTPSent,
        otp: ""
    };

    const { handleSubmit, setValue, watch } = useForm({
        defaultValues: defaultValues
    });

    const [forgotPasswordVerifyOTP] = useForgotPasswordVerifyOTPMutation();

    const onSubmit = async (data) => {

        try {

            const response = await forgotPasswordVerifyOTP(data).unwrap();

            if (response?.status) {
                dispatch(setTempToken(response?.data))
                dispatch(setEmailOnOTPSent(""))
                dispatch(setResendOtpCreatedTime(null));
                dispatch(setResendOtpExpiryTime(null));
                setSearchParams({ forgotPasswordStep: "enterNewPassword" })
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
            }

        } catch (error) {
            if (!error?.data?.status) {
                dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
            }
        } finally {
            hasSubmitted.current = false;
        }

    };

    const [forgotPasswordSendOTP] = useForgotPasswordSendOTPMutation();

    const handleResendOtp = async () => {

        try {
            const data = { email: emailOnOTPSent }
            const response = await forgotPasswordSendOTP(data).unwrap();

            if (response?.status) {
                const now = Date.now();
                const expire = now + 2 * 60 * 1000;

                dispatch(setResendOtpCreatedTime(now));
                dispatch(setResendOtpExpiryTime(expire));
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
            }

        } catch (data) {
            if (!data?.data?.status) {
                dispatch(setNotification({ open: true, message: data?.data?.message || "Failed to sign in. Please try again later.", severity: "error" }));
            }
        }

    };

    return (
        <Stack spacing={3}>
            <Box textAlign="center">
                <Typography
                    variant="h5"
                    fontWeight="700"
                    color={COLORS.accentGold}
                    gutterBottom
                >
                    Enter Verification Code
                </Typography>
                <Typography variant="body2" color={COLORS.greyLight}>
                    Sent to: <Box component="span" fontWeight="600">{emailOnOTPSent}</Box>
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                    p: 2,
                    backgroundColor: "#2a2f34",
                    borderRadius: 1.5,
                    border: `1px solid ${COLORS.accentGold}`,
                    mb: 1
                }}
            >
                <CommentOutlinedIcon 
                    sx={{ 
                        color: COLORS.accentGold,
                        fontSize: "20px",
                        mt: 0.25
                    }} 
                />
                <Typography variant="body2" color={COLORS.greyLight}>
                    Enter the 6-digit verification code sent to your email address
                </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <OTPInput
                        value={watch("otp")}
                        onComplete={(value) => {
                            setValue("otp", value);
                            if (!hasSubmitted.current) {
                                hasSubmitted.current = true;
                                handleSubmit(onSubmit)();
                            }
                        }} 
                    />
                </Box>
            </Box>

            <Box sx={{ mt: 3, textAlign: "center" }}>
                {isTimedOut ? (
                    <Typography
                        onClick={handleResendOtp}
                        sx={{
                            cursor: "pointer",
                            color: COLORS.accentGold,
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            '&:hover': {
                                color: "#8f7040",
                                textDecoration: "underline"
                            }
                        }}
                    >
                        Resend Verification Code
                    </Typography>
                ) : (
                    <Typography variant="body2" color={COLORS.greyLight}>
                        Resend in: <Box component="span" fontWeight="600" color={COLORS.accentGold}>{formatTime(timeLeft)}</Box>
                    </Typography>
                )}
            </Box>

            <Button
                variant="contained"
                fullWidth
                onClick={handleSubmit(onSubmit)}
                sx={{
                    mt: 2,
                    py: 1,
                    borderRadius: 1,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "16px",
                    backgroundColor: COLORS.accentGold,
                    color: COLORS.whiteMain,
                    '&:hover': {
                        backgroundColor: "#8f7040",
                        boxShadow: "none"
                    }
                }}
            >
                Verify Code
            </Button>

            <Typography 
                variant="body2" 
                color={COLORS.greyMedium} 
                textAlign="center"
                sx={{ mt: 1 }}
            >
                Code not received?{" "}
                <Typography
                    component={Link}
                    to="#"
                    variant="body2"
                    onClick={handleResendOtp}
                    sx={{
                        color: COLORS.accentGold,
                        fontWeight: 600,
                        textDecoration: "none",
                        cursor: "pointer",
                        '&:hover': {
                            textDecoration: "underline",
                            color: "#8f7040"
                        }
                    }}
                >
                    Try resending
                </Typography>
            </Typography>
        </Stack>
    )
}

export default VerifyOtp;