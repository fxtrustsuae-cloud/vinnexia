import { Button, InputLabel, Typography, TextField, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useForgotPasswordSendOTPMutation } from "../../globalState/auth/authApis";
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setNotification } from "../../globalState/notificationState/notificationStateSlice";
import { setEmailOnOTPSent } from "../../globalState/auth/authSlice";
import { setResendOtpCreatedTime, setResendOtpExpiryTime } from "../../globalState/auth/authSlice";
import { useSearchParams } from "react-router-dom";

// Color palette from your logo
const COLORS = {
  accentGold: "#7E6233",
  whiteMain: "#FEFEFE",
  blackDark: "#11191E",
  greyLight: "#CACDCC",
  greyMedium: "#B3B6B6",
  greyDark: "#848F94",
};

export const forgotPasswordSchema = z.object({
    email: z.string().email("Please type a valid email").trim().min(1, "Email is required"),
})

function ForgotPassword() {

    const [searchParams, setSearchParams] = useSearchParams()

    const defaultValues = {
        email: ""
    };

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: defaultValues
    });

    const dispatch = useDispatch()

    const [forgotPasswordSendOTP, { isLoading }] = useForgotPasswordSendOTPMutation();

    const onSubmit = async (data) => {

        try {
            dispatch(setEmailOnOTPSent(data?.email))
            const response = await forgotPasswordSendOTP(data).unwrap();

            if (response?.status) {

                const now = Date.now();
                const expire = now + 2 * 60 * 1000;

                dispatch(setResendOtpCreatedTime(now));
                dispatch(setResendOtpExpiryTime(expire));
                setSearchParams({ forgotPasswordStep: "verifyOTP" })
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
            }

        } catch (data) {
            if (!data?.data?.status) {
                dispatch(setNotification({ open: true, message: data?.data?.message || "Failed to sign in. Please try again later.", severity: "error" }));
            }
        }

    };

    return (
        <Stack
            component={"form"}
            onSubmit={handleSubmit(onSubmit)}
            spacing={3}
        >
            <Typography sx={{ 
                fontSize: "1.7rem", 
                fontWeight: "700", 
                color: COLORS.accentGold 
            }}>
                Reset Password
            </Typography>
            
            <Typography sx={{ 
                color: COLORS.whiteMain,
                fontSize: "14px",
                lineHeight: 1.6
            }}>
                Enter your email address below and we'll send you instructions to reset your password.
            </Typography>
            
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <InputLabel sx={{ 
                        mb: ".5rem", 
                        fontSize: "14px",
                        fontWeight: 500,
                        color: COLORS.whiteMain 
                    }}>
                        Email Address
                    </InputLabel>
                    <TextField 
                        {...register("email", { required: true })} 
                        fullWidth 
                        size="small" 
                        sx={{
                            backgroundColor: "#2a2f34",
                            borderRadius: 1,
                            '& .MuiOutlinedInput-root': {
                                color: COLORS.whiteMain,
                                '& fieldset': {
                                    borderColor: COLORS.greyDark,
                                },
                                '&:hover fieldset': {
                                    borderColor: COLORS.accentGold,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: COLORS.accentGold,
                                },
                            },
                        }}
                    />
                    {errors.email && (
                        <Typography sx={{ 
                            color: "#ff6b6b", 
                            fontSize: "12px",
                            mt: 0.5 
                        }}>
                            {errors.email.message}
                        </Typography>
                    )}
                </Grid>
            </Grid>
            <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={isLoading}
                sx={{
                    mt: "1rem",
                    textTransform: "none",
                    boxShadow: "none",
                    backgroundColor: COLORS.accentGold,
                    color: COLORS.whiteMain,
                    py: ".8rem",
                    fontWeight: 600,
                    fontSize: "16px",
                    borderRadius: 1,
                    "&:hover": {
                        backgroundColor: "#8f7040",
                        boxShadow: "none"
                    },
                    "&:disabled": {
                        backgroundColor: COLORS.greyDark,
                        color: COLORS.greyMedium
                    }
                }}
            >
                {isLoading ? "Sending Instructions..." : "Continue"}
            </Button>
        </Stack>
    )
}

export default ForgotPassword;