import { OutlinedInput, InputAdornment, IconButton, Button, InputLabel, TextField, Typography, Box, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as z from 'zod';
import { useLogInMutation } from "../../globalState/auth/authApis";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setNotification } from "../../globalState/notificationState/notificationStateSlice"
import { setBanner } from "../../globalState/otherContentState/otherContentStateSlice";
import { initiateAuthSocketConnection } from "../../socketENV/authSocketENV";

// Color palette from your logo
const COLORS = {
  accentGold: "#7E6233",
  whiteMain: "#FEFEFE",
  blackDark: "#11191E",
  greyLight: "#CACDCC",
  greyMedium: "#B3B6B6",
  greyDark: "#848F94",
};

const signinSchema = z.object({
    userName: z.string().trim().min(1, "User name or email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

function SignIn() {

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const defaultValues = {
        userName: "",
        password: ""
    };

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(signinSchema),
        defaultValues: defaultValues
    });

    const socketRef = useRef(null);
    const dispatch = useDispatch()
    const [signIn, { isLoading }] = useLogInMutation();

    const onSubmit = async (data) => {

        try {

            const response = await signIn(data).unwrap();

            if (response?.status) {
                const token = response?.data?.token
                const loggedInUserId = response?.data?.userData?.id
                socketRef.current = initiateAuthSocketConnection({
                    token,
                    dispatch,
                    currentUserId: loggedInUserId
                });
                dispatch(setNotification({ open: true, message: response?.message, severity: "success" }));
                dispatch(setBanner(true))
            }

        } catch (error) {
            if (!error?.data?.status) {
                dispatch(setNotification({ open: true, message: error?.data?.message || "Failed to submit. Please try again later.", severity: "error" }));
            }
        }

    };

    return (
        <Stack
            component={"form"}
            onSubmit={handleSubmit(onSubmit)}
            spacing={2}
        >
            <Grid container size={12} spacing={2}>
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
                        {...register("userName", { required: true })} 
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
                    {errors.userName && (
                        <Typography sx={{ 
                            color: "#ff6b6b", 
                            fontSize: "12px",
                            mt: 0.5 
                        }}>
                            {errors.userName.message}
                        </Typography>
                    )}
                </Grid>
                <Grid size={{ xs: 12 }}>
                    <InputLabel sx={{ 
                        mb: ".5rem", 
                        fontSize: "14px",
                        fontWeight: 500,
                        color: COLORS.whiteMain 
                    }}>
                        Password
                    </InputLabel>
                    <OutlinedInput
                        {...register("password", { required: true })}
                        size='small'
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
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
                                    aria-label={
                                        showPassword ? 'hide the password' : 'display the password'
                                    }
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                    sx={{
                                        color: COLORS.greyLight,
                                        '&:hover': {
                                            color: COLORS.accentGold,
                                            backgroundColor: 'transparent'
                                        }
                                    }}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    {errors.password && (
                        <Typography sx={{ 
                            color: "#ff6b6b", 
                            fontSize: "12px",
                            mt: 0.5 
                        }}>
                            {errors.password.message}
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
                    mt: 3,
                    textTransform: "none",
                    boxShadow: "none",
                    backgroundColor: COLORS.accentGold,
                    color: COLORS.whiteMain,
                    py: 1,
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
                {isLoading ? "Signing In..." : "Continue"}
            </Button>
            <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography 
                    component={Link} 
                    to={"/accounts/resetPassword"} 
                    sx={{ 
                        textDecoration: "none", 
                        color: COLORS.accentGold,
                        fontWeight: 500,
                        fontSize: "14px",
                        '&:hover': {
                            textDecoration: "underline",
                            color: "#8f7040",
                        }
                    }}
                >
                    I forgot my password
                </Typography>
            </Box>
        </Stack>
    );
}

export default SignIn;