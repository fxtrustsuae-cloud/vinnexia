import { Button, InputLabel, Typography, List, ListItem, Stack, OutlinedInput, InputAdornment, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { setNotification } from "../../globalState/notificationState/notificationStateSlice";
import { useResetPasswordMutation } from "../../globalState/auth/authApis";
import { useNavigate } from "react-router-dom";
import { setTempToken } from "../../globalState/auth/authSlice";

// Color palette from your logo
const COLORS = {
  accentGold: "#7E6233",
  whiteMain: "#FEFEFE",
  blackDark: "#11191E",
  greyLight: "#CACDCC",
  greyMedium: "#B3B6B6",
  greyDark: "#848F94",
};

export const enterNewPasswordSchema = z.object({
    newPassword: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(15, "Password must be at most 15 characters")
        .regex(/[a-z]/, "Must include at least one lowercase letter")
        .regex(/[A-Z]/, "Must include at least one uppercase letter")
        .regex(/\d/, "Must include at least one number")
        .regex(/[^a-zA-Z0-9]/, "Must include at least one special character"),
    cnfPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.cnfPassword, {
    path: ["cnfPassword"],
    message: "Passwords do not match",
});


function EnterNewPassword() {

    const [password, setPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState(false);

    const handleClickPassword = () => setPassword((show) => !show);
    const handleClickConfirmPassword = () => setConfirmPassword((show) => !show);

    const defaultValues = {
        newPassword: "",
        cnfPassword: ""
    };

    const { register, watch, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(enterNewPasswordSchema),
        defaultValues: defaultValues
    });

    const passwordValue = watch("newPassword");

    const isLengthValid = passwordValue?.length >= 8 && passwordValue.length <= 15;
    const hasUpperLower = /[a-z]/.test(passwordValue) && /[A-Z]/.test(passwordValue);
    const hasNumber = /\d/.test(passwordValue);
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(passwordValue);

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const onSubmit = async (data) => {

        try {

            const response = await resetPassword(data).unwrap();

            if (response?.status) {
                navigate("/accounts/signIn")
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                dispatch(setTempToken(null))
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
            <Stack spacing={1}>
                <Typography sx={{ 
                    fontSize: "1.7rem", 
                    fontWeight: "700",
                    color: COLORS.accentGold 
                }}>
                    Reset Password
                </Typography>
                <Typography sx={{ 
                    fontWeight: "bold",
                    color: COLORS.whiteMain 
                }}>
                    Enter a new password twice
                </Typography>
            </Stack>
            
            <Grid container spacing={2} mt={"1rem"}>
                <Grid size={{ xs: 12 }}>
                    <InputLabel sx={{ 
                        mb: ".5rem", 
                        fontSize: "14px",
                        fontWeight: 500,
                        color: COLORS.whiteMain 
                    }}>
                        New Password
                    </InputLabel>
                    <OutlinedInput
                        size="small"
                        fullWidth
                        {...register("newPassword", { required: true })}
                        type={password ? 'text' : 'password'}
                        sx={{
                            backgroundColor: "#2a2f34",
                            borderRadius: 1,
                            color: COLORS.whiteMain,
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: COLORS.greyDark,
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: COLORS.accentGold,
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: COLORS.accentGold,
                            },
                        }}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={`toggle visibility`}
                                    onClick={handleClickPassword}
                                    edge="end"
                                    sx={{
                                        color: COLORS.greyLight,
                                        '&:hover': {
                                            color: COLORS.accentGold,
                                            backgroundColor: 'transparent'
                                        }
                                    }}
                                >
                                    {password ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <Stack sx={{ flexDirection: "row", justifyContent: "space-between", mt: 1 }}>
                        <List sx={{ listStyleType: "disc", pl: 2, py: 0 }}>
                            <ListItem sx={{ display: "list-item", p: 0 }}>
                                <Typography
                                    sx={{
                                        fontSize: "12px",
                                        color: isLengthValid ? "#4caf50" : "#ff6b6b",
                                    }}
                                >
                                    Between 8–15 characters
                                </Typography>
                            </ListItem>
                            <ListItem sx={{ display: "list-item", p: 0 }}>
                                <Typography
                                    sx={{
                                        fontSize: "12px",
                                        color: hasUpperLower ? "#4caf50" : "#ff6b6b",
                                    }}
                                >
                                    At least one upper and one lower case letter
                                </Typography>
                            </ListItem>
                            <ListItem sx={{ display: "list-item", p: 0 }}>
                                <Typography
                                    sx={{
                                        fontSize: "12px",
                                        color: hasNumber ? "#4caf50" : "#ff6b6b",
                                    }}
                                >
                                    At least one number
                                </Typography>
                            </ListItem>
                            <ListItem sx={{ display: "list-item", p: 0 }}>
                                <Typography
                                    sx={{
                                        fontSize: "12px",
                                        color: hasSpecialChar ? "#4caf50" : "#ff6b6b",
                                    }}
                                >
                                    At least one special character
                                </Typography>
                            </ListItem>
                        </List>
                        <Typography sx={{ 
                            color: COLORS.greyMedium,
                            fontWeight: 500 
                        }}>
                            {
                                [isLengthValid, hasUpperLower, hasNumber, hasSpecialChar].filter(Boolean)
                                    .length
                            }/4
                        </Typography>
                    </Stack>
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <InputLabel sx={{ 
                        mb: ".5rem", 
                        fontSize: "14px",
                        fontWeight: 500,
                        color: COLORS.whiteMain 
                    }}>
                        Confirm New Password
                    </InputLabel>
                    <OutlinedInput
                        size="small"
                        {...register("cnfPassword", { required: true })}
                        fullWidth
                        type={confirmPassword ? 'text' : 'password'}
                        sx={{
                            backgroundColor: "#2a2f34",
                            borderRadius: 1,
                            color: COLORS.whiteMain,
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: COLORS.greyDark,
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: COLORS.accentGold,
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: COLORS.accentGold,
                            },
                        }}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={`toggle visibility`}
                                    onClick={handleClickConfirmPassword}
                                    edge="end"
                                    sx={{
                                        color: COLORS.greyLight,
                                        '&:hover': {
                                            color: COLORS.accentGold,
                                            backgroundColor: 'transparent'
                                        }
                                    }}
                                >
                                    {confirmPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    {errors.cnfPassword && (
                        <Typography sx={{ 
                            color: "#ff6b6b", 
                            fontSize: "12px",
                            mt: 0.5 
                        }}>
                            {errors.cnfPassword.message}
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
                    mt: "2rem",
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
                {isLoading ? "Changing Password..." : "Change Password"}
            </Button>
        </Stack>
    )
}

export default EnterNewPassword;