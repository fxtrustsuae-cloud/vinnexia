import { 
  TextField, 
  Button, 
  InputLabel, 
  List, 
  ListItem, 
  IconButton, 
  OutlinedInput, 
  InputAdornment, 
  Stack, 
  Typography,
  Box,
  FormHelperText,
  LinearProgress,
  useTheme,
  MenuItem,
  Select,
  FormControl
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddMT5AccountMutation } from "../../../../../globalState/mt5State/mt5StateApis";
import { setNotification } from "../../../../../globalState/notificationState/notificationStateSlice";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useLocation, useNavigate } from "react-router-dom";
import { useGetUserDataQuery } from "../../../../../globalState/userState/userStateApis";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { openAccountFormSchema } from "./openAccountFormSchema";

function OpenAccountForm() {
  const theme = useTheme();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch();

  // FIX: Get leverage options from state or calculate
  let maxLeverage = state?.leverage / 100 || 0;
  let step = 100;
  let leverageOptions = [];

  // Create leverage options correctly
  if (maxLeverage > 0) {
      for (let i = 1; i <= maxLeverage; i++) {
          leverageOptions.push(step * i);
      }
  } else {
      // Default options if no state
      leverageOptions = [100, 200, 300, 400, 500];
  }

  const [showMainPassword, setShowMainPassword] = useState(false);

  const handleClickShowMainPassword = () => setShowMainPassword((show) => !show);

  const defaultValues = {
      groupId: state?.id,
      Leverage: leverageOptions[0] || 0, // Default to first option
      PassMain: "",
      // PassInvestor: "" // Commented out as in original
  };

  const { 
      register, 
      handleSubmit, 
      reset, 
      watch, 
      setValue, 
      formState: { errors, isSubmitting } 
  } = useForm({
      resolver: zodResolver(openAccountFormSchema),
      defaultValues,
      mode: "onChange"
  });

  const mainPasswordValue = watch("PassMain");
  const selectedLeverage = watch("Leverage");

  // Password validation checks
  const mainPasswordChecks = {
      length: mainPasswordValue?.length >= 8 && mainPasswordValue?.length <= 15,
      upperLower: /[a-z]/.test(mainPasswordValue) && /[A-Z]/.test(mainPasswordValue),
      number: /\d/.test(mainPasswordValue),
      specialChar: /[^a-zA-Z0-9]/.test(mainPasswordValue)
  };

  const mainPasswordStrength = Object.values(mainPasswordChecks).filter(Boolean).length;

  const [addMT5Account] = useAddMT5AccountMutation();
  const { refetch } = useGetUserDataQuery(undefined, {
      skip: !token,
      refetchOnMountOrArgChange: true,
  });

  const onSubmit = async (data) => {
      try {
          const response = await addMT5Account(data).unwrap();
          
          if (response?.status) {
              refetch();
              navigate("/client");
              dispatch(setNotification({ 
                  open: true, 
                  message: response?.message, 
                  severity: "success" 
              }));
              reset(defaultValues);
          }
      } catch (error) {
          dispatch(setNotification({ 
              open: true, 
              message: error?.data?.message || "Failed to submit. Please try again later.", 
              severity: "error" 
          }));
      }
  };

  const PasswordRequirementItem = ({ condition, label, isValid }) => (
      <ListItem sx={{ display: "flex", alignItems: "center", p: 0, mb: 0.5 }}>
          {isValid ? (
              <CheckCircleOutlineIcon sx={{ fontSize: 16, color: "success.main", mr: 1 }} />
          ) : (
              <ErrorOutlineIcon sx={{ fontSize: 16, color: "error.main", mr: 1 }} />
          )}
          <Typography
              variant="caption"
              sx={{
                  color: isValid ? "success.main" : "text.secondary",
              }}
          >
              {label}
          </Typography>
      </ListItem>
  );

  return (
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h6" fontWeight="600" mb={3}>
              Account Configuration
          </Typography>
          
          <Grid container spacing={3}>
              {/* Leverage Selection - FIXED to match original */}
              <Grid size={{ xs: 12 }}>
                  <InputLabel sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}>
                      Max leverage *
                  </InputLabel>
                  <FormControl fullWidth>
                      <Select
                          value={selectedLeverage || leverageOptions[0] || ""}
                          onChange={(e) => setValue("Leverage", parseInt(e.target.value), { shouldValidate: true })}
                          displayEmpty
                          size="small"
                          error={!!errors.Leverage}
                      >
                          {leverageOptions.map((option) => (
                              <MenuItem key={option} value={option}>
                                  {option}
                              </MenuItem>
                          ))}
                      </Select>
                  </FormControl>
                  {errors.Leverage && (
                      <FormHelperText error>
                          {errors.Leverage.message}
                      </FormHelperText>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                      Maximum leverage available for this account type
                  </Typography>
              </Grid>

              {/* Main Password Field */}
              <Grid size={{ xs: 12 }}>
                  <InputLabel sx={{ mb: 1, fontWeight: 500, color: "text.primary" }}>
                      Main password *
                  </InputLabel>
                  <OutlinedInput
                      size="small"
                      fullWidth
                      {...register("PassMain")}
                      type={showMainPassword ? 'text' : 'password'}
                      error={!!errors.PassMain}
                      placeholder="Enter main trading password"
                      endAdornment={
                          <InputAdornment position="end">
                              <IconButton
                                  onClick={handleClickShowMainPassword}
                                  edge="end"
                                  size="small"
                              >
                                  {showMainPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
                              </IconButton>
                          </InputAdornment>
                      }
                  />
                  {errors.PassMain && (
                      <FormHelperText error>
                          {errors.PassMain.message}
                      </FormHelperText>
                  )}

                  {/* Password strength indicator */}
                  {mainPasswordValue && (
                      <Box sx={{ mt: 2 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                              <Typography variant="caption" color="text.secondary">
                                  Password Strength
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                  {mainPasswordStrength}/4
                              </Typography>
                          </Stack>
                          <LinearProgress 
                              variant="determinate" 
                              value={mainPasswordStrength * 25} 
                              sx={{ 
                                  height: 4,
                                  borderRadius: 2,
                                  mb: 2,
                                  backgroundColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                                  "& .MuiLinearProgress-bar": {
                                      backgroundColor: 
                                          mainPasswordStrength === 4 ? "success.main" :
                                          mainPasswordStrength >= 2 ? "warning.main" : "error.main"
                                  }
                              }}
                          />
                      </Box>
                  )}

                  {/* Password requirements */}
                  <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
                          Password must contain:
                      </Typography>
                      <List dense sx={{ p: 0 }}>
                          <PasswordRequirementItem
                              condition="length"
                              label="8-15 characters"
                              isValid={mainPasswordChecks.length}
                          />
                          <PasswordRequirementItem
                              condition="upperLower"
                              label="Upper & lowercase letters"
                              isValid={mainPasswordChecks.upperLower}
                          />
                          <PasswordRequirementItem
                              condition="number"
                              label="At least one number"
                              isValid={mainPasswordChecks.number}
                          />
                          <PasswordRequirementItem
                              condition="specialChar"
                              label="At least one special character"
                              isValid={mainPasswordChecks.specialChar}
                          />
                      </List>
                  </Box>
              </Grid>

              {/* REMOVED Investor Password Field - As in original code */}
              
              {/* Submit Button */}
              <Grid size={{ xs: 12 }}>
                  <Button
                      fullWidth
                      variant="contained"
                      type="submit"
                      disabled={isSubmitting}
                      size="large"
                      sx={{
                          py: 1.5,
                          mt: 2,
                          borderRadius: 2,
                          fontWeight: 600,
                          textTransform: "none",
                          fontSize: "1rem",
                          "&:hover": {
                              transform: "translateY(-1px)",
                              boxShadow: theme.shadows[4]
                          },
                          transition: "all 0.2s"
                      }}
                  >
                      {isSubmitting ? "Creating Account..." : "Create an Account"}
                  </Button>
                  
                  <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      sx={{ 
                          mt: 2, 
                          textAlign: "center", 
                          display: "block" 
                      }}
                  >
                      By creating an account, you agree to our Terms of Service and Privacy Policy.
                  </Typography>
              </Grid>
          </Grid>
      </Box>
  );
}

export default OpenAccountForm;