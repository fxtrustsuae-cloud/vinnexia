import { 
    Button, 
    Stack, 
    Typography, 
    TextField, 
    Container, 
    Box, 
    Paper, 
    alpha,
    FormControl,
    MenuItem,
    Select,
    InputLabel,
    FormHelperText
} from '@mui/material'
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useCreateSupportTicketMutation } from '../../../globalState/supportState/supportStateApis';
import { newTicketSchema } from './newTicketSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { setNotification } from "../../../globalState/notificationState/notificationStateSlice"
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import DescriptionIcon from '@mui/icons-material/Description';
import SendIcon from '@mui/icons-material/Send';
import TitleIcon from '@mui/icons-material/Title';
import { useState } from 'react';

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

function NewTicket() {
    const dispatch = useDispatch();

    const defaultValues = {
        subject: "",
        priority: "",
        message: ""
    };

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(newTicketSchema),
        defaultValues,
    });

    const [createSupportTicket, { isLoading }] = useCreateSupportTicketMutation();

    const onSubmit = async (data) => {
        try {
            const response = await createSupportTicket(data).unwrap();
            if (response?.status) {
                dispatch(setNotification({ 
                    open: true, 
                    message: response?.message, 
                    severity: "success" 
                }));
                reset(defaultValues);
            }
        } catch (error) {
            if (!error?.data?.status) {
                dispatch(setNotification({ 
                    open: true, 
                    message: error?.data?.message || "Failed to submit. Please try again later.", 
                    severity: "error" 
                }));
            }
        }
    };

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'LOW': return COLORS.success;
            case 'MEDIUM': return COLORS.warning;
            case 'HIGH': return COLORS.error;
            default: return COLORS.textSecondary;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ 
            py: { xs: 2, md: 3 },
            minHeight: 'calc(100vh - 100px)',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: COLORS.background,
        }}>
            <Box sx={{ width: '100%' }}>
                <Stack 
                    direction={{ xs: 'column', lg: 'row' }} 
                    spacing={{ xs: 3, lg: 4 }}
                    alignItems="flex-start"
                >
                    {/* Left Side - Form */}
                    <Paper 
                        elevation={0}
                        sx={{
                            flex: 1,
                            p: { xs: 3, md: 4 },
                            borderRadius: '16px',
                            backgroundColor: COLORS.paper,
                            border: `1px solid ${COLORS.border}`,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.24)',
                        }}
                    >
                        <Box 
                            component="form" 
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <Stack spacing={3}>
                                {/* Header inside form */}
                                <Stack spacing={1}>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <Box
                                            sx={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '12px',
                                                backgroundColor: alpha(COLORS.primary, 0.1),
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <HelpOutlineIcon 
                                                sx={{ 
                                                    color: COLORS.primary,
                                                    fontSize: '1.8rem'
                                                }} 
                                            />
                                        </Box>
                                        <Box>
                                            <Typography 
                                                variant="h4" 
                                                fontWeight={700}
                                                sx={{ 
                                                    fontSize: { xs: '1.5rem', md: '1.75rem' },
                                                    color: COLORS.textPrimary
                                                }}
                                            >
                                                Create Support Ticket
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    color: COLORS.textSecondary,
                                                    fontSize: { xs: '0.875rem', md: '0.9375rem' }
                                                }}
                                            >
                                                Submit a new support request
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Stack>

                                {/* Title Field */}
                                <Box>
                                    <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                                        <TitleIcon 
                                            sx={{ 
                                                color: COLORS.primary,
                                                fontSize: '1.2rem'
                                            }} 
                                        />
                                        <Typography 
                                            variant="subtitle2" 
                                            fontWeight={600}
                                            sx={{ 
                                                color: COLORS.textPrimary,
                                                fontSize: '0.9375rem'
                                            }}
                                        >
                                            Ticket Title
                                        </Typography>
                                    </Stack>
                                    <TextField
                                        {...register("subject")}
                                        fullWidth
                                        placeholder="What's the issue about?"
                                        variant="outlined"
                                        error={!!errors.subject}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '10px',
                                                backgroundColor: alpha(COLORS.background, 0.4),
                                                '&:hover': {
                                                    backgroundColor: alpha(COLORS.background, 0.6),
                                                },
                                                '&.Mui-focused': {
                                                    backgroundColor: alpha(COLORS.background, 0.7),
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: COLORS.primary,
                                                        borderWidth: '2px'
                                                    }
                                                }
                                            },
                                            '& .MuiOutlinedInput-input': {
                                                color: COLORS.textPrimary,
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: COLORS.border,
                                            },
                                        }}
                                        InputProps={{
                                            sx: {
                                                height: '50px',
                                                fontSize: '0.9375rem'
                                            }
                                        }}
                                    />
                                    {errors.subject && (
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                color: COLORS.error,
                                                mt: 1,
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {errors.subject.message}
                                        </Typography>
                                    )}
                                </Box>

                                {/* Priority Field */}
                                <Box>
                                    <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                                        <PriorityHighIcon 
                                            sx={{ 
                                                color: getPriorityColor(watch("priority")),
                                                fontSize: '1.2rem'
                                            }} 
                                        />
                                        <Typography 
                                            variant="subtitle2" 
                                            fontWeight={600}
                                            sx={{ 
                                                color: COLORS.textPrimary,
                                                fontSize: '0.9375rem'
                                            }}
                                        >
                                            Priority Level
                                        </Typography>
                                    </Stack>
                                    
                                    <FormControl fullWidth error={!!errors.priority}>
                                        <Select
                                            value={watch("priority")}
                                            onChange={(e) => setValue("priority", e.target.value, { shouldValidate: true })}
                                            displayEmpty
                                            sx={{
                                                borderRadius: '10px',
                                                backgroundColor: alpha(COLORS.background, 0.4),
                                                height: '50px',
                                                color: COLORS.textPrimary,
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: errors.priority ? COLORS.error : COLORS.border
                                                },
                                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: errors.priority ? COLORS.error : alpha(COLORS.primary, 0.5)
                                                },
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: errors.priority ? COLORS.error : COLORS.primary,
                                                    borderWidth: '2px'
                                                }
                                            }}
                                            MenuProps={{
                                                PaperProps: {
                                                    sx: {
                                                        borderRadius: '10px',
                                                        marginTop: '8px',
                                                        backgroundColor: COLORS.paper,
                                                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                                                    }
                                                }
                                            }}
                                        >
                                            <MenuItem value="" sx={{ color: COLORS.textSecondary }}>
                                                Select priority level
                                            </MenuItem>
                                            <MenuItem 
                                                value="LOW" 
                                                sx={{ 
                                                    color: COLORS.success,
                                                    fontWeight: 500,
                                                    '&.Mui-selected': {
                                                        backgroundColor: alpha(COLORS.success, 0.1)
                                                    }
                                                }}
                                            >
                                                Low Priority
                                            </MenuItem>
                                            <MenuItem 
                                                value="MEDIUM" 
                                                sx={{ 
                                                    color: COLORS.warning,
                                                    fontWeight: 500,
                                                    '&.Mui-selected': {
                                                        backgroundColor: alpha(COLORS.warning, 0.1)
                                                    }
                                                }}
                                            >
                                                Medium Priority
                                            </MenuItem>
                                            <MenuItem 
                                                value="HIGH" 
                                                sx={{ 
                                                    color: COLORS.error,
                                                    fontWeight: 500,
                                                    '&.Mui-selected': {
                                                        backgroundColor: alpha(COLORS.error, 0.1)
                                                    }
                                                }}
                                            >
                                                High Priority
                                            </MenuItem>
                                        </Select>
                                        {errors.priority && (
                                            <FormHelperText sx={{ color: COLORS.error, fontSize: '0.75rem' }}>
                                                {errors.priority.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Box>

                                {/* Message Field */}
                                <Box>
                                    <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                                        <DescriptionIcon 
                                            sx={{ 
                                                color: COLORS.info,
                                                fontSize: '1.2rem'
                                            }} 
                                        />
                                        <Typography 
                                            variant="subtitle2" 
                                            fontWeight={600}
                                            sx={{ 
                                                color: COLORS.textPrimary,
                                                fontSize: '0.9375rem'
                                            }}
                                        >
                                            Description
                                        </Typography>
                                    </Stack>
                                    <TextField
                                        {...register("message")}
                                        fullWidth
                                        multiline
                                        rows={8}
                                        placeholder="Describe your issue in detail. Include steps to reproduce, error messages, and what you expected to happen."
                                        variant="outlined"
                                        error={!!errors.message}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '10px',
                                                backgroundColor: alpha(COLORS.background, 0.4),
                                                '&:hover': {
                                                    backgroundColor: alpha(COLORS.background, 0.6),
                                                },
                                                '&.Mui-focused': {
                                                    backgroundColor: alpha(COLORS.background, 0.7),
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: COLORS.primary,
                                                        borderWidth: '2px'
                                                    }
                                                }
                                            },
                                            '& .MuiOutlinedInput-input': {
                                                color: COLORS.textPrimary,
                                            },
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: COLORS.border,
                                            },
                                        }}
                                        InputProps={{
                                            sx: {
                                                fontSize: '0.9375rem',
                                                lineHeight: 1.6
                                            }
                                        }}
                                    />
                                    {errors.message && (
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                color: COLORS.error,
                                                mt: 1,
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {errors.message.message}
                                        </Typography>
                                    )}
                                </Box>

                                {/* Submit Button */}
                                <Box sx={{ pt: 1 }}>
                                    <Button
                                        variant='contained'
                                        type='submit'
                                        disabled={isLoading}
                                        startIcon={<SendIcon />}
                                        sx={{
                                            textTransform: "none",
                                            borderRadius: '10px',
                                            py: 1.75,
                                            px: 5,
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            width: { xs: '100%', sm: 'auto' },
                                            minWidth: '160px',
                                            backgroundColor: COLORS.primary,
                                            color: COLORS.white,
                                            '&:hover': {
                                                backgroundColor: COLORS.primaryDark,
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                                            },
                                            '&:active': {
                                                transform: 'translateY(0)'
                                            },
                                            '&.Mui-disabled': {
                                                backgroundColor: alpha(COLORS.textDisabled, 0.5),
                                                color: alpha(COLORS.textPrimary, 0.5)
                                            }
                                        }}
                                    >
                                        {isLoading ? 'Submitting...' : 'Submit Ticket'}
                                    </Button>
                                </Box>
                            </Stack>
                        </Box>
                    </Paper>

                    {/* Right Side - Info */}
                    <Box sx={{ 
                        flex: { lg: 0.6 }, 
                        width: '100%',
                        position: { lg: 'sticky' },
                        top: { lg: 24 }
                    }}>
                        <Stack spacing={3}>
                            {/* Priority Info */}
                            <Paper 
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: '16px',
                                    backgroundColor: alpha(COLORS.primary, 0.08),
                                    border: `1px solid ${alpha(COLORS.primary, 0.2)}`,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                }}
                            >
                                <Typography 
                                    variant="subtitle1" 
                                    fontWeight={600}
                                    sx={{ 
                                        color: COLORS.textPrimary,
                                        mb: 2,
                                        fontSize: '1rem'
                                    }}
                                >
                                    Priority Guidelines
                                </Typography>
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography 
                                            variant="subtitle2" 
                                            sx={{ 
                                                color: COLORS.success,
                                                fontWeight: 600,
                                                fontSize: '0.875rem',
                                                mb: 0.5
                                            }}
                                        >
                                            Low Priority
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: COLORS.textSecondary,
                                                fontSize: '0.8125rem',
                                                lineHeight: 1.5
                                            }}
                                        >
                                            General questions, feature requests, non-urgent issues. Response within 48 hours.
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography 
                                            variant="subtitle2" 
                                            sx={{ 
                                                color: COLORS.warning,
                                                fontWeight: 600,
                                                fontSize: '0.875rem',
                                                mb: 0.5
                                            }}
                                        >
                                            Medium Priority
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: COLORS.textSecondary,
                                                fontSize: '0.8125rem',
                                                lineHeight: 1.5
                                            }}
                                        >
                                            Minor bugs, account issues, important questions. Response within 24 hours.
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography 
                                            variant="subtitle2" 
                                            sx={{ 
                                                color: COLORS.error,
                                                fontWeight: 600,
                                                fontSize: '0.875rem',
                                                mb: 0.5
                                            }}
                                        >
                                            High Priority
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: COLORS.textSecondary,
                                                fontSize: '0.8125rem',
                                                lineHeight: 1.5
                                            }}
                                        >
                                            Critical bugs, security issues, account blocking. Response within 4 hours.
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Paper>

                            {/* Tips Info */}
                            <Paper 
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: '16px',
                                    backgroundColor: alpha(COLORS.info, 0.08),
                                    border: `1px solid ${alpha(COLORS.info, 0.2)}`,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                }}
                            >
                                <Typography 
                                    variant="subtitle1" 
                                    fontWeight={600}
                                    sx={{ 
                                        color: COLORS.textPrimary,
                                        mb: 2,
                                        fontSize: '1rem'
                                    }}
                                >
                                    Tips for Better Support
                                </Typography>
                                <Stack spacing={1.5}>
                                    {[
                                        "Include specific error messages",
                                        "Describe steps to reproduce",
                                        "Attach screenshots if possible",
                                        "Mention your browser and OS",
                                        "Include relevant account details"
                                    ].map((tip, index) => (
                                        <Stack key={index} direction="row" spacing={1.5} alignItems="flex-start">
                                            <Box
                                                sx={{
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '6px',
                                                    backgroundColor: alpha(COLORS.info, 0.2),
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                    mt: 0.25
                                                }}
                                            >
                                                <Typography 
                                                    variant="caption" 
                                                    sx={{ 
                                                        color: COLORS.info,
                                                        fontWeight: 600,
                                                        fontSize: '0.75rem'
                                                    }}
                                                >
                                                    {index + 1}
                                                </Typography>
                                            </Box>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    color: COLORS.textSecondary,
                                                    fontSize: '0.8125rem',
                                                    lineHeight: 1.5
                                                }}
                                            >
                                                {tip}
                                            </Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Paper>

                            {/* Support Info */}
                            <Paper 
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: '16px',
                                    backgroundColor: alpha(COLORS.success, 0.08),
                                    border: `1px solid ${alpha(COLORS.success, 0.2)}`,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                }}
                            >
                                <Typography 
                                    variant="subtitle1" 
                                    fontWeight={600}
                                    sx={{ 
                                        color: COLORS.textPrimary,
                                        mb: 2,
                                        fontSize: '1rem'
                                    }}
                                >
                                    Support Information
                                </Typography>
                                <Stack spacing={1.5}>
                                    <Box>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                color: COLORS.textSecondary,
                                                fontWeight: 600,
                                                fontSize: '0.7rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                mb: 0.5,
                                                display: 'block'
                                            }}
                                        >
                                            Working Hours
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: COLORS.textPrimary,
                                                fontSize: '0.875rem',
                                                fontWeight: 500
                                            }}
                                        >
                                            Monday - Friday: 9:00 AM - 6:00 PM (GMT)
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                color: COLORS.textSecondary,
                                                fontWeight: 600,
                                                fontSize: '0.7rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                mb: 0.5,
                                                display: 'block'
                                            }}
                                        >
                                            Response Time
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: COLORS.textPrimary,
                                                fontSize: '0.875rem',
                                                fontWeight: 500
                                            }}
                                        >
                                            Based on priority level selected
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                color: COLORS.textSecondary,
                                                fontWeight: 600,
                                                fontSize: '0.7rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                mb: 0.5,
                                                display: 'block'
                                            }}
                                        >
                                            Updates
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: COLORS.textPrimary,
                                                fontSize: '0.875rem',
                                                fontWeight: 500
                                            }}
                                        >
                                            You will receive email notifications for ticket updates
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Stack>
                    </Box>
                </Stack>
            </Box>
        </Container>
    );
}

export default NewTicket;