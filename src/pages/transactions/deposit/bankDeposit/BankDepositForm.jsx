import { 
    Button, 
    Stack, 
    Typography, 
    TextField, 
    InputLabel, 
    Box, 
    Paper,
    CircularProgress,
    Alert,
    Divider,
    alpha,
    IconButton
} from '@mui/material'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../../../globalState/notificationState/notificationStateSlice';
import { useBankDepositMutation } from '../../../../globalState/userState/userStateApis';
import { bankDepositFormschema } from './bankDepositFormschema';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ReceiptIcon from '@mui/icons-material/Receipt';
import NotesIcon from '@mui/icons-material/Notes';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import { useState } from 'react';
import styled from '@emotion/styled';

// Dark theme color palette
const COLORS = {
  // Dark background colors
  background: '#121212',
  paper: '#1e1e1e',
  cardHeaderBg: '#2d2d2d',
  
  // Text colors for dark theme
  textPrimary: '#ffffff',
  textSecondary: '#b0b0b0',
  textDisabled: '#666666',
  
  // Border and divider colors
  border: '#333333',
  borderLight: '#404040',
  divider: '#2a2a2a',
  
  // Primary accent color (gold)
  primary: '#7E6233',
  primaryDark: '#5A4724',
  primaryLight: '#A68B5C',
  
  // Secondary colors
  secondary: '#3a7bd5',
  info: '#2196f3',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  
  // Additional colors
  white: '#ffffff',
  black: '#11191E',
};

// Styled file upload button - hidden visually but accessible
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function BankDepositForm() {
    const dispatch = useDispatch();
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('');

    const defaultValues = {
        transactionReference: "",
        amount: "",
        remark: "",
        image: null,
    };

    const { 
        register, 
        handleSubmit, 
        reset, 
        watch, 
        setValue, 
        formState: { errors, isValid } 
    } = useForm({
        resolver: zodResolver(bankDepositFormschema),
        defaultValues,
        mode: 'onChange'
    });

    const [bankDeposit, { isLoading, isError, error }] = useBankDepositMutation();

    const onSubmit = async (data) => {
        try {
            const response = await bankDeposit(data).unwrap();
            if (response?.status) {
                dispatch(setNotification({ 
                    open: true, 
                    message: "Deposit request submitted successfully!", 
                    severity: "success" 
                }));
                reset(defaultValues);
                setSelectedFile(null);
                setFileName('');
            }
        } catch (error) {
            if (!error?.data?.status) {
                dispatch(setNotification({ 
                    open: true, 
                    message: error?.data?.message || "Failed to submit. Please try again.", 
                    severity: "error" 
                }));
            }
        }
    };

    const amount = watch("amount");
    const formattedAmount = amount ? parseFloat(amount).toFixed(2) : "0.00";

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                dispatch(setNotification({
                    open: true,
                    message: "File size should be less than 5MB",
                    severity: "error"
                }));
                return;
            }

            // Check file type
            const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            if (!validTypes.includes(file.type)) {
                dispatch(setNotification({
                    open: true,
                    message: "Only JPEG, PNG, and PDF files are allowed",
                    severity: "error"
                }));
                return;
            }

            setSelectedFile(URL.createObjectURL(file));
            setFileName(file.name);
            setValue("image", file, { shouldValidate: true });
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFileName('');
        setValue("image", null, { shouldValidate: true });
    };

    const getFileIcon = (fileName) => {
        if (fileName?.toLowerCase().endsWith('.pdf')) {
            return <PictureAsPdfIcon sx={{ color: COLORS.error }} />;
        }
        return <ImageIcon sx={{ color: COLORS.primary }} />;
    };

    return (
        <Stack
            component={"form"}
            onSubmit={handleSubmit(onSubmit)}
            spacing={3}
        >
            {/* Error Alert */}
            {isError && error?.data?.message && (
                <Alert 
                    severity="error" 
                    sx={{ 
                        borderRadius: 2,
                        backgroundColor: alpha(COLORS.error, 0.1),
                        color: COLORS.textPrimary,
                        border: `1px solid ${alpha(COLORS.error, 0.3)}`,
                        '& .MuiAlert-icon': { 
                            alignItems: 'center',
                            color: COLORS.error
                        }
                    }}
                    icon={<ErrorOutlineIcon />}
                >
                    {error.data.message}
                </Alert>
            )}

            {/* Amount Field */}
            <Box>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                    <Box sx={{ 
                        p: 0.5,
                        borderRadius: 1,
                        backgroundColor: alpha(COLORS.primary, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <AttachMoneyIcon sx={{ 
                            color: COLORS.primary,
                            fontSize: '1.25rem'
                        }} />
                    </Box>
                    <InputLabel 
                        sx={{ 
                            fontWeight: 600,
                            color: COLORS.textPrimary,
                            fontSize: '0.875rem'
                        }}
                    >
                        Amount (USD) *
                    </InputLabel>
                </Stack>
                <TextField 
                    {...register("amount")}
                    size='small' 
                    fullWidth 
                    placeholder="Enter amount in USD" 
                    variant="outlined"
                    type="number"
                    inputProps={{ 
                        min: 0,
                        step: "0.01"
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            backgroundColor: alpha(COLORS.background, 0.5),
                            '&:hover': {
                                backgroundColor: alpha(COLORS.background, 0.7),
                            },
                            '&.Mui-focused': {
                                backgroundColor: alpha(COLORS.background, 0.8),
                            },
                            '& input': {
                                color: COLORS.textPrimary,
                            }
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: COLORS.border,
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: COLORS.primary,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: COLORS.primary,
                        }
                    }}
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                />
            </Box>

            {/* File Upload Section */}
            <Box>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                    <Box sx={{ 
                        p: 0.5,
                        borderRadius: 1,
                        backgroundColor: alpha(COLORS.primary, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <UploadFileIcon sx={{ 
                            color: COLORS.primary,
                            fontSize: '1.25rem'
                        }} />
                    </Box>
                    <InputLabel 
                        sx={{ 
                            fontWeight: 600,
                            color: COLORS.textPrimary,
                            fontSize: '0.875rem'
                        }}
                    >
                        Upload Deposit Proof *
                    </InputLabel>
                </Stack>

                {/* File Upload Button */}
                {!selectedFile ? (
                    <Box>
                        <Button
                            component="label"
                            variant="outlined"
                            fullWidth
                            sx={{
                                py: 3,
                                borderRadius: 2,
                                border: `2px dashed ${alpha(COLORS.primary, 0.4)}`,
                                backgroundColor: alpha(COLORS.background, 0.3),
                                '&:hover': {
                                    border: `2px dashed ${COLORS.primary}`,
                                    backgroundColor: alpha(COLORS.primary, 0.1),
                                }
                            }}
                        >
                            <Stack alignItems="center" spacing={2}>
                                <CloudUploadIcon sx={{ 
                                    fontSize: 48, 
                                    color: COLORS.primary,
                                    opacity: 0.8
                                }} />
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="subtitle1" fontWeight={600} color={COLORS.textPrimary}>
                                        Click to upload
                                    </Typography>
                                    <Typography variant="caption" color={COLORS.textSecondary} sx={{ mt: 0.5 }}>
                                        Supported formats: JPG, PNG, PDF (Max 5MB)
                                    </Typography>
                                </Box>
                            </Stack>
                            <VisuallyHiddenInput 
                                type="file" 
                                onChange={handleFileChange}
                                accept="image/jpeg,image/png,application/pdf"
                            />
                        </Button>
                    </Box>
                ) : (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: 2,
                            border: `1px solid ${alpha(COLORS.success, 0.4)}`,
                            backgroundColor: alpha(COLORS.background, 0.3),
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={2}>
                            {getFileIcon(fileName)}
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Typography 
                                    variant="body2" 
                                    fontWeight={500}
                                    color={COLORS.textPrimary}
                                    noWrap
                                >
                                    {fileName}
                                </Typography>
                                <Typography variant="caption" color={COLORS.success}>
                                    File uploaded successfully
                                </Typography>
                            </Box>
                            <IconButton
                                size="small"
                                onClick={handleRemoveFile}
                                sx={{
                                    color: COLORS.error,
                                    backgroundColor: alpha(COLORS.error, 0.1),
                                    '&:hover': {
                                        backgroundColor: alpha(COLORS.error, 0.2)
                                    }
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Stack>
                    </Paper>
                )}

                {errors.image && (
                    <Typography color="error" variant="caption" sx={{ mt: 1.5, display: 'block' }}>
                        {errors.image.message}
                    </Typography>
                )}
            </Box>

            {/* Transaction Reference */}
            <Box>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                    <Box sx={{ 
                        p: 0.5,
                        borderRadius: 1,
                        backgroundColor: alpha(COLORS.primary, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <ReceiptIcon sx={{ 
                            color: COLORS.primary,
                            fontSize: '1.25rem'
                        }} />
                    </Box>
                    <InputLabel 
                        sx={{ 
                            fontWeight: 600,
                            color: COLORS.textPrimary,
                            fontSize: '0.875rem'
                        }}
                    >
                        Transaction Reference *
                    </InputLabel>
                </Stack>
                <TextField 
                    {...register("transactionReference")} 
                    size='small' 
                    fullWidth 
                    placeholder="Enter bank transaction reference number" 
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            backgroundColor: alpha(COLORS.background, 0.5),
                            '&:hover': {
                                backgroundColor: alpha(COLORS.background, 0.7),
                            },
                            '&.Mui-focused': {
                                backgroundColor: alpha(COLORS.background, 0.8),
                            },
                            '& input': {
                                color: COLORS.textPrimary,
                            }
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: COLORS.border,
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: COLORS.primary,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: COLORS.primary,
                        }
                    }}
                    error={!!errors.transactionReference}
                    helperText={errors.transactionReference?.message}
                />
            </Box>

            {/* Remark Field */}
            <Box>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                    <Box sx={{ 
                        p: 0.5,
                        borderRadius: 1,
                        backgroundColor: alpha(COLORS.primary, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <NotesIcon sx={{ 
                            color: COLORS.primary,
                            fontSize: '1.25rem'
                        }} />
                    </Box>
                    <InputLabel 
                        sx={{ 
                            fontWeight: 600,
                            color: COLORS.textPrimary,
                            fontSize: '0.875rem'
                        }}
                    >
                        Remarks *
                    </InputLabel>
                </Stack>
                <TextField
                    {...register("remark")}
                    size='small' 
                    multiline 
                    rows={4}
                    fullWidth 
                    placeholder="Enter any additional notes or remarks about this deposit..."
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 1,
                            backgroundColor: alpha(COLORS.background, 0.5),
                            '&:hover': {
                                backgroundColor: alpha(COLORS.background, 0.7),
                            },
                            '&.Mui-focused': {
                                backgroundColor: alpha(COLORS.background, 0.8),
                            },
                            '& textarea': {
                                color: COLORS.textPrimary,
                            }
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: COLORS.border,
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: COLORS.primary,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: COLORS.primary,
                        }
                    }}
                    error={!!errors.remark}
                    helperText={errors.remark?.message}
                />
            </Box>

            {/* Summary Card */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 2,
                    border: `2px solid ${alpha(COLORS.primary, 0.3)}`,
                    backgroundColor: alpha(COLORS.background, 0.5),
                    mt: 1
                }}
            >
                <Typography variant="subtitle2" fontWeight={600} color={COLORS.textSecondary} gutterBottom>
                    Deposit Summary
                </Typography>
                <Divider sx={{ 
                    my: 2,
                    backgroundColor: COLORS.border 
                }} />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" color={COLORS.textSecondary}>
                        Amount to be deposited:
                    </Typography>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h4" fontWeight={700} color={COLORS.primary}>
                            ${formattedAmount}
                        </Typography>
                        <Typography variant="caption" color={COLORS.textSecondary}>
                            {amount ? "USD" : "Enter amount above"}
                        </Typography>
                    </Box>
                </Stack>
                <Box
                    sx={{
                        mt: 2,
                        p: 1.5,
                        borderRadius: 1,
                        backgroundColor: alpha(COLORS.info, 0.08),
                        border: `1px solid ${alpha(COLORS.info, 0.2)}`,
                    }}
                >
                    <Typography variant="caption" color={COLORS.textSecondary}>
                        Funds will be credited to your account within 1-3 business days after verification.
                    </Typography>
                </Box>
            </Paper>

            {/* Submit Button */}
            <Box sx={{ mt: 1 }}>
                <Button
                    type='submit'
                    variant='contained'
                    disabled={isLoading || !isValid}
                    fullWidth
                    size="large"
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                    sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        py: 1.75,
                        fontSize: '1rem',
                        fontWeight: 600,
                        backgroundColor: COLORS.primary,
                        color: COLORS.white,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        '&:hover': {
                            backgroundColor: COLORS.primaryDark,
                            boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                            transform: 'translateY(-2px)'
                        },
                        '&:disabled': {
                            backgroundColor: alpha(COLORS.textDisabled, 0.5),
                            color: alpha(COLORS.textPrimary, 0.5),
                            opacity: 0.7
                        }
                    }}
                >
                    {isLoading ? 'Submitting...' : 'Submit Deposit Request'}
                </Button>
                
                <Typography variant="caption" color={COLORS.textSecondary} sx={{ 
                    mt: 2, 
                    display: 'block', 
                    textAlign: 'center',
                    lineHeight: 1.5
                }}>
                    By submitting, you confirm that you have deposited the exact amount to the provided bank account.
                </Typography>
            </Box>
        </Stack>
    );
}

export default BankDepositForm;